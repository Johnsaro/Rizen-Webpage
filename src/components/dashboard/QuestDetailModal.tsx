import React from 'react';
import type { Quest } from '../../hooks/usePlayerProfile';

interface QuestDetailModalProps {
  quest: Quest | null;
  onClose: () => void;
}

const QuestDetailModal: React.FC<QuestDetailModalProps> = ({ quest, onClose }) => {
  if (!quest) return null;

  const progress = quest.total_steps ? Math.round((quest.current_step || 0) / quest.total_steps * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal-content quest-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="sm-header">
          <div className="sm-header-left">
            <div className="sm-icon">📜</div>
            <div>
              <div className="sm-badge">TRIAL_INTEL</div>
              <h2 className="sm-title">{quest.title}</h2>
              <p className="sm-subtitle">Rank: {quest.rank} · {quest.type}</p>
            </div>
          </div>
          <button className="sm-close" onClick={onClose}>✕</button>
        </div>

        <div className="quest-detail-body" style={{ padding: '1.5rem', color: 'var(--text-main)' }}>
          <div className="qd-section" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>OBJECTIVE</h4>
            <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{quest.description}</p>
          </div>

          <div className="qd-section" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>PROGRESS</h4>
            <div className="quest-progress-container" style={{ height: '8px', marginBottom: '0.5rem' }}>
              <div className="quest-progress-fill" style={{ width: `${progress}%`, background: 'var(--accent-cyan)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>Step {quest.current_step || 0} of {quest.total_steps || 1}</span>
              <span>{progress}% Complete</span>
            </div>
          </div>

          <div className="qd-rewards" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>REWARD_QI</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>+{quest.xp_reward} Qi</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>REWARD_SPIRIT_STONES</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>+{(quest.xp_reward / 10).toFixed(0)} Spirit Stones</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>DAO PATH</span>
              <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>{quest.class_tag.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="sm-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem' }}>
          <button className="sm-btn-ghost" onClick={onClose}>Close Briefing</button>
          <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }} onClick={() => window.location.hash = '#/community/hub'}>
            Go to Sect Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestDetailModal;
