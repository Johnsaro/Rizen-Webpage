import './dashboard.css';
import type { DemoPlayer } from '../../data/demoPlayer';
import PlayerCard from './PlayerCard';
import QuestBoard from './QuestBoard';
import ArsenalGrid from './ArsenalGrid';
import AchievementGrid from './AchievementGrid';
import CombatPreview from './CombatPreview';
import LeaderboardTeaser from './LeaderboardTeaser';

interface DashboardProps {
    user: DemoPlayer;
}

const Dashboard = ({ user }: DashboardProps) => {
    return (
        <div id="dashboard-home" className="dashboard-container">
            <div className="dashboard-bento">
                {/* Left Column (Main Stats & Quests) */}
                <div className="dashboard-col-left">
                    <PlayerCard user={user} delay={0.1} />
                    <QuestBoard quests={user.quests} delay={0.2} />
                </div>

                {/* Middle Column (Arsenal & Combat) */}
                <div className="dashboard-col-middle">
                    <ArsenalGrid arsenal={user.arsenal} delay={0.3} />
                    <CombatPreview delay={0.4} />
                </div>

                {/* Right Column (Leaderboard & Achievements) */}
                <div className="dashboard-col-right">
                    <LeaderboardTeaser currentUser={user} delay={0.5} />
                    <AchievementGrid achievements={user.achievements} delay={0.6} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
