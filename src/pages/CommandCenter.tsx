import React, { useState, useEffect } from 'react';
import './AdminBountyConsole.css';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import AdminBountyConsole from './AdminBountyConsole';
import { useAuth } from '../context/AuthContext';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

const CommandCenter: React.FC = () => {
    const { signOut } = useAuth();
    const { profile } = usePlayerProfile();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Sync hash with tab for deep linking
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash === '#/command-center/overview') setActiveTab('overview');
            else if (hash === '#/command-center/users') setActiveTab('users');
            else setActiveTab('overview');
        };

        window.addEventListener('hashchange', handleHash);
        handleHash();
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const setTab = (tab: string) => {
        setActiveTab(tab);
        window.location.hash = `#/command-center/${tab}`;
    };

    const handleLogout = () => {
        signOut();
        window.location.hash = '#/';
    };

    return (
        <div className="abc-page admin-command-center">
            <AdminNavbar 
                currentTab={activeTab} 
                setCurrentTab={setTab} 
                adminName={profile?.name || 'ADMIN'} 
                onLogout={handleLogout} 
            />

            <div style={{ marginTop: '100px', padding: '0 2rem' }}>
                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'bounty' && <AdminBountyConsole isIntegrated={true} />}
                {activeTab === 'users' && <UserManagement />}
            </div>
        </div>
    );
};

export default CommandCenter;
