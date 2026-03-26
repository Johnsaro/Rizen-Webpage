/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-14 
 */
import './dashboard.css';
import './cultivation-v2.css';
import PlayerCard from './PlayerCard';
import RealmProgression from './RealmProgression';
import DaoHeartPanel from './DaoHeartPanel';
import ArtifactPillPanel from './ArtifactPillPanel';
import EventFeed from './EventFeed';
import TrialChamber from './TrialChamber';
import SectTransmissions from './SectTransmissions';
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

            <div className="v2-dashboard-grid" style={isPreview ? { filter: 'saturate(0.8)', cursor: 'pointer' } : {}} onClick={isPreview ? onInteract : undefined}>
                {/* Left Column: Trial Chamber & Transmissions */}
                <div className="dashboard-col-left">
                    <TrialChamber quests={quests} delay={0.1} />
                    <SectTransmissions playerName={profile.name} delay={0.2} />
                </div>

                {/* Center Column: Realm, Stats, Dao Heart, Artifacts */}
                <div className="v2-center-col">
                    <RealmProgression realm={profile.main_class || "Mortal"} rank={profile.level || 1} delay={0.3} />
                    <PlayerCard profile={profile} delay={0.4} />
                    <DaoHeartPanel streak={profile.streak || 0} delay={0.5} />
                    <ArtifactPillPanel profile={profile} delay={0.6} />
                </div>

                {/* Right Column: Event Feed, Bounties, Log */}
                <div className="dashboard-col-right">
                    <EventFeed notifications={notifications} delay={0.7} />
                    <ActiveBounties bounties={bounties} delay={0.8} />
                    <SystemLog 
                        notifications={notifications} 
                        playerName={profile.name} 
                        delay={0.9} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
