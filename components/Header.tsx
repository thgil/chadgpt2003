'use client';

import { useState } from 'react';

export default function Header() {
  const [soundOn, setSoundOn] = useState(false);
  const [mode, setMode] = useState<'normal' | 'chaos' | 'mega'>('normal');

  const tickerText = '★★★ Welcome to HYPER CHAT 2003 ★★★ Experience the FUTURE of AI technology! ★★★ Chat with our super intelligent bot! ★★★ Today\'s users: ALL TIME HIGH! ★★★ NEW! Features added ★★★ Contact us for inquiries ★★★ Thank you for visiting! ★★★ あなたの夢を叶える ★★★';

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="logo-hyper rainbow-text">HYPER</span>
          <span className="logo-chat">CHAT</span>
          <span className="logo-year blink">2003</span>
        </div>

        <div className="header-controls">
          <button
            className={`header-btn ${soundOn ? 'active' : ''}`}
            onClick={() => setSoundOn(!soundOn)}
            title="Sound Settings"
          >
            {soundOn ? '🔊' : '🔇'} Sound
          </button>

          <div className="mode-selector">
            <span className="mode-label">MODE:</span>
            <button
              className={`mode-btn ${mode === 'normal' ? 'active' : ''}`}
              onClick={() => setMode('normal')}
            >
              Normal
            </button>
            <button
              className={`mode-btn ${mode === 'chaos' ? 'active' : ''}`}
              onClick={() => setMode('chaos')}
            >
              Chaos
            </button>
            <button
              className={`mode-btn ${mode === 'mega' ? 'active' : ''}`}
              onClick={() => setMode('mega')}
            >
              MEGA
            </button>
          </div>
        </div>

        <div className="header-stamps">
          <span className="stamp">٩(◕‿◕｡)۶</span>
          <span className="stamp">(ﾉ´ヮ`)ﾉ*: ･ﾟ✧</span>
          <span className="stamp">＼(￣▽￣)／</span>
        </div>
      </div>

      <div className="header-ticker">
        <marquee scrollamount={3}>
          {tickerText}
        </marquee>
      </div>

      <div className="header-badges">
        <span className="header-badge">Best of Web 2003</span>
        <span className="header-badge blink">★ COOL SITE ★</span>
        <span className="header-badge">HTML 4.01</span>
        <span className="header-badge">JavaScript ON</span>
        <span className="header-badge">Cookies OK</span>
        <span className="header-badge rainbow-text">AI Powered</span>
      </div>
    </header>
  );
}
