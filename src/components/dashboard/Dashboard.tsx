import './dashboard.css';
import type { DemoPlayer } from '../../data/demoPlayer';
import PlayerCard from './PlayerCard';
import QuestBoard from './QuestBoard';
import ArsenalGrid from './ArsenalGrid';
import AchievementGrid from './AchievementGrid';
import CombatPreview from './CombatPreview';
import LeaderboardTeaser from './LeaderboardTeaser';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';

interface DashboardProps {
    user: DemoPlayer;
}

const Dashboard = ({ user: mockUser }: DashboardProps) => {
    const { profile, quests, loading } = usePlayerProfile();

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
                max: mockUser.stats.xp.max, // Max XP is usually fixed per level
            },
            rep: profile?.rep ?? mockUser.stats.rep,
            streak: profile?.streak ?? mockUser.stats.streak
        },
        quests: quests.length > 0 ? (quests as any) : mockUser.quests
    };

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="loading-glitch" data-text="SYNCING OPERATIVE DATA...">SYNCING OPERATIVE DATA...</div>
            </div>
        );
    }

    return (
        <div id="dashboard-home" className="dashboard-container">
            <div className="dashboard-bento">
                {/* Left Column (Main Stats & Quests) */}
                <div className="dashboard-col-left">
                    <PlayerCard user={activeUser} delay={0.1} />
                    <QuestBoard quests={activeUser.quests} delay={0.2} />
                </div>

                {/* Middle Column (Arsenal & Combat) */}
                <div className="dashboard-col-middle">
                    <ArsenalGrid arsenal={activeUser.arsenal} delay={0.3} />
                    <CombatPreview delay={0.4} />
                </div>

                {/* Right Column (Leaderboard & Achievements) */}
                <div className="dashboard-col-right">
                    <LeaderboardTeaser currentUser={activeUser} delay={0.5} />
                    <AchievementGrid achievements={activeUser.achievements} delay={0.6} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
