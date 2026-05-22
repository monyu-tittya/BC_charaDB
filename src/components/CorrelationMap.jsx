import React, { useState } from 'react';
import { ArrowLeftRight, HelpCircle, User, Sparkles, BookOpen, UserCheck } from 'lucide-react';

export default function CorrelationMap({ characters }) {
  const [mapMode, setMapMode] = useState('story'); // 'story' (物語紹介) or 'individual' (個別ナビ)
  const [focusId, setFocusId] = useState(characters[0]?.id || '');

  const focusChar = characters.find(c => c.id === focusId);
  const otherChars = characters.filter(c => c.id !== focusId);

  if (!focusChar) return null;

  return (
    <div className="correlation-container fade-in">
      <div className="chart-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="chart-title">
            <span className="glow-text" style={{ color: 'var(--accent-neon-pink)' }}>CORRELATION MAP</span>
            <span className="sub-title">相関図・関係性ナビゲーター</span>
          </h2>
        </div>

        {/* モード切替タブ */}
        <div className="map-mode-tabs" style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            type="button" 
            className={`map-mode-btn ${mapMode === 'story' ? 'active' : ''}`}
            onClick={() => setMapMode('story')}
            style={{
              flex: 1,
              background: mapMode === 'story' ? 'rgba(255, 0, 85, 0.08)' : 'transparent',
              border: 'none',
              color: mapMode === 'story' ? 'var(--accent-neon-pink)' : 'var(--text-secondary)',
              padding: '8px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <BookOpen size={14} />
            <span>物語紹介 & 全体相関</span>
          </button>
          <button 
            type="button" 
            className={`map-mode-btn ${mapMode === 'individual' ? 'active' : ''}`}
            onClick={() => setMapMode('individual')}
            style={{
              flex: 1,
              background: mapMode === 'individual' ? 'rgba(255, 0, 85, 0.08)' : 'transparent',
              border: 'none',
              color: mapMode === 'individual' ? 'var(--accent-neon-pink)' : 'var(--text-secondary)',
              padding: '8px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <UserCheck size={14} />
            <span>キャラクター個別ナビ</span>
          </button>
        </div>
      </div>

      {mapMode === 'story' ? (
        <div className="story-map-content fade-in" style={{ marginTop: '16px' }}>
          {/* 物語の紹介 */}
          <div className="story-intro-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.05), rgba(0, 0, 0, 0.4))',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--accent-neon-pink)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-neon-pink)' }} />
              ブラックチャンネルの世界観
            </h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
              魔界からやってきた悪魔のYouTuber・<strong>ブラック</strong>。彼が目をつけたのは、いたって普通の小学生・<strong>さとし</strong>。<br />
              二人は「鬼ヤバ動画」を撮影するために契約を結び、裏社会の闇や都市伝説、魔界の不思議に切り込んでいく。使い魔の<strong>カメラちゃん</strong>や、光の天使YouTuber<strong>プラナ</strong>たちを巻き込み、再生数のためなら手段を選ばない鬼ヤバなエンターテイメントが幕を開ける！
            </p>
          </div>

          {/* 勢力別関係図 */}
          <h3 className="section-title-label" style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>👥 主要グループ & 勢力図</h3>
          
          <div className="faction-grid" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            
            {/* 悪魔YouTuber勢 */}
            <div className="faction-card" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(226, 249, 0, 0.15)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px dashed rgba(226, 249, 0, 0.2)', paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-yellow)' }}>😈 魔界・悪魔YouTuber</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>目的: 鬼ヤバ動画の撮影 & 再生数稼ぎ</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {characters.filter(c => c.id === 'black' || c.id === 'camera').map(char => (
                  <div key={char.id} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{char.icon}</span>
                    <h4 style={{ fontSize: '0.75rem', color: char.color, margin: '2px 0', fontWeight: 'bold' }}>{char.name}</h4>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{char.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 境界線 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.6rem', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <span>⚡️ 対立 ＆ 契約 ＆ 友情 ⚡️</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>

            {/* 人間・契約者勢 & 天使YouTuber */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* 人間・契約者 */}
              <div className="faction-card" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0, 210, 255, 0.15)', borderRadius: '12px', padding: '12px' }}>
                <div style={{ borderBottom: '1px dashed rgba(0, 210, 255, 0.2)', paddingBottom: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-neon-blue)' }}>👦 人間・契約者勢</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                  {characters.filter(c => c.id === 'satoshi' || c.id === 'shogo').map(char => (
                    <div key={char.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>{char.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '0.7rem', color: char.color, margin: 0, fontWeight: 'bold' }}>{char.name}</h4>
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{char.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 天使YouTuber */}
              <div className="faction-card" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.2)', paddingBottom: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#fff' }}>👼 天界・天使YouTuber</span>
                  </div>
                  {characters.filter(c => c.id === 'prana').map(char => (
                    <div key={char.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>{char.icon}</span>
                      <div>
                        <h4 style={{ fontSize: '0.7rem', color: char.color, margin: 0, fontWeight: 'bold' }}>{char.name}</h4>
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{char.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '6px' }}>
                  対抗: 「光」の配信
                </div>
              </div>
            </div>

          </div>

          {/* 主要ストーリーライン関係解説 */}
          <h3 className="section-title-label" style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>🎬 主要ストーリーライン解説</h3>
          
          <div className="story-lines-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* ストーリー 1: ブラック ⇄ さとし */}
            <div className="story-line-card" style={{
              background: 'linear-gradient(135deg, rgba(226, 249, 0, 0.03), rgba(0, 210, 255, 0.03))',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  LINE 01: 悪魔の契約 ＆ 鬼ヤババディ
                </span>
                <span style={{ fontSize: '0.55rem', color: 'var(--accent-neon-yellow)', fontWeight: 'bold' }}>契約関係 (魂と引き換え)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>😈</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-yellow)' }}>ブラック</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⇄</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>👦</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-blue)' }}>さとし</span>
                </div>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                さとしの「鬼ヤバな動画を撮りたい」という願いと引き換えに、死後の魂をもらう契約を結んだ関係。ブラックが容赦なく仕掛ける過激な状況にさとしは毎回絶叫しつつも、撮影時には見事なコンビネーションを発揮する、切っても切れないバディです。
              </p>
            </div>

            {/* ストーリー 2: ブラック ⇄ カメラちゃん */}
            <div className="story-line-card" style={{
              background: 'linear-gradient(135deg, rgba(226, 249, 0, 0.03), rgba(255, 0, 85, 0.03))',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  LINE 02: 悪魔YouTuber ＆ 優秀すぎる相棒
                </span>
                <span style={{ fontSize: '0.55rem', color: 'var(--accent-neon-pink)', fontWeight: 'bold' }}>使い魔 (絶対的信頼)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>😈</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-yellow)' }}>ブラック</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⇄</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📹</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-pink)' }}>カメラちゃん</span>
                </div>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                ブラックが魔界から召喚した使い魔であり、撮影機材でもあるカメラの悪魔。ブラックの超次元的な無茶振りを完璧なカメラワークで収めるプロフェッショナル。ブラックが最も信頼を寄せる絶対的な撮影パートナーです。
              </p>
            </div>

            {/* ストーリー 3: ブラック ⇄ プラナ */}
            <div className="story-line-card" style={{
              background: 'linear-gradient(135deg, rgba(226, 249, 0, 0.03), rgba(255, 255, 255, 0.03))',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  LINE 03: 闇の悪魔 ⇄ 光の天使ライバル
                </span>
                <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 'bold' }}>ライバル関係 (配信競合)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>😈</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-yellow)' }}>ブラック</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⇄</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>👼</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>プラナ</span>
                </div>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                天界からYouTube配信のために降臨した天使プラナ。ブラックが配信する「闇深く鬼ヤバな動画」に対抗し、自身は「光り輝く健全な動画」を配信。動画のクオリティやチャンネル再生数をめぐって火花を散らすライバル関係です。
              </p>
            </div>

            {/* ストーリー 4: さとし ⇄ しょうご */}
            <div className="story-line-card" style={{
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.03), rgba(57, 255, 20, 0.03))',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  LINE 04: クラスメイト ＆ オカルト親友
                </span>
                <span style={{ fontSize: '0.55rem', color: 'var(--accent-neon-green)', fontWeight: 'bold' }}>親友 (日常の象徴)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>👦</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-blue)' }}>さとし</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⇄</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🧢</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-neon-green)' }}>しょうご</span>
                </div>
              </div>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                さとしのクラスメイトであり親友。都市伝説や怪奇現象に目がなく、首を突っ込んではブラックの鬼ヤバな動画に巻き込まれます。さとしにとってはブラックとの非日常的な悪魔の契約を隠しながら付き合う、大切な日常の友人です。
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              type="button"
              className="map-mode-switch-prompt"
              onClick={() => setMapMode('individual')}
              style={{
                background: 'rgba(255, 0, 85, 0.1)',
                border: '1px solid var(--accent-neon-pink)',
                color: 'var(--accent-neon-pink)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 0 8px rgba(255, 0, 85, 0.15)'
              }}
            >
              ➔ 各キャラのさらに詳細な呼び方・関係を見る
            </button>
          </div>
        </div>
      ) : (
        <div className="individual-map-content fade-in" style={{ marginTop: '16px' }}>
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
        </div>
      )}

      <style>{`
        .correlation-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .map-mode-btn {
          border-bottom: 2px solid transparent !important;
        }

        .map-mode-btn:hover {
          color: var(--text-primary) !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .map-mode-btn.active {
          border-color: var(--accent-neon-pink) !important;
          box-shadow: 0 0 10px rgba(255, 0, 85, 0.15);
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

        .map-mode-switch-prompt:hover {
          background: var(--accent-neon-pink) !important;
          color: #000 !important;
          box-shadow: 0 0 15px rgba(255, 0, 85, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
