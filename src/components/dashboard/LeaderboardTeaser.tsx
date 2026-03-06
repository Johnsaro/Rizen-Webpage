import type { DemoPlayer } from '../../data/demoPlayer';

const LeaderboardTeaser = ({ currentUser, delay = 0.5 }: { currentUser: DemoPlayer, delay?: number }) => {
    // Mock leaderboard data
    const players = [
        { rank: 1, name: 'V0idWalker', rep: '94,200', class: 'Sec Admin' },
        { rank: 2, name: 'NeoConstruct', rep: '89,450', class: 'Software Eng' },
        { rank: 3, name: currentUser.name, rep: currentUser.stats.rep.toLocaleString(), class: currentUser.class, isCurrentUser: true },
        { rank: 4, name: 'CypherPunk', rep: '77,800', class: 'Web Dev' },
        { rank: 5, name: 'GhostWire', rep: '76,100', class: 'Red Team' },
    ];

    return (
        <div id="dashboard-leaderboard" className="dash-card leaderboard-teaser fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">GLOBAL RANKINGS</h3>
                <div className="header-action">FULL LIST</div>
            </div>

            <div className="leaderboard-list">
                {players.map((player, index) => (
                    <div key={player.rank} className={`lb-row premium-hover ${player.isCurrentUser ? 'current-user pulse-border' : ''} ${player.rank === 1 ? 'rank-one premium-glow-gold' : ''}`} style={{ animationDelay: `${delay + 0.1 + index * 0.05}s` }}>
                        <div className="lb-rank">#{player.rank}</div>
                        <div className="lb-info">
                            <div className={`lb-name ${player.rank === 1 ? 'gold-text' : ''}`}>{player.name}</div>
                            <div className="lb-class">{player.class}</div>
                        </div>
                        <div className="lb-rep">{player.rep}</div>
                    </div>
                ))}
            </div>

            <div className="lb-footer">
                FULL RANKINGS COMING SOON
            </div>
        </div>
    );
};

export default LeaderboardTeaser;
