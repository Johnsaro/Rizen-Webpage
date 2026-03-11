import './dashboard.css';
import type { DemoPlayer } from '../../data/demoPlayer';
import PlayerCard from './PlayerCard';
import QuestBoard from './QuestBoard';
import ArsenalGrid from './ArsenalGrid';
import AchievementGrid from './AchievementGrid';
import CombatPreview from './CombatPreview';
import LeaderboardTeaser from './LeaderboardTeaser';
import SystemLog from './SystemLog';
import ActiveBounties from './ActiveBounties';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';

interface DashboardProps {
    user: DemoPlayer;
}

const Dashboard = ({ user: mockUser }: DashboardProps) => {
    const { profile, quests, notifications, bounties, loading, error } = usePlayerProfile();

    // Merge real data with mock defaults
    const activeUser = {
        ...mockUser,
        name: profile?.name ?? mockUser.name,
        class: profile?.main_class ?? mockUser.class,
        level: profile?.level ?? mockUser.level,
        stats: {
            ...mockUser.stats,
            hp: {
                current: profile?.hp ?? mockUser.stats.hp.current,
                max: profile?.max_hp ?? mockUser.stats.hp.max
            },
            xp: {
                current: profile?.current_xp ?? mockUser.stats.xp.current,
                max: mockUser.stats.xp.max,
            },
            rep: profile?.rep ?? mockUser.stats.rep,
            streak: profile?.streak ?? mockUser.stats.streak
        },
        quests: quests.length > 0 ? (quests as any) : mockUser.quests,
        // Achievements and Inventory are now fully dynamic from the profile object
    };

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="loading-glitch" data-text="SYNCING OPERATIVE DATA...">SYNCING OPERATIVE DATA...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '2rem' }}>
                <div className="glitch-text" data-text="CONNECTION ERROR">CONNECTION ERROR</div>
                <p style={{ color: 'var(--accent-crimson)', fontFamily: 'Fira Code' }}>{error}</p>
                <button className="terminal-button" onClick={() => window.location.reload()}>RE-ESTABLISH CONNECTION</button>
            </div>
        );
    }

    return (
        <div id="dashboard-home" className="dashboard-container">
            <div className="dashboard-bento">
                {/* Left Column (Main Stats & Intel) */}
                <div className="dashboard-col-left">
                    <PlayerCard user={activeUser} delay={0.1} />
                    <ActiveBounties bounties={bounties} delay={0.2} />
                    <QuestBoard quests={activeUser.quests} delay={0.3} />
                </div>

                {/* Middle Column (Arsenal & Combat) */}
                <div className="dashboard-col-middle">
                    <ArsenalGrid 
                        inventory={profile?.inventory} 
                        equippedWeapon={profile?.equipped_weapon} 
                        delay={0.4} 
                    />
                    <CombatPreview delay={0.5} />
                </div>

                {/* Right Column (Leaderboard & Achievements) */}
                <div className="dashboard-col-right">
                    <LeaderboardTeaser currentUser={activeUser} delay={0.6} />
                    <AchievementGrid 
                        achievements={profile?.achievements} 
                        featuredAchievement={profile?.featured_achievement} 
                        delay={0.7} 
                    />
                    <SystemLog notifications={notifications} delay={0.8} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
