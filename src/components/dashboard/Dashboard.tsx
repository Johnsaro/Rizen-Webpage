/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-14 
 */
import './dashboard.css';
import PlayerCard from './PlayerCard';
import QuestBoard from './QuestBoard';
import ArsenalGrid from './ArsenalGrid';
import AchievementGrid from './AchievementGrid';
import CombatPreview from './CombatPreview';
import PersonalRecordsTeaser from './PersonalRecordsTeaser';
import SystemLog from './SystemLog';
import ActiveBounties from './ActiveBounties';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';

interface DashboardProps {
    user: any; // Legacy prop
    isPreview?: boolean;
    onInteract?: () => void;
}

const Dashboard = ({ user: legacyUser, isPreview, onInteract }: DashboardProps) => {
    const { profile, quests, notifications, bounties, loading, error } = usePlayerProfile();

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="loading-glitch" data-text="SYNCING CULTIVATOR DATA...">SYNCING CULTIVATOR DATA...</div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '2rem' }}>
                <div className="glitch-text" data-text="CONNECTION ERROR">CONNECTION ERROR</div>
                <p style={{ color: 'var(--accent-crimson)', fontFamily: 'Fira Code' }}>{error || 'PROFILE NOT FOUND'}</p>
                <button className="terminal-button" onClick={() => window.location.reload()}>RE-ESTABLISH CONNECTION</button>
            </div>
        );
    }

    return (
        <div id="dashboard-home" className={`dashboard-container ${isPreview ? 'preview-mode' : ''}`}>
            {isPreview && (
                <>
                    <div className="preview-banner" onClick={onInteract}>
                        <div className="banner-content">
                            <span className="banner-glitch">CULTIVATOR DETECTED AS GUEST. PROGRESS IS VOLATILE.</span>
                            <button className="banner-cta">[BIND SYSTEM TO PERSIST DATA]</button>
                        </div>
                    </div>
                    <div className="preview-watermark">PREVIEW MODE</div>
                </>
            )}

            <div className="dashboard-bento" style={isPreview ? { filter: 'saturate(0.8)', cursor: 'pointer' } : {}} onClick={isPreview ? onInteract : undefined}>
                {/* Left Column (Main Stats & Intel) */}
                <div className="dashboard-col-left">
                    <PlayerCard profile={profile} delay={0.1} />
                    <ActiveBounties bounties={bounties} delay={0.2} />
                    <QuestBoard quests={quests} delay={0.3} onQuestClick={isPreview ? onInteract : undefined} />
                </div>

                {/* Middle Column (Arsenal & Combat) */}
                <div className="dashboard-col-middle">
                    <ArsenalGrid 
                        inventory={profile.inventory} 
                        equippedWeapon={profile.equipped_weapon} 
                        delay={0.4} 
                        onItemClick={isPreview ? onInteract : undefined}
                    />
                    <CombatPreview delay={0.5} onCombatClick={isPreview ? onInteract : undefined} />
                </div>

                {/* Right Column (Personal Records & Achievements) */}
                <div className="dashboard-col-right">
                    <PersonalRecordsTeaser profile={profile} delay={0.6} onRecordClick={isPreview ? onInteract : undefined} />
                    <AchievementGrid 
                        achievements={profile.achievements} 
                        featuredAchievement={profile.featured_achievement} 
                        delay={0.7} 
                        onAchievementClick={isPreview ? onInteract : undefined}
                    />
                    <SystemLog 
                        notifications={notifications} 
                        playerName={profile.name} 
                        delay={0.8} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
