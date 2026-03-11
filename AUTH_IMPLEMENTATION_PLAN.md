# Auth Implementation Plan — Showcase Website

*Owner: Alex | Created: 2026-03-08*

**Goal:** Connect the showcase site to the same Supabase project as the Rizen app. One user pool — register on the website, log into the app, and vice versa.

**Current state:** All auth is fake. `AuthModal.tsx` accepts any credentials, fakes a delay with `setTimeout`, sets `isLoggedIn = true`. `demoPlayer.ts` provides hardcoded mock user data. No session persistence, no tokens, no API calls.

---

## Tech Stack Context

- Showcase: React 19 + TypeScript + Vite 7
- Rizen app: Flutter + Supabase (`supabase_flutter: ^2.8.4`)
- Rizen web dashboard: React + `@supabase/supabase-js: ^2.97.0`
- Supabase project URL: same as in Rizen root `.env` (`SUPABASE_URL`)
- Auth method: email + password (no OAuth)

---

## Phase 1 — Supabase Client Setup

| # | Task | File | Details |
|---|---|---|---|
| 1 | Install Supabase SDK | `package.json` | `npm i @supabase/supabase-js` (match `^2.97.0`) |
| 2 | Create `.env` | `.env` | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — same values as root `.env` |
| 3 | Create `.env.example` | `.env.example` | Template with placeholder values |
| 4 | Update `.gitignore` | `.gitignore` | Add `.env` if not already present |
| 5 | Create Supabase client | `src/lib/supabase.ts` | **New file** — `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)` |

---

## Phase 2 — Auth Context

| # | Task | File | Details |
|---|---|---|---|
| 6 | Create AuthContext | `src/context/AuthContext.tsx` | **New file** — provides `user`, `session`, `loading`, `signIn()`, `signUp()`, `signOut()` |
| 7 | Wrap app in provider | `src/main.tsx` | Wrap `<App />` in `<AuthProvider>` |
| 8 | Remove mock auth state | `src/App.tsx` | Delete `isLoggedIn` useState + `handleLoginSuccess` + `handleLogout`. Derive auth from context (`user !== null`) |

### AuthContext shape:

```tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}
```

On mount, listen to `supabase.auth.onAuthStateChange()` to track session.

---

## Phase 3 — Rewrite AuthModal

| # | Task | File | Details |
|---|---|---|---|
| 9 | Rewrite login logic | `src/components/features/AuthModal.tsx` | Replace `setTimeout` theater with `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`. Keep existing UI/animations/styling. Add real error messages. |
| 10 | Handle registration | Same file | On sign-up success, create a row in `profiles` table (see Profile Schema below) |
| 11 | Error states | Same file | Show actual errors: "Invalid credentials", "Email already registered", "Password too short", etc. |

---

## Phase 4 — Profile Hook (Replace demoPlayer)

| # | Task | File | Details |
|---|---|---|---|
| 12 | Create usePlayerProfile | `src/hooks/usePlayerProfile.ts` | **New file** — fetches from `profiles` table using `user_id`. Returns data shaped for Dashboard components. |
| 13 | Update Dashboard | `src/components/dashboard/Dashboard.tsx` | Use `usePlayerProfile()` instead of `demoPlayer` import |
| 14 | Update Navbar | `src/components/Navbar.tsx` | Pull user from AuthContext. Show real name. Call context `signOut()` on disconnect. |
| 15 | Delete demoPlayer | `src/data/demoPlayer.ts` | **Delete** — no longer needed |

---

## Phase 5 — Polish

| # | Task | File | Details |
|---|---|---|---|
| 16 | Loading state | `src/App.tsx` | Show loading indicator while checking auth session on mount |
| 17 | Password reset | `AuthModal.tsx` | Add "Forgot password?" → `supabase.auth.resetPasswordForEmail()` |
| 18 | Session persistence | Automatic | Supabase stores JWT in localStorage — login survives page refresh |

---

## Profile Schema (for new user registration)

When a user signs up via the showcase website, insert this into the `profiles` table:

```ts
{
  user_id: authUser.id,       // from Supabase auth
  name: formDisplayName,      // from registration form
  main_class: formClass,      // "Security Analyst", "Software Engineer", "Web Developer", "Game Developer"
  side_class: "",
  level: 1,
  current_xp: 0,
  rep: 0,
  class_xp: {},
  class_level: {},
  inventory: {},
  streak: 0,
  shields: 0,
  title: "",
  hp: 100,
  max_hp: 100,
  equipped_weapon: "",
  active_buffs: {},
  achievements: {},
  featured_achievement: "",
  quests_completed: 0,
  monsters_killed: 0,
  equipped_cosmetics: {},
  onboarding_complete: false,  // IMPORTANT: app's onboarding still runs
  updated_at: new Date().toISOString()
}
```

**Critical:** `onboarding_complete: false` ensures the Flutter app's onboarding flow still triggers for users who registered on the website.

---

## Files Touched Summary

| File | Action |
|---|---|
| `package.json` | Add `@supabase/supabase-js` |
| `.env` | **New** — Supabase credentials |
| `.env.example` | **New** — template |
| `.gitignore` | Add `.env` |
| `src/lib/supabase.ts` | **New** — client init |
| `src/context/AuthContext.tsx` | **New** — auth state provider |
| `src/hooks/usePlayerProfile.ts` | **New** — profile data fetcher |
| `src/components/features/AuthModal.tsx` | **Rewrite** — real auth calls |
| `src/App.tsx` | **Edit** — remove mock state, use context |
| `src/main.tsx` | **Edit** — wrap in AuthProvider |
| `src/components/Navbar.tsx` | **Edit** — use context |
| `src/components/dashboard/Dashboard.tsx` | **Edit** — use profile hook |
| `src/data/demoPlayer.ts` | **Delete** |

---

## NOT in scope

- OAuth (Google/GitHub login) — not in the app, don't add here
- Modifying the `profiles` table schema — match what exists
- Touching Flutter app code — zero changes needed
- Quest/combat gameplay on website — read-only showcase
- Role-based access control — overkill for showcase
- Custom email templates — Supabase defaults are fine

---

## Reference Files (Rizen app)

These files show how the app handles the same operations:

- `app/lib/services/supabase_service.dart` — all Supabase queries (loadProfile, saveProfile)
- `app/lib/screens/auth_screen.dart` — sign in/up flows
- `app/lib/models/player_data.dart` — PlayerData model (profile schema source of truth)
- `app/lib/config.dart` — env var loading
- `web/src/supabaseClient.ts` — web client init pattern to mirror
- `app/lib/main.dart` — session check on startup
