import React, { useState } from 'react';
import { ArrowLeftRight, HelpCircle, User, Sparkles } from 'lucide-react';

export default function CorrelationMap({ characters }) {
  const [focusId, setFocusId] = useState(characters[0]?.id || '');

  const focusChar = characters.find(c => c.id === focusId);
  const otherChars = characters.filter(c => c.id !== focusId);

  if (!focusChar) return null;

  return (
    <div className="correlation-container fade-in">
      <div className="chart-header">
        <h2 className="chart-title">
          <span className="glow-text" style={{ color: 'var(--accent-neon-pink)' }}>CORRELATION MAP</span>
          <span className="sub-title">相関図・関係性ナビゲーター</span>
        </h2>
      </div>

      {/* Character Selector Bubbles */}
      <div className="focus-selector-scroll">
        <div className="focus-selector">
          {characters.map(char => (
            <button 
              key={char.id}
              className={`focus-bubble-btn ${focusId === char.id ? 'active' : ''}`}
              onClick={() => setFocusId(char.id)}
              style={{ 
                '--char-color': char.color,
                borderColor: focusId === char.id ? char.color : 'rgba(255,255,255,0.08)',
                boxShadow: focusId === char.id ? `0 0 12px ${char.color}40` : 'none'
              }}
            >
              <div className="bubble-avatar">{char.icon}</div>
              <span className="bubble-name">{char.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Character Hero Banner */}
      <div 
        className="focus-hero-card"
        style={{
          borderLeft: `5px solid ${focusChar.color}`,
          background: `linear-gradient(135deg, ${focusChar.secondaryColor || '#111'}, #121217)`
        }}
      >
        <div className="hero-avatar">{focusChar.icon}</div>
        <div className="hero-info">
          <span className="hero-badge" style={{ color: focusChar.color, borderColor: `${focusChar.color}30` }}>
            中心キャラクター
          </span>
          <h3 className="hero-name" style={{ color: focusChar.color }}>{focusChar.name}</h3>
          <p className="hero-role">{focusChar.role}</p>
        </div>
      </div>

      {/* Relationships Timeline/List */}
      <div className="relationships-list">
        {otherChars.map(targetChar => {
          // Focus -> Target relationship
          const relFromFocus = focusChar.relationships?.[targetChar.id];
          // Target -> Focus relationship
          const relToFocus = targetChar.relationships?.[focusChar.id];

          return (
            <div 
              key={targetChar.id} 
              className="rel-card fade-in"
              style={{
                '--grad-start': `${focusChar.color}15`,
                '--grad-end': `${targetChar.color}15`,
                borderLeftColor: focusChar.color,
                borderRightColor: targetChar.color
              }}
            >
              {/* Target Character Header Mini */}
              <div className="rel-target-header">
                <div className="rel-mini-avatar" style={{ border: `1px solid ${targetChar.color}` }}>
                  {targetChar.icon}
                </div>
                <div>
                  <h4 className="target-name" style={{ color: targetChar.color }}>{targetChar.name}</h4>
                  <span className="target-role">{targetChar.role}</span>
                </div>
                <ArrowLeftRight size={14} className="rel-arrow-icon" style={{ color: 'var(--text-muted)' }} />
              </div>

              <div className="rel-grid">
                {/* Flow A: Focus Character to Target Character */}
                <div className="rel-flow-box">
                  <div className="flow-header">
                    <span className="flow-speaker" style={{ color: focusChar.color }}>{focusChar.name}</span>
                    <span className="flow-arrow">➔</span>
                    <span className="flow-listener">{targetChar.name}</span>
                  </div>
                  {relFromFocus ? (
                    <div className="flow-content">
                      <div className="flow-field">
                        <span className="field-label">呼称</span>
                        <strong className="field-value call-value" style={{ color: focusChar.color }}>
                          「{relFromFocus.call}」
                        </strong>
                      </div>
                      <div className="flow-field">
                        <span className="field-label">関係</span>
                        <p className="field-value relation-value">{relFromFocus.relation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flow-empty">
                      <HelpCircle size={14} />
                      <span>設定されていません</span>
                    </div>
                  )}
                </div>

                {/* Flow B: Target Character to Focus Character */}
                <div className="rel-flow-box">
                  <div className="flow-header">
                    <span className="flow-speaker" style={{ color: targetChar.color }}>{targetChar.name}</span>
                    <span className="flow-arrow">➔</span>
                    <span className="flow-listener">{focusChar.name}</span>
                  </div>
                  {relToFocus ? (
                    <div className="flow-content">
                      <div className="flow-field">
                        <span className="field-label">呼称</span>
                        <strong className="field-value call-value" style={{ color: targetChar.color }}>
                          「{relToFocus.call}」
                        </strong>
                      </div>
                      <div className="flow-field">
                        <span className="field-label">関係</span>
                        <p className="field-value relation-value">{relToFocus.relation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flow-empty">
                      <HelpCircle size={14} />
                      <span>設定されていません</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .correlation-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .focus-selector-scroll {
          overflow-x: auto;
          scrollbar-width: none;
          margin: 0 -16px 16px -16px;
          padding: 4px 16px;
        }

        .focus-selector-scroll::-webkit-scrollbar {
          display: none;
        }

        .focus-selector {
          display: flex;
          gap: 10px;
          width: max-content;
        }

        .focus-bubble-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-bounce);
          flex-shrink: 0;
        }

        .focus-bubble-btn:hover {
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .focus-bubble-btn.active {
          color: var(--text-primary);
          background: rgba(255,255,255,0.02);
        }

        .bubble-avatar {
          font-size: 1.1rem;
        }

        .bubble-name {
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Focus character card */
        .focus-hero-card {
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
          position: relative;
        }

        .hero-avatar {
          font-size: 2.2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-info {
          display: flex;
          flex-direction: column;
        }

        .hero-badge {
          font-size: 0.55rem;
          font-weight: bold;
          border: 1px solid;
          border-radius: 4px;
          padding: 1px 6px;
          background: rgba(0,0,0,0.3);
          align-self: flex-start;
          margin-bottom: 4px;
        }

        .hero-name {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .hero-role {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        /* Relationships cards list */
        .relationships-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rel-card {
          background: linear-gradient(135deg, var(--grad-start), var(--grad-end));
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          border-left: 3px solid;
          border-right: 3px solid;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }

        .rel-target-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 8px;
          position: relative;
        }

        .rel-mini-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .target-name {
          font-size: 0.8rem;
          font-weight: 800;
        }

        .target-role {
          font-size: 0.6rem;
          color: var(--text-muted);
          display: block;
          margin-top: -2px;
        }

        .rel-arrow-icon {
          position: absolute;
          right: 4px;
          top: 6px;
        }

        /* Grid flows */
        .rel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        @media (max-width: 400px) {
          .rel-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        .rel-flow-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255,255,255,0.02);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .flow-header {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.62rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 4px;
        }

        .flow-speaker {
          font-weight: 700;
        }

        .flow-arrow {
          color: var(--text-muted);
          font-size: 0.55rem;
        }

        .flow-listener {
          color: var(--text-secondary);
        }

        .flow-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .flow-field {
          display: flex;
          flex-direction: column;
        }

        .field-label {
          font-size: 0.52rem;
          color: var(--text-muted);
          font-weight: bold;
        }

        .field-value {
          font-size: 0.68rem;
          line-height: 1.3;
        }

        .call-value {
          font-family: var(--font-cyber);
          font-size: 0.72rem;
        }

        .relation-value {
          color: var(--text-secondary);
        }

        .flow-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.6rem;
          padding: 12px 0;
        }
      `}</style>
    </div>
  );
}
