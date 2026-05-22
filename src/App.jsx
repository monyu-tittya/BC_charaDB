import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, List, BarChart3, X, Sparkles, HelpCircle } from 'lucide-react';
import initialCharacters from './data/characters.json';
import HeightChart from './components/HeightChart';
import AdminHelper from './components/AdminHelper';

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'chart'
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Bottom Sheet selected character
  const [activeDetailChar, setActiveDetailChar] = useState(null);
  
  // Admin Tool toggle
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    // Load initial characters from local JSON
    setCharacters(initialCharacters);
  }, []);

  // Filter list
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      // Search text (Name, Kana, Role, Description)
      const matchesSearch = 
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.kana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Gender filter
      const matchesGender = 
        selectedGender === 'all' || 
        (selectedGender === 'male' && char.gender.includes('男')) ||
        (selectedGender === 'female' && char.gender.includes('女')) ||
        (selectedGender === 'demon' && char.gender.includes('悪魔'));

      // Role filter
      const matchesRole = 
        selectedRole === 'all' ||
        (selectedRole === 'demon' && char.role.includes('悪魔')) ||
        (selectedRole === 'angel' && char.role.includes('天使')) ||
        (selectedRole === 'human' && char.role.includes('小学生'));

      return matchesSearch && matchesGender && matchesRole;
    });
  }, [characters, searchQuery, selectedGender, selectedRole]);

  // Handle adding temporary character
  const handleAddTemporarily = (newChar) => {
    setCharacters(prev => {
      // Prevent duplicates in state preview
      if (prev.some(c => c.id === newChar.id)) {
        return prev.map(c => c.id === newChar.id ? newChar : c);
      }
      return [...prev, newChar];
    });
  };

  return (
    <div className="app-shell">
      {/* Dynamic Background Mesh */}
      <div className="bg-mesh" />

      {/* Header */}
      <header className="app-header">
        <div className="logo-group">
          <span className="logo-icon">😈</span>
          <div>
            <h1 className="logo-title glitch-text">BLACK CHANNEL</h1>
            <p className="logo-subtitle">CHARACTER DATABASE</p>
          </div>
        </div>
        
        <button 
          className="admin-toggle-btn"
          onClick={() => setIsAdminOpen(true)}
          title="キャラクターを追加"
        >
          <Plus size={16} />
          <span>データ追加</span>
        </button>
      </header>

      {/* Main Tabs Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <List size={16} />
          <span>キャラ一覧 ({filteredCharacters.length})</span>
          {activeTab === 'list' && <div className="tab-indicator" />}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          <BarChart3 size={16} />
          <span>身長見比べグラフ</span>
          {activeTab === 'chart' && <div className="tab-indicator" />}
        </button>
      </div>

      {/* Content Area */}
      <main className="app-main-content">
        
        {activeTab === 'list' ? (
          <>
            {/* Search and Filters */}
            <div className="filters-container fade-in">
              <div className="search-bar-wrapper">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="キャラ名、よみ、特徴などで検索..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Advanced Filter Pills */}
              <div className="filter-pills-row">
                <span className="filter-label"><SlidersHorizontal size={12} /> 属性:</span>
                <div className="pill-group">
                  <button 
                    className={`pill-btn ${selectedGender === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('all')}
                  >
                    すべて
                  </button>
                  <button 
                    className={`pill-btn ${selectedGender === 'demon' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('demon')}
                  >
                    悪魔
                  </button>
                  <button 
                    className={`pill-btn ${selectedGender === 'male' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('male')}
                  >
                    男性
                  </button>
                  <button 
                    className={`pill-btn ${selectedGender === 'female' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('female')}
                  >
                    女性
                  </button>
                </div>
              </div>
            </div>

            {/* Character Cards List */}
            {filteredCharacters.length > 0 ? (
              <div className="characters-grid">
                {filteredCharacters.map((char, index) => (
                  <div 
                    key={char.id}
                    className="character-card fade-in"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      '--char-color': char.color,
                      '--char-color-trans': `${char.color}15`,
                    }}
                    onClick={() => setActiveDetailChar(char)}
                  >
                    {/* Glowing highlight corner */}
                    <div className="card-accent-bar" style={{ backgroundColor: char.color }} />
                    
                    <div className="card-avatar" style={{ border: `1.5px solid ${char.color}`, boxShadow: `0 0 10px ${char.color}30` }}>
                      {char.icon}
                    </div>

                    <div className="card-info">
                      <div className="card-meta-row">
                        <span className="card-role" style={{ color: char.color, borderColor: `${char.color}30` }}>
                          {char.role}
                        </span>
                        <span className="card-height-badge">
                          {char.height} cm
                        </span>
                      </div>
                      <h3 className="card-name">{char.name}</h3>
                      <p className="card-kana">{char.kana}</p>
                      <p className="card-snippet">{char.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state fade-in">
                <HelpCircle size={40} className="empty-icon" />
                <p>該当するキャラクターが見つかりません</p>
                <button className="reset-filter-btn" onClick={() => { setSearchQuery(''); setSelectedGender('all'); setSelectedRole('all'); }}>
                  検索条件をリセット
                </button>
              </div>
            )}
          </>
        ) : (
          /* Height Visualizer Tab */
          <div className="chart-tab-content">
            <HeightChart characters={characters} />
          </div>
        )}
      </main>

      {/* Sliding Bottom Sheet for Character Details */}
      {activeDetailChar && (
        <div className="bottom-sheet-overlay" onClick={() => setActiveDetailChar(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            {/* Grab handle */}
            <div className="sheet-handle" onClick={() => setActiveDetailChar(null)} />
            
            {/* Header info */}
            <div className="sheet-header">
              <div className="sheet-avatar-wrapper">
                <div 
                  className="sheet-avatar"
                  style={{ 
                    borderColor: activeDetailChar.color, 
                    boxShadow: `0 0 25px ${activeDetailChar.color}50` 
                  }}
                >
                  {activeDetailChar.icon}
                </div>
              </div>

              <div className="sheet-title-info">
                <span className="sheet-role" style={{ color: activeDetailChar.color, backgroundColor: `${activeDetailChar.color}15` }}>
                  {activeDetailChar.role}
                </span>
                <h2 className="sheet-name" style={{ color: activeDetailChar.color }}>{activeDetailChar.name}</h2>
                <span className="sheet-kana">{activeDetailChar.kana}</span>
              </div>

              <button className="sheet-close" onClick={() => setActiveDetailChar(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Profile Statistics Grid */}
            <div className="sheet-body">
              <div className="stats-grid">
                <div className="stat-card" style={{ borderLeftColor: activeDetailChar.color }}>
                  <span className="stat-label">身長 (HEIGHT)</span>
                  <div className="stat-value-group">
                    <strong className="stat-value" style={{ color: activeDetailChar.color }}>
                      {activeDetailChar.height}
                    </strong>
                    <span className="stat-unit">cm</span>
                  </div>
                  {/* Dynamic height comparison against Black (142cm) */}
                  {activeDetailChar.id !== 'black' && (
                    <span className="stat-compare">
                      ブラック ({142}cm) より 
                      <strong> {activeDetailChar.height - 142 > 0 ? `+${activeDetailChar.height - 142}` : activeDetailChar.height - 142} cm</strong>
                    </span>
                  )}
                </div>

                <div className="stat-card">
                  <span className="stat-label">誕生日 (BIRTHDAY)</span>
                  <strong className="stat-value highlight-value">{activeDetailChar.birthday || '不明'}</strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">年齢 (AGE)</span>
                  <strong className="stat-value">{activeDetailChar.age || '不明'}</strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">性別 (GENDER)</span>
                  <strong className="stat-value">{activeDetailChar.gender || '不明'}</strong>
                </div>
              </div>

              {/* Long description */}
              <div className="description-section">
                <h4 className="section-title">😈 キャラクター解説</h4>
                <p className="description-text">{activeDetailChar.description}</p>
              </div>

              {/* Special Neon Footer Button to Close */}
              <button 
                className="sheet-footer-close-btn"
                style={{ 
                  backgroundColor: activeDetailChar.color,
                  boxShadow: `0 0 15px ${activeDetailChar.color}40`
                }}
                onClick={() => setActiveDetailChar(null)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Exporter Modal overlay */}
      {isAdminOpen && (
        <AdminHelper 
          currentCharacters={characters} 
          onAddTemporarily={handleAddTemporarily} 
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Footer Branding */}
      <footer className="app-footer">
        <p>© 2026 Black Channel Fans DB • Mobile Portal</p>
      </footer>

      <style>{`
        /* App Layout Styles */
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .bg-mesh {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(226, 249, 0, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(255, 0, 85, 0.03) 0%, transparent 40%);
          pointer-events: none;
        }

        /* Header block */
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 14px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(10, 10, 12, 0.85);
          backdrop-filter: var(--glass-blur);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 1.6rem;
        }

        .logo-title {
          font-family: var(--font-cyber);
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.5px;
          background: linear-gradient(to right, var(--text-primary), var(--accent-neon-yellow));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-subtitle {
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: var(--text-secondary);
          margin-top: -2px;
        }

        .admin-toggle-btn {
          background: rgba(226, 249, 0, 0.1);
          border: 1px solid rgba(226, 249, 0, 0.3);
          color: var(--accent-neon-yellow);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .admin-toggle-btn:hover {
          background: var(--accent-neon-yellow);
          color: #000;
          box-shadow: var(--shadow-neon);
        }

        /* Tabs Navigation */
        .tab-navigation {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 14px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          transition: var(--transition-smooth);
        }

        .tab-btn.active {
          color: var(--text-primary);
        }

        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 15%;
          right: 15%;
          height: 3px;
          background-color: var(--accent-neon-yellow);
          border-radius: 3px 3px 0 0;
          box-shadow: var(--shadow-neon);
        }

        /* Content block */
        .app-main-content {
          flex: 1;
          padding: 14px;
          display: flex;
          flex-direction: column;
        }

        /* Filters and Search */
        .filters-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 12px 8px 32px;
          font-size: 0.8rem;
          border-radius: 8px;
          outline: none;
          transition: var(--transition-smooth);
        }

        .search-input:focus {
          border-color: var(--accent-neon-yellow);
        }

        .search-clear {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }

        .filter-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .pill-group {
          display: flex;
          gap: 6px;
        }

        .pill-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: var(--transition-smooth);
        }

        .pill-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }

        .pill-btn.active {
          color: #000;
          background: var(--accent-neon-yellow);
          border-color: var(--accent-neon-yellow);
          box-shadow: var(--shadow-neon);
        }

        /* Characters List Grid */
        .characters-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .character-card {
          background: var(--bg-card);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          gap: 14px;
          align-items: center;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition: var(--transition-bounce);
        }

        .character-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--char-color-trans);
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .character-card:hover {
          transform: translateY(-2px);
          border-color: var(--char-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 10px var(--char-color-trans);
        }

        .character-card:hover::before {
          opacity: 1;
        }

        .card-accent-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
        }

        .card-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          flex-shrink: 0;
          z-index: 1;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        .card-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .card-role {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1.5px solid;
          background: rgba(0,0,0,0.3);
        }

        .card-height-badge {
          font-family: var(--font-cyber);
          font-size: 0.7rem;
          font-weight: bold;
          color: var(--text-secondary);
        }

        .card-name {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .card-kana {
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: -2px;
          margin-bottom: 4px;
        }

        .card-snippet {
          font-size: 0.68rem;
          color: var(--text-secondary);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Empty state styling */
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
          gap: 12px;
        }

        .empty-icon {
          color: var(--text-muted);
          animation: pulse 2s infinite ease-in-out;
        }

        .reset-filter-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--accent-neon-yellow);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .reset-filter-btn:hover {
          border-color: var(--accent-neon-yellow);
          background: rgba(226, 249, 0, 0.05);
        }

        /* Bottom Sheet Styling */
        .bottom-sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 80;
          display: flex;
          justify-content: center;
          align-items: flex-end; /* Align bottom */
        }

        .bottom-sheet {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          width: 100%;
          max-width: 480px; /* Constrain to shell width */
          border-radius: 20px 20px 0 0;
          padding: 12px 18px 24px 18px;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          position: relative;
        }

        .sheet-handle {
          width: 40px;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          margin: 0 auto 16px auto;
          cursor: pointer;
        }

        .sheet-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          position: relative;
        }

        .sheet-avatar-wrapper {
          flex-shrink: 0;
        }

        .sheet-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .sheet-title-info {
          flex: 1;
        }

        .sheet-role {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .sheet-name {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .sheet-kana {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .sheet-close {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .sheet-close:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .stat-card[style*="borderLeftColor"] {
          border-left: 3px solid;
        }

        .stat-label {
          font-size: 0.55rem;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .stat-value {
          font-size: 1.15rem;
          font-weight: 800;
          font-family: var(--font-cyber);
        }

        .highlight-value {
          color: var(--accent-neon-pink);
          text-shadow: 0 0 8px rgba(255, 0, 85, 0.2);
        }

        .stat-unit {
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: bold;
        }

        .stat-compare {
          font-size: 0.55rem;
          color: var(--text-secondary);
          margin-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 4px;
        }

        .stat-compare strong {
          color: var(--accent-neon-yellow);
        }

        /* Long description details */
        .description-section {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .description-section .section-title {
          font-size: 0.75rem;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .description-text {
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.5;
          text-align: justify;
        }

        .sheet-footer-close-btn {
          width: 100%;
          border: none;
          color: #000;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .sheet-footer-close-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        /* Footer info */
        .app-footer {
          text-align: center;
          padding: 16px;
          border-top: 1px solid var(--border-color);
          background: rgba(10, 10, 12, 0.9);
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
