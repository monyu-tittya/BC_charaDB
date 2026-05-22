import React, { useState, useMemo } from 'react';
import { Sparkles, Heart, ChevronRight } from 'lucide-react';

export default function CorrelationMap({ characters }) {
  // Select active character for the bottom profile sheet
  const [focusId, setFocusId] = useState(characters[0]?.id || '');

  const focusChar = useMemo(() => {
    return characters.find(c => c.id === focusId) || characters[0];
  }, [characters, focusId]);

  // Layout calculation for N-gon circle arrangement inside SVG viewBox="0 0 320 280"
  const nodes = useMemo(() => {
    const N = characters.length;
    const cx = 160; // Center X
    const cy = 130; // Center Y
    const R = 82;   // Radius

    return characters.map((char, idx) => {
      // Start from 12 o'clock (-PI / 2) and distribute evenly
      const angle = (2 * Math.PI * idx) / N - Math.PI / 2;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      return { ...char, x, y };
    });
  }, [characters]);

  // Calculate connections between characters
  const connections = useMemo(() => {
    const list = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    nodes.forEach(source => {
      if (!source.relationships) return;
      
      Object.entries(source.relationships).forEach(([targetId, rel]) => {
        const target = nodeMap.get(targetId);
        if (!target) return; // Skip if target character no longer exists
        
        // Check if there is an opposite relationship to apply appropriate curves
        const hasOpposite = target.relationships && target.relationships[source.id];
        
        list.push({
          sourceId: source.id,
          targetId: targetId,
          source: source,
          target: target,
          call: rel.call,
          relation: rel.relation,
          hasOpposite: !!hasOpposite
        });
      });
    });

    return list;
  }, [nodes]);

  // Secondary bezier curves geometric computations
  const getCurveData = (x1, y1, x2, y2, hasOpposite) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) return { path: '', labelX: 0, labelY: 0 };
    
    // Direction vector
    const ux = dx / len;
    const uy = dy / len;
    
    // Nodes have a 44px avatar node + borders. Offset starting/ending points to sit on node edges
    const r = 26; 
    const sx = x1 + r * ux;
    const sy = y1 + r * uy;
    const ex = x2 - r * ux;
    const ey = y2 - r * uy;
    
    // Perpendicular vector for the curve offset (always shift to the right to split bi-directional flows)
    const vx = -uy;
    const vy = ux;
    
    // Shift distance: bi-directional lines curve outward, single lines have a subtle curve
    const offset = hasOpposite ? 18 : 6;
    
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    
    const ctrlX = mx + offset * vx;
    const ctrlY = my + offset * vy;
    
    // Quadratic Bezier Curve path
    const path = `M ${sx} ${sy} Q ${ctrlX} ${ctrlY} ${ex} ${ey}`;
    
    // Position of the label chip at t = 0.5 (middle of bezier curve)
    const labelX = 0.25 * sx + 0.5 * ctrlX + 0.25 * ex;
    const labelY = 0.25 * sy + 0.5 * ctrlY + 0.25 * ey;
    
    return { path, labelX, labelY };
  };

  return (
    <div className="correlation-container fade-in">
      {/* Visual Canvas Panel */}
      <div className="diagram-canvas-panel">
        <h3 className="panel-title">
          <span className="glow-text" style={{ color: 'var(--accent-neon-pink)' }}>RELATION FLOW</span>
          <span className="sub-title">タップしてキャラクターを選択できます</span>
        </h3>

        <div className="svg-wrapper">
          <svg viewBox="0 0 320 270" className="relation-svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
            <defs>
              {/* Glow filter for paths */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dynamic color markers defined dynamically in line strokes */}
              <marker 
                id="arrow-black" 
                viewBox="0 0 10 10" 
                refX="6" 
                refY="5" 
                markerWidth="5" 
                markerHeight="5" 
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e2f900" />
              </marker>
              <marker 
                id="arrow-camera" 
                viewBox="0 0 10 10" 
                refX="6" 
                refY="5" 
                markerWidth="5" 
                markerHeight="5" 
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff0055" />
              </marker>
              <marker 
                id="arrow-satoshi" 
                viewBox="0 0 10 10" 
                refX="6" 
                refY="5" 
                markerWidth="5" 
                markerHeight="5" 
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#00d2ff" />
              </marker>
            </defs>

            {/* Background cyber grid dots */}
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.75" fill="rgba(255,255,255,0.06)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />

            {/* Relationship Lines (Arrows) */}
            {connections.map((conn, idx) => {
              const { path, labelX, labelY } = getCurveData(
                conn.source.x,
                conn.source.y,
                conn.target.x,
                conn.target.y,
                conn.hasOpposite
              );

              const strokeColor = conn.source.color;
              const markerId = `arrow-${conn.sourceId}`;

              return (
                <g key={idx} className="connection-group">
                  {/* Glowing background path line */}
                  <path 
                    d={path} 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="3" 
                    opacity="0.1" 
                    filter="url(#glow)"
                  />
                  {/* Primary path line */}
                  <path 
                    d={path} 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="1.2" 
                    strokeDasharray="4 2"
                    opacity="0.7"
                    markerEnd={`url(#${markerId})`}
                  />

                  {/* Relationship Label Bubble Floating on t=0.5 */}
                  {path && (
                    <foreignObject x={labelX - 44} y={labelY - 14} width="88" height="28">
                      <div 
                        className="relation-bubble" 
                        style={{ 
                          borderColor: strokeColor,
                          boxShadow: `0 0 8px ${strokeColor}20` 
                        }}
                      >
                        <div className="call-text" style={{ color: strokeColor }}>
                          「{conn.call}」
                        </div>
                        <div className="rel-text">
                          {conn.relation}
                        </div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* Character Nodes (Avatars & Names) */}
            {nodes.map(char => {
              const isActive = char.id === focusId;
              return (
                <foreignObject key={char.id} x={char.x - 26} y={char.y - 36} width="52" height="72" style={{ overflow: 'visible' }}>
                  <div 
                    className={`node-wrapper ${isActive ? 'active' : ''}`}
                    onClick={() => setFocusId(char.id)}
                    style={{ '--node-color': char.color }}
                  >
                    {/* Ring outer glow */}
                    <div 
                      className="node-avatar" 
                      style={{ 
                        borderColor: char.color, 
                        boxShadow: isActive ? `0 0 16px ${char.color}` : `0 0 6px ${char.color}40`,
                        background: char.secondaryColor || 'var(--bg-tertiary)'
                      }}
                    >
                      <span className="avatar-icon">{char.icon}</span>
                    </div>
                    <div className="node-name" style={{ color: char.color }}>
                      {char.name}
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Focus Profile Details Panel */}
      {focusChar && (
        <div 
          className="focus-details-card fade-in" 
          style={{ 
            borderColor: focusChar.color,
            boxShadow: `0 0 20px ${focusChar.color}15`,
            background: `linear-gradient(135deg, ${focusChar.secondaryColor || '#15151b'}, #0f0f12)`
          }}
        >
          <div className="card-top">
            <div className="card-avatar-pill" style={{ borderColor: focusChar.color }}>
              <span className="pill-icon">{focusChar.icon}</span>
            </div>
            <div className="card-title-group">
              <span className="card-badge" style={{ color: focusChar.color, borderColor: `${focusChar.color}35`, background: `${focusChar.color}08` }}>
                {focusChar.role}
              </span>
              <h4 className="card-name" style={{ color: focusChar.color }}>
                {focusChar.name}
              </h4>
            </div>
            <div className="card-meta">
              <span className="meta-item">📏 {focusChar.height}cm</span>
              <span className="meta-item">🎂 {focusChar.birthday}</span>
            </div>
          </div>

          <div className="card-divider" style={{ background: `linear-gradient(to right, ${focusChar.color}30, transparent)` }} />

          {/* Voice Mannerisms profile row */}
          <div className="mannerisms-grid">
            <div className="manner-item">
              <span className="manner-label">一人称</span>
              <strong className="manner-val">{focusChar.firstPerson || '？'}</strong>
            </div>
            <div className="manner-item">
              <span className="manner-label">笑い方</span>
              <strong className="manner-val">{focusChar.laugh || '？'}</strong>
            </div>
            <div className="manner-item">
              <span className="manner-label">口癖</span>
              <strong className="manner-val" style={{ color: focusChar.color }}>
                {focusChar.catchphrase || '？'}
              </strong>
            </div>
            <div className="manner-item">
              <span className="manner-label">語尾</span>
              <strong className="manner-val">{focusChar.ending || '？'}</strong>
            </div>
          </div>

          <p className="focus-desc-text">
            {focusChar.description}
          </p>

          <div className="tags-row">
            {(focusChar.traits || []).map((tag, idx) => (
              <span 
                key={idx} 
                className="tag-chip" 
                style={{ 
                  color: focusChar.color, 
                  borderColor: `${focusChar.color}25`,
                  background: `${focusChar.color}06`
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .correlation-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 14px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .diagram-canvas-panel {
          background: var(--bg-primary);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 12px;
          position: relative;
        }

        .panel-title {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }

        .panel-title .glow-text {
          font-family: var(--font-cyber);
          font-size: 1.05rem;
          letter-spacing: 1px;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
        }

        .panel-title .sub-title {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .svg-wrapper {
          position: relative;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.01);
          overflow: hidden;
        }

        /* Vector flows */
        .connection-group {
          pointer-events: none;
        }

        /* Label floating bubble */
        .relation-bubble {
          background: rgba(8, 8, 10, 0.92);
          border: 1px solid;
          border-radius: 5px;
          padding: 3px 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          box-sizing: border-box;
          backdrop-filter: blur(4px);
        }

        .relation-bubble .call-text {
          font-size: 0.52rem;
          font-weight: 900;
          font-family: var(--font-cyber);
          line-height: 1;
          margin-bottom: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .relation-bubble .rel-text {
          font-size: 0.44rem;
          color: var(--text-secondary);
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* SVG Node wrapper */
        .node-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          pointer-events: auto; /* enable click over svg layers */
        }

        .node-wrapper:hover {
          transform: scale(1.08);
        }

        .node-wrapper.active {
          transform: scale(1.08);
        }

        .node-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .node-wrapper.active .node-avatar {
          animation: borderGlowPulse 1.5s infinite ease-in-out;
        }

        .avatar-icon {
          font-size: 1.15rem;
          line-height: 1;
        }

        .node-name {
          font-size: 0.65rem;
          font-weight: 800;
          margin-top: 3px;
          text-align: center;
          font-family: var(--font-main);
          text-shadow: 0 1px 3px rgba(0,0,0,0.9);
          white-space: nowrap;
        }

        @keyframes borderGlowPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Details Card Bottom */
        .focus-details-card {
          border: 1px solid;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          position: relative;
          overflow: hidden;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-avatar-pill {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }

        .pill-icon {
          font-size: 1.1rem;
        }

        .card-title-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-badge {
          font-size: 0.52rem;
          font-weight: 800;
          border: 1px solid;
          border-radius: 3px;
          padding: 0 4px;
          align-self: flex-start;
          white-space: nowrap;
        }

        .card-name {
          font-size: 0.95rem;
          font-weight: 900;
          line-height: 1;
          font-family: var(--font-main);
          letter-spacing: 0.25px;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
          font-size: 0.6rem;
          color: var(--text-secondary);
          font-family: var(--font-cyber);
          font-weight: bold;
        }

        .card-divider {
          height: 1px;
          width: 100%;
        }

        /* Personality Grid */
        .mannerisms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .manner-item {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 6px;
          padding: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: center;
        }

        .manner-label {
          font-size: 0.48rem;
          color: var(--text-muted);
          font-weight: bold;
        }

        .manner-val {
          font-size: 0.62rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .focus-desc-text {
          font-size: 0.68rem;
          color: var(--text-secondary);
          line-height: 1.35;
          margin: 0;
        }

        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .tag-chip {
          font-size: 0.55rem;
          font-weight: 700;
          border: 1px solid;
          border-radius: 4px;
          padding: 1px 5px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
