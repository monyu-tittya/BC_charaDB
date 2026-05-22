import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, PlusCircle, RefreshCw } from 'lucide-react';

const EMOJI_OPTIONS = ["😈", "📹", "👦", "🧢", "👼", "🦊", "🐈", "👩", "👨", "🌟", "🔥", "🔮", "🎒", "🎮", "💀"];
const COLOR_PRESETS = [
  { name: 'ネオンイエロー (ブラック風)', primary: '#e2f900', secondary: '#151800' },
  { name: 'ネオンピンク (カメラ風)', primary: '#ff0055', secondary: '#1a0009' },
  { name: 'ネオンブルー (さとし風)', primary: '#00d2ff', secondary: '#00141a' },
  { name: 'ネオングリーン (しょうご風)', primary: '#39ff14', secondary: '#051a02' },
  { name: 'エンジェルゴールド (プラナ風)', primary: '#ffffff', secondary: '#222222' },
  { name: 'デビルバイオレット', primary: '#bc13fe', secondary: '#13021a' },
];

export default function AdminHelper({ currentCharacters, onAddTemporarily, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kana: '',
    role: '',
    age: '',
    gender: '',
    height: 140,
    birthday: '',
    description: '',
    color: '#e2f900',
    secondaryColor: '#151800',
    icon: '😈'
  });

  const [copiedType, setCopiedType] = useState(null); // 'single' or 'full'

  // Generate ID from romaji or random if empty
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      // Make simple slug ID
      const autoId = prev.id ? prev.id : val.toLowerCase().replace(/[^a-z0-9]/g, '') || `char_${Math.floor(Math.random() * 1000)}`;
      return { ...prev, name: val, id: autoId };
    });
  };

  const selectPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      color: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  // Single JSON structure
  const singleJson = JSON.stringify(formData, null, 2);

  // Full merged JSON structure
  const fullMergedJson = JSON.stringify([...currentCharacters, formData], null, 2);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.id) {
      alert("名前とIDは必須項目です！");
      return;
    }
    // Add temporarily to view
    onAddTemporarily(formData);
    alert(`「${formData.name}」を画面上に一時追加しました！下のJSONをコピーして「characters.json」に書き込んでください。`);
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            <PlusCircle size={20} className="header-icon" />
            <span>キャラクター登録支援ツール</span>
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-scroll-area">
          <p className="modal-instruction">
            ここで新しいキャラクターのステータスを入力すると、<strong>Vercelデプロイ用のJSONコード</strong>が自動生成されます。また、「一時登録」ボタンで即座にアプリに反映させて見比べることも可能です！
          </p>

          <div className="admin-columns">
            {/* Form Column */}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID (英語・小文字半角、重複不可)</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  onChange={e => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  placeholder="例: satan, black_demon"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>キャラクター名</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={handleNameChange}
                    placeholder="例: ブラック"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ふりがな</label>
                  <input 
                    type="text" 
                    value={formData.kana} 
                    onChange={e => setFormData({ ...formData, kana: e.target.value })}
                    placeholder="例: ぶらっく"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>役割・肩書き</label>
                  <input 
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="例: 悪魔YouTuber"
                  />
                </div>
                <div className="form-group">
                  <label>性別</label>
                  <input 
                    type="text" 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    placeholder="例: 男（悪魔）"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>身長 (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height} 
                    onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                    min="10"
                    max="300"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>誕生日</label>
                  <input 
                    type="text" 
                    value={formData.birthday} 
                    onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                    placeholder="例: 9月6日"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>年齢・ステータス</label>
                <input 
                  type="text" 
                  value={formData.age} 
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  placeholder="例: 悪魔年齢53万歳"
                />
              </div>

              {/* Emoji Icon Selection */}
              <div className="form-group">
                <label>アイコン（絵文字）</label>
                <div className="emoji-selector">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button 
                      key={emoji}
                      type="button"
                      className={`emoji-btn ${formData.icon === emoji ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                    >
                      {emoji}
                    </button>
                  ))}
                  <input 
                    type="text" 
                    maxLength="2"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="自作"
                    style={{ width: '50px', padding: '4px', textAlign: 'center' }}
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="form-group">
                <label>テーマカラー設定</label>
                <div className="preset-grid">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button 
                      key={idx} 
                      type="button" 
                      className="preset-btn"
                      onClick={() => selectPreset(preset)}
                      style={{ borderLeft: `6px solid ${preset.primary}` }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <div className="form-row color-pickers">
                  <div className="color-picker-item">
                    <span>メインカラー</span>
                    <input 
                      type="color" 
                      value={formData.color} 
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <div className="color-picker-item">
                    <span>背景サブカラー</span>
                    <input 
                      type="color" 
                      value={formData.secondaryColor} 
                      onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>紹介文・説明</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="キャラクターの詳しい紹介文を入力してください..."
                  rows="3"
                />
              </div>

              <button type="submit" className="submit-btn">
                <Sparkles size={16} />
                <span>この画面上に一時反映して確認する</span>
              </button>
            </form>

            {/* Live Preview & JSON Copy Column */}
            <div className="admin-preview-col">
              <label className="section-title-label">🔴 リアルタイムカードプレビュー</label>
              
              <div 
                className="live-preview-card"
                style={{
                  '--card-glow': formData.color,
                  background: `linear-gradient(135deg, ${formData.secondaryColor || '#111'}, #121217)`
                }}
              >
                <div className="preview-card-glow" style={{ backgroundColor: formData.color }} />
                <div className="preview-badge" style={{ color: formData.color, borderColor: formData.color }}>
                  {formData.role || '肩書き未設定'}
                </div>
                <div className="preview-avatar-row">
                  <div className="preview-avatar" style={{ boxShadow: `0 0 15px ${formData.color}40`, border: `1px solid ${formData.color}` }}>
                    {formData.icon}
                  </div>
                  <div>
                    <h4 className="preview-name" style={{ color: formData.color }}>{formData.name || '名前未入力'}</h4>
                    <span className="preview-kana">{formData.kana || 'かな'}</span>
                  </div>
                </div>
                <div className="preview-stats">
                  <div><span>身長</span><strong>{formData.height}cm</strong></div>
                  <div><span>誕生日</span><strong>{formData.birthday || '未設定'}</strong></div>
                  <div><span>年齢</span><strong>{formData.age || '未設定'}</strong></div>
                  <div><span>性別</span><strong>{formData.gender || '未設定'}</strong></div>
                </div>
                <p className="preview-desc">{formData.description || 'ここに説明文が表示されます。'}</p>
              </div>

              {/* JSON Exporter */}
              <div className="json-exporter">
                <div className="tab-header">
                  <label className="section-title-label">💻 登録用JSON出力</label>
                </div>
                
                {/* Option A: Full Overwrite JSON (RECOMMENDED) */}
                <div className="json-box-wrapper">
                  <div className="json-box-header">
                    <span>characters.json にまるごと上書きする用（推奨）</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(fullMergedJson, 'full')}
                    >
                      {copiedType === 'full' ? <Check size={14} className="copied" /> : <Copy size={14} />}
                      <span>{copiedType === 'full' ? 'コピー完了！' : '全コピー'}</span>
                    </button>
                  </div>
                  <pre className="json-pre"><code>{fullMergedJson}</code></pre>
                </div>

                {/* Option B: Single Character JSON */}
                <div className="json-box-wrapper">
                  <div className="json-box-header">
                    <span>末尾に追加する用 (1体分)</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(singleJson, 'single')}
                    >
                      {copiedType === 'single' ? <Check size={14} className="copied" /> : <Copy size={14} />}
                      <span>{copiedType === 'single' ? 'コピー完了！' : 'コピー'}</span>
                    </button>
                  </div>
                  <pre className="json-pre"><code>{singleJson}</code></pre>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .admin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: var(--glass-blur);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }

        .admin-modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-neon-yellow);
          font-family: var(--font-cyber);
          font-size: 1.1rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .close-btn:hover {
          color: var(--accent-neon-pink);
        }

        .modal-scroll-area {
          overflow-y: auto;
          padding: 16px;
          flex: 1;
        }

        .modal-instruction {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          border-left: 3px solid var(--accent-neon-yellow);
          line-height: 1.4;
        }

        .admin-columns {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .admin-columns {
            grid-template-columns: 1fr;
          }
        }

        /* Form styling */
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .form-group input, 
        .form-group textarea,
        .form-group select {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 8px 12px;
          color: var(--text-primary);
          font-size: 0.8rem;
          outline: none;
          transition: var(--transition-smooth);
        }

        .form-group input:focus, 
        .form-group textarea:focus {
          border-color: var(--accent-neon-yellow);
          box-shadow: 0 0 8px rgba(226, 249, 0, 0.15);
        }

        .emoji-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }

        .emoji-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .emoji-btn:hover, .emoji-btn.active {
          background: rgba(226, 249, 0, 0.1);
          border-color: var(--accent-neon-yellow);
          transform: scale(1.1);
        }

        .preset-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 8px;
        }

        .preset-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.65rem;
          text-align: left;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: var(--transition-smooth);
        }

        .preset-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.03);
        }

        .color-pickers {
          margin-top: 4px;
        }

        .color-picker-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 4px 10px;
        }

        .color-picker-item span {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .color-picker-item input[type="color"] {
          background: transparent;
          border: none;
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .submit-btn {
          background: var(--accent-neon-yellow);
          color: #000;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
          font-size: 0.8rem;
          transition: var(--transition-smooth);
        }

        .submit-btn:hover {
          box-shadow: 0 0 15px rgba(226, 249, 0, 0.4);
          transform: translateY(-1px);
        }

        /* Preview card & JSON output styling */
        .admin-preview-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .section-title-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: var(--font-cyber);
          font-weight: 700;
        }

        .live-preview-card {
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 14px;
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        .live-preview-card::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: 12px;
          border: 1px solid var(--card-glow);
          opacity: 0.3;
          pointer-events: none;
        }

        .preview-card-glow {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          filter: blur(40px);
          opacity: 0.4;
          pointer-events: none;
        }

        .preview-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.55rem;
          font-weight: bold;
          border: 1px solid;
          border-radius: 10px;
          padding: 2px 8px;
          background: rgba(0,0,0,0.3);
        }

        .preview-avatar-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .preview-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .preview-name {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .preview-kana {
          font-size: 0.6rem;
          color: var(--text-secondary);
          display: block;
          margin-top: -2px;
        }

        .preview-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          background: rgba(0,0,0,0.25);
          padding: 6px;
          border-radius: 6px;
          margin-bottom: 10px;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .preview-stats div {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .preview-stats span {
          font-size: 0.55rem;
          color: var(--text-muted);
        }

        .preview-stats strong {
          font-size: 0.7rem;
          color: var(--text-primary);
          margin-top: 1px;
        }

        .preview-desc {
          font-size: 0.7rem;
          color: var(--text-secondary);
          line-height: 1.4;
          height: 4.2em;
          overflow-y: auto;
        }

        /* JSON Boxes */
        .json-exporter {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .json-box-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .json-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .json-box-header span {
          font-size: 0.6rem;
          color: var(--text-secondary);
        }

        .copy-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .copy-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.1);
          border-color: var(--text-muted);
        }

        .copy-btn .copied {
          color: var(--accent-neon-green);
        }

        .json-pre {
          background: #000;
          color: #a9ffaf;
          padding: 8px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.65rem;
          max-height: 120px;
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
}
