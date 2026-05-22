import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ZoomIn, ZoomOut } from 'lucide-react';

export default function HeightChart({ characters }) {
  const [sortBy, setSortBy] = useState('height-desc'); // 'height-desc', 'height-asc', 'name'
  const [scale, setScale] = useState(1); // Zoom scale for heights to fit better

  // Sort characters
  const sortedCharacters = useMemo(() => {
    const chars = [...characters];
    if (sortBy === 'height-desc') {
      return chars.sort((a, b) => b.height - a.height);
    } else if (sortBy === 'height-asc') {
      return chars.sort((a, b) => a.height - b.height);
    } else {
      return chars.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));
    }
  }, [characters, sortBy]);

  // Height ranges
  const minHeightVal = 80;
  const maxHeightVal = 180;
  const step = 10;
  
  // Generate background grid lines (from 180 down to 80)
  const gridLines = [];
  for (let h = maxHeightVal; h >= minHeightVal; h -= step) {
    gridLines.push(h);
  }

  return (
    <div className="height-chart-container fade-in">
      <div className="chart-header">
        <h2 className="chart-title">
          <span className="glow-text" style={{ color: 'var(--accent-neon-yellow)' }}>HEIGHT LINEUP</span>
          <span className="sub-title">身長比較ラインナップ</span>
        </h2>
        <div className="chart-controls">
          <button 
            className="control-btn"
            onClick={() => setSortBy(prev => prev === 'height-desc' ? 'height-asc' : 'height-desc')}
            title="並び替え"
          >
            <ArrowUpDown size={16} />
            <span>{sortBy === 'height-desc' ? '高い順' : sortBy === 'height-asc' ? '低い順' : '名前順'}</span>
          </button>
          <div className="zoom-controls">
            <button 
              className="zoom-btn" 
              onClick={() => setScale(s => Math.max(0.7, s - 0.15))}
              disabled={scale <= 0.7}
            >
              <ZoomOut size={14} />
            </button>
            <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
            <button 
              className="zoom-btn" 
              onClick={() => setScale(s => Math.min(1.3, s + 0.15))}
              disabled={scale >= 1.3}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="chart-viewport-wrapper">
        {/* Sticky Y-Axis */}
        <div className="chart-y-axis">
          {gridLines.map(height => (
            <div 
              key={height} 
              className="y-axis-label"
              style={{
                bottom: `${((height - minHeightVal) / (maxHeightVal - minHeightVal)) * 100}%`
              }}
            >
              {height}cm
            </div>
          ))}
        </div>

        {/* Scrollable Canvas */}
        <div className="chart-canvas-scroll">
          <div className="chart-canvas" style={{ minWidth: `${Math.max(100, characters.length * 80 + 40)}px` }}>
            
            {/* Horizontal Grid Lines */}
            <div className="grid-lines-bg">
              {gridLines.map(height => (
                <div 
                  key={height} 
                  className="grid-line"
                  style={{
                    bottom: `${((height - minHeightVal) / (maxHeightVal - minHeightVal)) * 100}%`
                  }}
                />
              ))}
            </div>

            {/* Character Columns */}
            <div className="columns-container">
              {sortedCharacters.map((char, index) => {
                // Calculate percentage height
                const pct = ((char.height - minHeightVal) / (maxHeightVal - minHeightVal)) * 100;
                
                return (
                  <div 
                    key={char.id} 
                    className="character-column"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* The Visual Bar */}
                    <div className="bar-wrapper" style={{ height: `${pct}%` }}>
                      {/* Height Indicator Label */}
                      <div className="column-height-bubble" style={{ borderColor: char.color }}>
                        {char.height}<span className="unit">cm</span>
                      </div>

                      {/* Glowing Bar Column */}
                      <div 
                        className="glowing-bar" 
                        style={{ 
                          background: `linear-gradient(to top, ${char.secondaryColor || '#111'}, ${char.color})`,
                          boxShadow: `0 0 15px ${char.color}40`,
                          transform: `scaleY(${scale})`,
                          transformOrigin: 'bottom'
                        }}
                      >
                        {/* Core Neon Stripe */}
                        <div className="bar-core" style={{ backgroundColor: char.color }} />
                        
                        {/* Floating Icon inside bar */}
                        <div className="bar-icon-float">{char.icon}</div>
                      </div>
                    </div>

                    {/* Bottom Label Info */}
                    <div className="column-label">
                      <div className="char-avatar" style={{ boxShadow: `0 0 8px ${char.color}50`, border: `1px solid ${char.color}` }}>
                        {char.icon}
                      </div>
                      <div className="char-name-tag" style={{ color: char.color }}>
                        {char.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      <div className="chart-tip">
        💡 キャラクターが増えたら横スクロールで一覧できます！
      </div>

      <style>{`
        .height-chart-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .chart-title {
          display: flex;
          flex-direction: column;
        }

        .chart-title .glow-text {
          font-family: var(--font-cyber);
          font-size: 1.2rem;
          letter-spacing: 1px;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(226, 249, 0, 0.4);
        }

        .chart-title .sub-title {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .chart-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .control-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .control-btn:hover {
          border-color: var(--accent-neon-yellow);
          box-shadow: 0 0 8px rgba(226, 249, 0, 0.2);
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2px 4px;
        }

        .zoom-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .zoom-btn:hover:not(:disabled) {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }

        .zoom-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .zoom-indicator {
          font-size: 0.7rem;
          font-family: var(--font-cyber);
          padding: 0 4px;
          min-width: 32px;
          text-align: center;
          color: var(--text-secondary);
        }

        /* Viewport Styling */
        .chart-viewport-wrapper {
          display: flex;
          height: 340px; /* Perfect height for vertical mobile screen */
          position: relative;
          background-color: var(--bg-primary);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
          overflow: hidden;
          margin-bottom: 12px;
        }

        /* Y-Axis scale label container */
        .chart-y-axis {
          width: 48px;
          height: calc(100% - 90px); /* Exclude bottom label area */
          position: relative;
          border-right: 1px solid rgba(255,255,255,0.05);
          z-index: 10;
          background-color: rgba(10, 10, 12, 0.95);
          backdrop-filter: var(--glass-blur);
        }

        .y-axis-label {
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.65rem;
          font-family: var(--font-cyber);
          color: var(--text-muted);
          transform: translateY(50%); /* Center on the gridline */
        }

        /* Scrollable canvas */
        .chart-canvas-scroll {
          flex: 1;
          overflow-x: auto;
          overflow-y: hidden;
          position: relative;
          /* Smooth scrollbar styling */
          scrollbar-width: thin;
        }

        .chart-canvas {
          height: 100%;
          position: relative;
        }

        /* Background grid lines */
        .grid-lines-bg {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: calc(100% - 90px);
          pointer-events: none;
        }

        .grid-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
        }

        /* Character Columns container */
        .columns-container {
          display: flex;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 100%;
          align-items: flex-end;
          padding: 0 15px;
        }

        .character-column {
          width: 80px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          animation: slideUpIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }

        @keyframes slideUpIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Bar structures */
        .bar-wrapper {
          width: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 80px; /* Offset for avatar labels */
          bottom: 10px;
        }

        .column-height-bubble {
          font-family: var(--font-cyber);
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 5px;
          background: var(--bg-primary);
          border: 1px solid;
          border-radius: 4px;
          margin-bottom: 6px;
          white-space: nowrap;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          animation: pulse 2s infinite ease-in-out;
        }

        .column-height-bubble .unit {
          font-size: 0.55rem;
          color: var(--text-secondary);
          margin-left: 1px;
        }

        .glowing-bar {
          width: 100%;
          height: 100%;
          border-radius: 6px 6px 0 0;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15);
        }

        .bar-core {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 3px;
          transform: translateX(-50%);
          opacity: 0.6;
          filter: blur(1px);
        }

        .bar-icon-float {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.9rem;
          pointer-events: none;
          opacity: 0.8;
        }

        /* Labels */
        .column-label {
          position: absolute;
          bottom: 8px;
          width: 76px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70px;
          text-align: center;
        }

        .char-avatar {
          width: 32px;
          height: 32px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          margin-bottom: 6px;
          transition: var(--transition-bounce);
        }

        .character-column:hover .char-avatar {
          transform: scale(1.2) rotate(10deg);
        }

        .char-name-tag {
          font-size: 0.7rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          font-family: var(--font-main);
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        }

        .chart-tip {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}
