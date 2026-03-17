import React from 'react';
import './AgentNetwork.css';

interface Agent {
    id: string;
    name: string;
    role: string;
    status: 'ACTIVE' | 'AVAILABLE';
    projects: string[];
    icon: React.ReactNode;
}

const agentsData: Agent[] = [
    {
        id: 'claude',
        name: 'Claude',
        role: 'Primary Reasoning / System Design',
        status: 'ACTIVE',
        projects: ['Rizen Mobile Launch', 'Rizen Mobile Protocol'],
        icon: (
            <svg viewBox="0 0 24 24" fill="#D97757" className="agent-icon" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 17.5l4-3 4 3V6.5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v11z" />
                <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" />
            </svg>
        )
    },
    {
        id: 'gemini',
        name: 'Gemini',
        role: 'Research & Alternate Approaches',
        status: 'AVAILABLE',
        projects: ['PhantomPeel Forensics'],
        icon: (
            <svg viewBox="0 0 24 24" fill="url(#gemini-grad)" className="agent-icon">
                <defs>
                    <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4185EE" />
                        <stop offset="33%" stopColor="#8d54ec" />
                        <stop offset="66%" stopColor="#ff575a" />
                        <stop offset="100%" stopColor="#fcb614" />
                    </linearGradient>
                </defs>
                <path d="M12.0001 2.3999C12.0001 2.3999 12.0001 9.5999 19.2001 12C12.0001 14.4 12.0001 21.6 12.0001 21.6C12.0001 21.6 12.0001 14.4 4.80005 12C12.0001 9.5999 12.0001 2.3999 12.0001 2.3999Z" />
            </svg>
        )
    },
    {
        id: 'cursor',
        name: 'Cursor',
        role: 'Execution / IDE Agent',
        status: 'AVAILABLE',
        projects: [],
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="agent-icon" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.986 21.657L6 24V2L21 16.035L14.708 17.58L17.567 23.472L14.936 24.743L12.072 18.845L12.986 21.657Z" />
            </svg>
        )
    },
    {
        id: 'antigravity',
        name: 'Anti-Gravity',
        role: 'UI Motion & UX Polish',
        status: 'ACTIVE',
        projects: ['Rizen Showcase Homepage'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="agent-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
                <path d="M12 2v4"></path>
                <path d="M12 18v4"></path>
            </svg>
        )
    }
];

const AgentNetwork: React.FC = () => {
    return (
        <section className="agent-network-section section-padding">
            <div className="agent-network-container">
                <div className="centered-header reveal visible">
                    <div className="status-tag pulse-border" style={{ display: 'inline-block', marginBottom: '1rem' }}>OPERATORS</div>
                    <h2 className="glitch-title" data-text="AGENT NETWORK">AGENT NETWORK</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>
                        Specialized operators powering the Rizen pipeline.
                    </p>
                </div>

                <div className="agent-grid">
                    {agentsData.map((agent, index) => (
                        <button
                            key={agent.id}
                            className="agent-card reveal visible"
                            style={{ 
                                transitionDelay: `${index * 0.1}s`,
                                background: 'none',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textAlign: 'left',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                color: 'inherit'
                            }}
                            aria-label={`Agent ${agent.name}, ${agent.role}`}
                        >
                            <div className="agent-card__header">
                                <div className="agent-card__icon-wrap">
                                    {agent.icon}
                                </div>
                                <div className="agent-card__title-wrap">
                                    <h3 className="agent-name">{agent.name}</h3>
                                    <div className={`agent-status status-${agent.status.toLowerCase()}`}>
                                        {agent.status === 'ACTIVE' && <span className="status-dot pulse-dot"></span>}
                                        {agent.status}
                                    </div>
                                </div>
                            </div>

                            <div className="agent-card__body">
                                <p className="agent-role">{agent.role}</p>
                                <div className="empty-spacer"></div>
                            </div>

                            {agent.projects.length > 0 && (
                                <div className="agent-card__footer">
                                    <span className="used-on-label">USED ON</span>
                                    <div className="project-chips">
                                        {agent.projects.map(proj => (
                                            <span key={proj} className="project-chip">{proj}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AgentNetwork;
