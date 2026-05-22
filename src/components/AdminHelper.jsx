import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, PlusCircle, RefreshCw, Network } from 'lucide-react';

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
    gender: '男',
    height: 140,
    birthday: '',
    firstPerson: '',
    laugh: '',
    catchphrase: '',
    ending: '',
    traits: [],
    description: '',
    color: '#e2f900',
    secondaryColor: '#151800',
    icon: '😈',
    relationships: {}
  });

  const [editMode, setEditMode] = useState('create'); // 'create' or 'edit'
  const [selectedEditCharId, setSelectedEditCharId] = useState('');
  const [traitsInput, setTraitsInput] = useState('');
  const [relCharId, setRelCharId] = useState('');
  const [relCall, setRelCall] = useState('');
  const [relRelation, setRelRelation] = useState('');
  const [copiedType, setCopiedType] = useState(null); // 'single' or 'full'

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      kana: '',
      role: '',
      age: '',
      gender: '男',
      height: 140,
      birthday: '',
      firstPerson: '',
      laugh: '',
      catchphrase: '',
      ending: '',
      traits: [],
      description: '',
      color: '#e2f900',
      secondaryColor: '#151800',
      icon: '😈',
      relationships: {}
    });
    setTraitsInput('');
    setRelCharId('');
    setRelCall('');
    setRelRelation('');
    setSelectedEditCharId('');
  };

  const handleModeChange = (mode) => {
    setEditMode(mode);
    resetForm();
  };

  const handleSelectEditChar = (charId) => {
    setSelectedEditCharId(charId);
    if (!charId) {
      resetForm();
      setEditMode('edit');
      return;
    }
    const char = currentCharacters.find(c => c.id === charId);
    if (char) {
      setFormData({
        id: char.id || '',
        name: char.name || '',
        kana: char.kana || '',
        role: char.role || '',
        age: char.age || '',
        gender: char.gender || '男',
        height: char.height || 140,
        birthday: char.birthday || '',
        firstPerson: char.firstPerson || '',
        laugh: char.laugh || '',
        catchphrase: char.catchphrase || '',
        ending: char.ending || '',
        traits: char.traits || [],
        description: char.description || '',
        color: char.color || '#e2f900',
        secondaryColor: char.secondaryColor || '#151800',
        icon: char.icon || '😈',
        relationships: char.relationships || {}
      });
      setTraitsInput((char.traits || []).join(', '));
      setRelCharId('');
      setRelCall('');
      setRelRelation('');
    }
  };

  // Generate ID from romaji or random if empty
  const handleNameChange = (e) => {
    if (editMode === 'edit') return; // 既存編集時はID自動生成はしない
    const val = e.target.value;
    setFormData(prev => {
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

  const handleTraitsChange = (val) => {
    setTraitsInput(val);
    const arr = val.split(/[,,、\s]+/).map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, traits: arr }));
  };

  const handleAddRelationship = () => {
    if (!relCharId) {
      alert('関係を設定するキャラクターを選択してください。');
      return;
    }
    if (!relCall.trim() || !relRelation.trim()) {
      alert('呼び方と関係性を入力してください。');
      return;
    }

    setFormData(prev => {
      const updatedRelationships = {
        ...prev.relationships,
        [relCharId]: {
          call: relCall.trim(),
          relation: relRelation.trim()
        }
      };
      return { ...prev, relationships: updatedRelationships };
    });

    setRelCall('');
    setRelRelation('');
  };

  const handleRemoveRelationship = (charIdToDelete) => {
    setFormData(prev => {
      const updated = { ...prev.relationships };
      delete updated[charIdToDelete];
      return { ...prev, relationships: updated };
    });
  };

  // Single JSON structure
  const singleJson = JSON.stringify(formData, null, 2);

  // Full merged JSON structure
  const fullMergedJson = React.useMemo(() => {
    if (editMode === 'edit') {
      const updatedList = currentCharacters.map(char => 
        char.id === formData.id ? formData : char
      );
      return JSON.stringify(updatedList, null, 2);
    } else {
      if (currentCharacters.some(c => c.id === formData.id)) {
        const updatedList = currentCharacters.map(char => 
          char.id === formData.id ? formData : char
        );
        return JSON.stringify(updatedList, null, 2);
      }
      return JSON.stringify([...currentCharacters, formData], null, 2);
    }
  }, [currentCharacters, formData, editMode]);

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
    onAddTemporarily(formData);
    const actionText = editMode === 'edit' ? '修正' : '一時追加';
    alert(`「${formData.name}」のデータを一時反映しました！下のJSONをコピーして「characters.json」に書き込んでください。`);
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
            ここで新しいキャラクターのステータスを入力すると、<strong>Vercelデプロイ用のJSONコード</strong>が自動生成されます。また、「一時反映」ボタンで即座にアプリに反映させて見比べることも可能です！
          </p>

          {/* モード切替タブ */}
          <div className="mode-tabs">
            <button 
              type="button" 
              className={`mode-tab-btn ${editMode === 'create' ? 'active' : ''}`} 
              onClick={() => handleModeChange('create')}
            >
              新規登録
            </button>
            <button 
              type="button" 
              className={`mode-tab-btn ${editMode === 'edit' ? 'active' : ''}`} 
              onClick={() => handleModeChange('edit')}
            >
              登録修正
            </button>
          </div>

          {/* 編集キャラクター選択セレクトボックス */}
          {editMode === 'edit' && (
            <div className="form-group edit-select-group">
              <label>編集するキャラクターを選択</label>
              <select 
                value={selectedEditCharId} 
                onChange={e => handleSelectEditChar(e.target.value)}
                className="edit-char-select"
              >
                <option value="">-- 選択してください --</option>
                {currentCharacters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name} ({char.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="admin-columns">
            {/* Form Column */}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID (英語・小文字半角、重複不可{editMode === 'edit' && ' - 修正時は変更不可'})</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  onChange={e => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  placeholder="例: satan, black_demon"
                  required
                  readOnly={editMode === 'edit'}
                  className={editMode === 'edit' ? 'readonly-input' : ''}
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
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="不明">不明</option>
                  </select>
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

              <div className="form-row">
                <div className="form-group">
                  <label>一人称</label>
                  <input 
                    type="text" 
                    value={formData.firstPerson} 
                    onChange={e => setFormData({ ...formData, firstPerson: e.target.value })}
                    placeholder="例: オレ、わたし"
                  />
                </div>
                <div className="form-group">
                  <label>笑い方</label>
                  <input 
                    type="text" 
                    value={formData.laugh} 
                    onChange={e => setFormData({ ...formData, laugh: e.target.value })}
                    placeholder="例: クハハハ！、ウフフ♪"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>口癖・決め台詞</label>
                  <input 
                    type="text" 
                    value={formData.catchphrase} 
                    onChange={e => setFormData({ ...formData, catchphrase: e.target.value })}
                    placeholder="例: 鬼ヤバ動画、配信スタート！"
                  />
                </div>
                <div className="form-group">
                  <label>語尾</label>
                  <input 
                    type="text" 
                    value={formData.ending} 
                    onChange={e => setFormData({ ...formData, ending: e.target.value })}
                    placeholder="例: 〜だ、〜ぜ、〜です"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>特徴タグ (カンマ「,」または「、」区切りで複数入力)</label>
                <input 
                  type="text" 
                  value={traitsInput} 
                  onChange={e => handleTraitsChange(e.target.value)}
                  placeholder="例: 悪魔, YouTuber, 契約者殺し"
                />
                {formData.traits && formData.traits.length > 0 && (
                  <div className="preview-traits-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {formData.traits.map((t, i) => (
                      <span key={i} className="trait-pill-preview" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: formData.color }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Relationships editor */}
              <div className="form-group relationship-editor-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px' }}>
                <label style={{ color: 'var(--accent-neon-yellow)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Network size={14} /> 相関図・キャラクター関係設定
                </label>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  他のキャラクターとの関係を設定できます。
                </p>
                
                <div className="relationship-add-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '6px', alignItems: 'end' }}>
                  <div className="form-subgroup" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>対象キャラ</span>
                    <select 
                      value={relCharId}
                      onChange={e => setRelCharId(e.target.value)}
                      style={{ padding: '6px', fontSize: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                    >
                      <option value="">選択</option>
                      {currentCharacters && currentCharacters.map(char => (
                        <option key={char.id} value={char.id}>{char.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-subgroup" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>呼称</span>
                    <input 
                      type="text" 
                      value={relCall}
                      onChange={e => setRelCall(e.target.value)}
                      placeholder="例: カメラちゃん"
                      style={{ padding: '6px', fontSize: '0.75rem' }}
                    />
                  </div>

                  <div className="form-subgroup" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>関係</span>
                    <input 
                      type="text" 
                      value={relRelation}
                      onChange={e => setRelRelation(e.target.value)}
                      placeholder="例: 優秀な相棒"
                      style={{ padding: '6px', fontSize: '0.75rem' }}
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleAddRelationship}
                    className="add-rel-btn"
                    style={{
                      background: 'rgba(226, 249, 0, 0.1)',
                      border: '1px solid var(--accent-neon-yellow)',
                      color: 'var(--accent-neon-yellow)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      height: '32px'
                    }}
                  >
                    追加
                  </button>
                </div>

                {/* List of currently set relationships */}
                {Object.keys(formData.relationships).length > 0 && (
                  <div className="added-relationships-list" style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.65rem', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>設定済みの関係 ({Object.keys(formData.relationships).length}) :</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(formData.relationships).map(([targetId, info]) => {
                        const targetChar = currentCharacters.find(c => c.id === targetId);
                        return (
                          <div key={targetId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '4px', borderLeft: `3px solid ${formData.color}` }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.7rem' }}>
                              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{targetChar ? targetChar.name : targetId}</span>
                              <span style={{ color: 'var(--text-muted)' }}>呼称:</span>
                              <span style={{ color: formData.color, fontWeight: 'bold' }}>「{info.call}」</span>
                              <span style={{ color: 'var(--text-muted)' }}>関係:</span>
                              <span style={{ color: 'var(--text-primary)' }}>{info.relation}</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveRelationship(targetId)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-neon-pink)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                              title="関係を削除"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  background: `linear-gradient(135deg, ${formData.secondaryColor || '#111'}, #121217)`,
                  paddingBottom: '20px'
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

                {/* Traits preview */}
                {formData.traits && formData.traits.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {formData.traits.map((t, i) => (
                      <span key={i} style={{ fontSize: '0.6rem', color: formData.color, background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '3px', border: `1px solid ${formData.color}30` }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="preview-stats">
                  <div><span>身長</span><strong>{formData.height}cm</strong></div>
                  <div><span>誕生日</span><strong>{formData.birthday || '未設定'}</strong></div>
                  <div><span>年齢</span><strong>{formData.age || '未設定'}</strong></div>
                  <div><span>性別</span><strong>{formData.gender || '未設定'}</strong></div>
                </div>

                {/* Catchphrase speech bubble if exists */}
                {formData.catchphrase && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${formData.color}`,
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    color: '#fff',
                    marginBottom: '8px',
                    fontStyle: 'italic',
                    position: 'relative'
                  }}>
                    「{formData.catchphrase}」
                  </div>
                )}

                {/* Mannerisms Grid (firstPerson, laugh, ending) */}
                {(formData.firstPerson || formData.laugh || formData.ending) && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '4px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '0.6rem'
                  }}>
                    {formData.firstPerson && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>一人称: <span style={{ color: '#fff', fontWeight: 'bold' }}>{formData.firstPerson}</span></div>}
                    {formData.laugh && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>笑い方: <span style={{ color: formData.color, fontWeight: 'bold' }}>{formData.laugh}</span></div>}
                    {formData.ending && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>語尾: <span style={{ color: '#fff', fontWeight: 'bold' }}>{formData.ending}</span></div>}
                  </div>
                )}

                <p className="preview-desc">{formData.description || 'ここに説明文が表示されます。'}</p>

                {/* Relationships preview */}
                {Object.keys(formData.relationships).length > 0 && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>設定済みの関係性:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {Object.entries(formData.relationships).map(([tId, info]) => {
                        const target = currentCharacters.find(c => c.id === tId);
                        return (
                          <span key={tId} style={{ fontSize: '0.55rem', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <strong style={{ color: formData.color }}>{target ? target.name : tId}</strong> ➔ {info.relation} (呼: {info.call})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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

        .mode-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .mode-tab-btn {
          flex: 1;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 10px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          text-align: center;
        }

        .mode-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.03);
          border-color: var(--text-muted);
        }

        .mode-tab-btn.active {
          background: rgba(226, 249, 0, 0.1);
          border-color: var(--accent-neon-yellow);
          color: var(--accent-neon-yellow);
          box-shadow: 0 0 10px rgba(226, 249, 0, 0.1);
        }

        .edit-select-group {
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .edit-char-select {
          border-color: var(--accent-neon-pink) !important;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          padding: 10px !important;
          font-weight: 600;
        }

        .edit-char-select:focus {
          box-shadow: 0 0 8px rgba(255, 0, 85, 0.25) !important;
        }

        .readonly-input {
          background: rgba(255, 255, 255, 0.02) !important;
          color: var(--text-muted) !important;
          cursor: not-allowed !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }

        .readonly-input:focus {
          border-color: rgba(255, 255, 255, 0.05) !important;
          box-shadow: none !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
