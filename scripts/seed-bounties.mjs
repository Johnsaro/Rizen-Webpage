import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const operatives = [
  'V0idWalker', 'NeoConstruct', 'GhostWire', 'ShadowPulse', 'CipherNova',
  'ByteWraith', 'ZeroCool', 'IronSigma', 'NullVector', 'PhantomEdge',
  'ArcReaper', 'HexMantis', 'DeadPixel', 'QuantumDrift', 'SilkThread',
  'RedShift', 'BinaryGhost', 'NightCrawler', 'DataSpike', 'EchoVoid'
];

const statuses = ['received', 'confirmed', 'fixed', 'rejected'];

const bugs = [
  { title: 'Auth token persists after forced logout', severity: 'Critical', component: 'Auth Service', description: 'When a user is force-logged out by an admin, the JWT token remains valid in localStorage and can be reused to make authenticated API calls.', steps: '1. Login as user\\n2. Admin force-logs out user\\n3. Use stored token to call /api/profile\\n4. Request succeeds with stale token' },
  { title: 'Qi calculation overflow on level 99+', severity: 'Critical', component: 'Qi Engine', description: 'Qi values wrap around to negative when a player exceeds level 99 due to integer overflow in the XP multiplier.', steps: '1. Reach level 99\\n2. Gain enough XP to level up\\n3. Qi value becomes negative' },
  { title: 'Race condition in Spirit Stone transfer', severity: 'Critical', component: 'Spirit Stone Economy', description: 'Two simultaneous transfer requests can both succeed, duplicating Spirit Stones. Balance check is not atomic.', steps: '1. Have 100 Spirit Stones\\n2. Send two simultaneous transfers for 100 each\\n3. Both succeed' },
  { title: 'Session hijack via predictable session IDs', severity: 'Critical', component: 'Session Handler', description: 'Session IDs follow a predictable sequential pattern allowing enumeration and hijacking.', steps: '1. Create multiple sessions\\n2. Note ID pattern\\n3. Predict next session ID\\n4. Access another user session' },
  { title: 'SQL injection in leaderboard search', severity: 'Critical', component: 'Leaderboard', description: 'Player search field does not sanitize input, allowing SQL injection through the name parameter.', steps: "1. Go to Leaderboard\\n2. Enter: ' OR 1=1 --\\n3. All players returned" },
  { title: 'XSS in guild name field', severity: 'Critical', component: 'Guild System', description: 'Guild names rendered without escaping. Script tags in guild names execute for other players.', steps: '1. Create guild with script tag name\\n2. Another user views guild list\\n3. JS executes' },
  { title: 'Combat damage multiplier stacks infinitely', severity: 'High', component: 'Combat System', description: 'Critical hit damage multiplier does not reset between rounds, stacking exponentially across fights.', steps: '1. Enter combat\\n2. Land 3 critical hits\\n3. Exit and re-enter\\n4. First hit applies previous stack' },
  { title: 'Inventory duplication on disconnect', severity: 'High', component: 'Inventory Manager', description: 'Client disconnect mid-transaction while equipping causes item to appear in both inventory and equipped slots.', steps: '1. Start equipping item\\n2. Kill network mid-animation\\n3. Reconnect\\n4. Item duplicated' },
  { title: 'Notification spam on achievement unlock', severity: 'High', component: 'Notification Hub', description: 'Achievement notification fires repeatedly on every profile page load instead of once.', steps: '1. Unlock achievement\\n2. Navigate to profile\\n3. Navigate away and back\\n4. Notification fires again' },
  { title: 'Leaderboard shows deleted accounts', severity: 'High', component: 'Leaderboard', description: 'Deleted accounts still appear on leaderboard. Cleanup job misses leaderboard entries.', steps: '1. Note player on leaderboard\\n2. Delete account\\n3. Refresh leaderboard\\n4. Still visible' },
  { title: 'Profile image upload bypasses size limit', severity: 'High', component: 'Profile Service', description: '2MB limit only enforced client-side. Direct API calls upload arbitrarily large files.', steps: '1. POST 50MB image to /api/profile/avatar\\n2. Upload succeeds\\n3. No server validation' },
  { title: 'Daily login streak resets on timezone change', severity: 'High', component: 'Daily Login', description: 'Changing device timezone breaks daily login streak calculation, resetting to 0.', steps: '1. Have 7-day streak\\n2. Change timezone\\n3. Open app\\n4. Streak shows 0' },
  { title: 'Quest completion callback fires twice', severity: 'High', component: 'Quest Engine', description: 'Quest completion handler fires twice on final objective, awarding double rewards.', steps: '1. Accept quest\\n2. Complete all objectives\\n3. Rewards doubled' },
  { title: 'Matchmaking pairs players with 50+ level gap', severity: 'High', component: 'Matchmaking', description: 'Algorithm pairs level 5 with level 60+ during off-peak hours.', steps: '1. Queue as level 5 off-peak\\n2. Matched with level 60+' },
  { title: 'Achievement tracker shows 101% completion', severity: 'Medium', component: 'Achievement Tracker', description: 'Completion percentage exceeds 100% due to rounding error with hidden achievements.', steps: '1. Complete all visible achievements\\n2. Unlock hidden one\\n3. Shows 101%' },
  { title: 'Guild chat messages appear out of order', severity: 'Medium', component: 'Guild System', description: 'Messages appear out of chronological order when sent within the same second.', steps: '1. Three members send messages rapidly\\n2. Messages not in send-order' },
  { title: 'Qi bar animation stutters on low-end devices', severity: 'Medium', component: 'Qi Engine', description: 'Qi progress bar animation causes frame drops on devices under 4GB RAM.', steps: '1. Open app on low-end device\\n2. Trigger Qi bar animation\\n3. Frame drops observed' },
  { title: 'Combat log truncates after 50 entries', severity: 'Medium', component: 'Combat System', description: 'Combat log only keeps last 50 entries. Longer fights lose early-round data.', steps: '1. Fight 50+ rounds\\n2. Try scrolling to early rounds\\n3. Data gone' },
  { title: 'Notification badge count desyncs', severity: 'Medium', component: 'Notification Hub', description: 'Unread badge shows different count than actual unread notifications.', steps: '1. Receive 5 notifications\\n2. Read 2\\n3. Badge still shows 5' },
  { title: 'Profile bio allows HTML entities', severity: 'Medium', component: 'Profile Service', description: 'HTML entities render as raw text instead of decoded characters in bio.', steps: '1. Set bio to "Tom &amp; Jerry"\\n2. Shows literal &amp;' },
  { title: 'Inventory sort resets on page change', severity: 'Medium', component: 'Inventory Manager', description: 'Rarity sort resets to default when navigating to page 2.', steps: '1. Sort by rarity\\n2. Go to page 2\\n3. Back to default sort' },
  { title: 'Spirit Stone history missing timestamps', severity: 'Medium', component: 'Spirit Stone Economy', description: 'Transaction history shows "Invalid Date" for Spirit Stone transfers.', steps: '1. Transfer Spirit Stones\\n2. Check history\\n3. "Invalid Date" shown' },
  { title: 'Session timeout too aggressive on mobile', severity: 'Medium', component: 'Session Handler', description: 'Mobile sessions timeout after 5min backgrounding, forcing re-login.', steps: '1. Login on mobile\\n2. Switch apps 5 min\\n3. Return — forced re-login' },
  { title: 'Auth error leaks email existence', severity: 'Medium', component: 'Auth Service', description: 'Login errors differ between wrong password and account not found, enabling email enumeration.', steps: '1. Try non-existent email — "Not found"\\n2. Try valid email wrong pass — "Incorrect password"' },
  { title: 'Leaderboard pagination off by one', severity: 'Low', component: 'Leaderboard', description: 'Last player on page 1 duplicates as first on page 2.', steps: '1. View page 1 last entry\\n2. Go to page 2\\n3. Same player first' },
  { title: 'Quest description overflows on small screens', severity: 'Low', component: 'Quest Engine', description: 'Long quest descriptions overflow container on screens under 360px.', steps: '1. Open long quest on narrow screen\\n2. Text overlaps buttons' },
  { title: 'Guild invite button has no loading state', severity: 'Low', component: 'Guild System', description: 'No loading indicator on invite button, users click multiple times sending duplicates.', steps: '1. Click Invite\\n2. No feedback\\n3. Click again\\n4. Duplicate invite sent' },
  { title: 'Achievement sound plays in silent mode', severity: 'Low', component: 'Achievement Tracker', description: 'Achievement sounds play even when app sound is toggled off.', steps: '1. Turn off sound\\n2. Unlock achievement\\n3. Sound plays' },
  { title: 'Combat skip button misaligned on tablet', severity: 'Low', component: 'Combat System', description: 'Skip Animation button overlaps damage numbers on tablet landscape.', steps: '1. Enter combat on tablet landscape\\n2. Attack\\n3. Button and damage overlap' },
  { title: 'Profile timezone shows UTC not local', severity: 'Low', component: 'Profile Service', description: 'Member since date shows UTC, may differ from actual join day.', steps: '1. View profile\\n2. Member since date off by a day' },
  { title: 'Notification sound plays twice on iOS', severity: 'Low', component: 'Notification Hub', description: 'Push notifications trigger both system and in-app sounds simultaneously on iOS.', steps: '1. Receive notification on iOS\\n2. Two sounds play' },
  { title: 'Inventory tooltip flickers on hover', severity: 'Low', component: 'Inventory Manager', description: 'Tooltip rapidly appears/disappears when cursor is near item icon edge.', steps: '1. Hover on edge of inventory item\\n2. Tooltip flickers' },
  { title: 'Spirit Stone icon invisible in dark mode', severity: 'Low', component: 'Spirit Stone Economy', description: 'Spirit Stone icon uses black fill, invisible on dark backgrounds.', steps: '1. Enable dark mode\\n2. Look at balance\\n3. Icon invisible' },
  { title: 'Daily reward modal blocks interaction', severity: 'Low', component: 'Daily Login', description: 'Daily reward modal has no close button and no outside-click dismiss.', steps: '1. Login\\n2. Modal appears\\n3. No way to close without refresh' },
  { title: 'Matchmaking cancel unresponsive for 2s', severity: 'Low', component: 'Matchmaking', description: 'Cancel button does not respond for ~2 seconds after clicking Find Match.', steps: '1. Click Find Match\\n2. Try cancel immediately\\n3. No response for 2s' },
  { title: 'Session count double-counts refreshes', severity: 'Low', component: 'Session Handler', description: 'Each page refresh counted as new session, inflating analytics.', steps: '1. Login once\\n2. Refresh 5 times\\n3. Analytics shows 6 sessions' },
  { title: 'Password reset link expires too fast', severity: 'Medium', component: 'Auth Service', description: 'Reset links expire in 10 min but emails take 8-9 min to arrive.', steps: '1. Request reset\\n2. Email arrives in ~9 min\\n3. Link already expired' },
  { title: 'Combat rewards not showing in summary', severity: 'Medium', component: 'Combat System', description: 'Post-combat summary shows 0 rewards for fights over 10 minutes.', steps: '1. Fight over 10 min\\n2. Summary shows 0\\n3. Rewards are actually awarded' },
  { title: 'Qi Engine memory leak on level-ups', severity: 'High', component: 'Qi Engine', description: 'Event listeners accumulate on each level-up without cleanup, memory grows ~5MB per level.', steps: '1. Long play session\\n2. Level up multiple times\\n3. Memory grows indefinitely' },
  { title: 'Leaderboard API exposes full user objects', severity: 'High', component: 'Leaderboard', description: '/api/leaderboard returns complete user objects including email and hashed password.', steps: '1. GET /api/leaderboard\\n2. Response contains emails, hashed passwords' },
  { title: 'Guild creation allows duplicate names', severity: 'Medium', component: 'Guild System', description: 'Multiple guilds can have the exact same name, causing confusion.', steps: '1. Create guild "Phoenix"\\n2. Another creates "Phoenix"\\n3. Both exist' },
  { title: 'Achievement progress resets on app update', severity: 'High', component: 'Achievement Tracker', description: 'Progress counters reset to 0 on update because state is in local storage not server.', steps: '1. Have partial progress (73/100)\\n2. Update app\\n3. Counter resets to 0' },
  { title: 'Quest timer uses wrong time source', severity: 'Medium', component: 'Quest Engine', description: 'Timer uses client time but deadline uses server time, causing desync when app is closed.', steps: '1. Accept 30 min quest\\n2. Close app 20 min\\n3. Timer shows 10 min but server has full time' },
  { title: 'ELO not updating after ranked matches', severity: 'Medium', component: 'Matchmaking', description: 'ELO display does not update until re-login after ranked matches.', steps: '1. Win ranked match\\n2. Check ELO — unchanged\\n3. Re-login — now updated' },
];

function esc(s) { return s.replace(/'/g, "''"); }

// Build SQL
let sql = '-- Seed: 44 test bounty submissions\n';
sql += '-- Run this in Supabase SQL Editor (bypasses RLS)\n\n';
sql += 'INSERT INTO bug_bounty_submissions (operative_name, title, severity, component, description, steps, status, created_at)\nVALUES\n';

const rows = bugs.map((bug, i) => {
  const op = operatives[i % operatives.length];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const daysAgo = Math.floor(Math.random() * 14);
  const hoursAgo = Math.floor(Math.random() * 24);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  const ts = d.toISOString();

  return `  ('${esc(op)}', '${esc(bug.title)}', '${bug.severity}', '${esc(bug.component)}', '${esc(bug.description)}', '${esc(bug.steps)}', '${status}', '${ts}')`;
});

sql += rows.join(',\n') + ';\n';

writeFileSync('scripts/seed-bounties.sql', sql);
console.log(`Generated scripts/seed-bounties.sql with ${bugs.length} rows.`);
console.log('Run this SQL in your Supabase SQL Editor at:');
console.log('https://supabase.com/dashboard → SQL Editor → New query → Paste & Run');
