import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import BannedScreen from '../features/BannedScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, loading: authLoading, signOut } = useAuth();
    const { profile, loading: profileLoading, error: profileError } = usePlayerProfile();

    const isLoading = authLoading || (profileLoading && !!user);

    if (isLoading) {
        return (
            <div className="abc-gate">
                <div className="loading-glitch" data-text="VERIFYING SECURITY CLEARANCE...">VERIFYING SECURITY CLEARANCE...</div>
            </div>
        );
    }

    // Handle authentication required
    if (!user) {
        return (
            <div className="abc-gate">
                <div className="glitch-text" data-text="ACCESS DENIED">ACCESS DENIED</div>
                <p>AUTHENTICATION REQUIRED TO ACCESS THIS NODE</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="terminal-button" onClick={() => window.location.hash = '#/'}>RETURN TO HUB</button>
                    <button className="terminal-button" onClick={() => window.location.reload()}>RE-INITIALIZE AUTH</button>
                </div>
            </div>
        );
    }

    // Handle ban/suspend status (W20)
    if (profile?.account_status === 'banned' || profile?.account_status === 'suspended') {
        const isSuspended = profile.account_status === 'suspended';
        const isStillSuspended = isSuspended && profile.suspended_until && new Date(profile.suspended_until) > new Date();

        if (profile.account_status === 'banned' || isStillSuspended) {
            return (
                <BannedScreen 
                    status={profile.account_status as 'banned' | 'suspended'} 
                    reason={profile.ban_reason}
                    until={profile.suspended_until}
                    onLogout={() => {
                        signOut();
                        window.location.hash = '#/';
                    }}
                />
            );
        }
    }

    // Handle admin clearance (W15)
    // If profile load failed or profile is null when admin is required, deny access
    if (requireAdmin && (!profile || !profile.is_admin)) {
        return (
            <div className="abc-gate">
                <div className="glitch-text" data-text="CLEARANCE LEVEL INSUFFICIENT">CLEARANCE LEVEL INSUFFICIENT</div>
                <p>{profileError ? `ERROR: ${profileError}` : 'ADMINISTRATOR PRIVILEGES REQUIRED'}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="terminal-button" onClick={() => window.location.hash = '#/'}>RETURN TO HUB</button>
                    <button className="terminal-button" onClick={() => window.location.reload()}>RE-CHECK CLEARANCE</button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
