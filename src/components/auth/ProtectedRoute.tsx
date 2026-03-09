import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = usePlayerProfile();

    const isLoading = authLoading || (requireAdmin && profileLoading);

    if (isLoading) {
        return (
            <div className="abc-gate">
                <div className="loading-glitch" data-text="VERIFYING SECURITY CLEARANCE...">VERIFYING SECURITY CLEARANCE...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="abc-gate">
                <div className="glitch-text" data-text="ACCESS DENIED">ACCESS DENIED</div>
                <p>AUTHENTICATION REQUIRED TO ACCESS THIS NODE</p>
                <button className="terminal-button" onClick={() => window.location.hash = '#/'}>RETURN TO HUB</button>
            </div>
        );
    }

    if (requireAdmin && !profile?.is_admin) {
        return (
            <div className="abc-gate">
                <div className="glitch-text" data-text="CLEARANCE LEVEL INSUFFICIENT">CLEARANCE LEVEL INSUFFICIENT</div>
                <p>ADMINISTRATOR PRIVILEGES REQUIRED</p>
                <button className="terminal-button" onClick={() => window.location.hash = '#/'}>RETURN TO HUB</button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
