'use client';

import { useState, useEffect } from 'react';

type EntryStep = 'loading' | 'robot' | 'login' | 'complete';

interface EntryFlowProps {
  onComplete: () => void;
}

const loadingMessages = [
  'システム初期化中... / Initializing systems...',
  'セキュア接続確立中... / Establishing secure connection...',
  'モジュール読み込み中... / Loading modules...',
  '証明書認証中... / Authenticating certificates...',
  'クラウド同期中... / Synchronizing with cloud...',
  'ライセンス検証中... / Validating licenses...',
  'AIサービス接続中... / Connecting to AI services...',
  'コンプライアンス確認中... / Checking compliance...',
  'セキュリティ初期化中... / Initializing security...',
  '環境準備中... / Preparing environment...',
  '最終設定中... / Finalizing configuration...',
  'ファイアウォール確認中... / Checking firewall...',
  'プロキシ設定中... / Configuring proxy...',
  'DNS解決中... / Resolving DNS...',
  'SSLハンドシェイク中... / SSL handshake...',
];

const fakeSecurityQuestions = [
  'What is your mother\'s maiden name?',
  'What was the name of your first pet?',
  'What city were you born in?',
  'What is your favorite movie?',
  'What was your childhood nickname?',
  'What street did you grow up on?',
  'What is your favorite food?',
];

const fakeAnnouncements = [
  '【重要】2024年1月よりパスワードポリシーが変更されます',
  '【お知らせ】年末年始のサポート対応について',
  '【メンテナンス】1月15日 02:00-06:00 定期メンテナンス',
  '【セキュリティ】不審なログイン試行が増加しています',
  '【更新】利用規約が改定されました（2024年版）',
];

// JR-style header component
const JRHeader = ({ currentStep }: { currentStep: EntryStep }) => {
  const steps = [
    { id: 'loading', label: 'STEP1', name: 'システム起動' },
    { id: 'robot', label: 'STEP2', name: '本人確認' },
    { id: 'login', label: 'STEP3', name: 'ログイン' },
  ];

  return (
    <div className="jr-header">
      <div className="jr-header-top">
        <div className="jr-logo">
          <span className="jr-logo-mark">HC</span>
          <span className="jr-logo-text">HYPER CHAT</span>
          <span className="jr-logo-sub">Enterprise Portal v2003</span>
        </div>
        <div className="jr-header-nav">
          <span className="jr-nav-item">ホーム</span>
          <span className="jr-nav-divider">|</span>
          <span className="jr-nav-item">サポート</span>
          <span className="jr-nav-divider">|</span>
          <span className="jr-nav-item">マニュアル</span>
          <span className="jr-nav-divider">|</span>
          <span className="jr-nav-item">お問い合わせ</span>
          <span className="jr-nav-divider">|</span>
          <span className="jr-nav-item">English</span>
          <span className="jr-nav-divider">|</span>
          <span className="jr-nav-item">中文</span>
        </div>
      </div>
      <div className="jr-header-tabs">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`jr-tab ${currentStep === s.id ? 'active' : ''} ${
              steps.findIndex(st => st.id === currentStep) > i ? 'completed' : ''
            }`}
          >
            <span className="jr-tab-label">{s.label}</span>
            <span className="jr-tab-name">{s.name}</span>
          </div>
        ))}
        <div className="jr-tab disabled">
          <span className="jr-tab-label">STEP4</span>
          <span className="jr-tab-name">二段階認証</span>
        </div>
        <div className="jr-tab disabled">
          <span className="jr-tab-label">STEP5</span>
          <span className="jr-tab-name">利用規約同意</span>
        </div>
      </div>
      <div className="jr-header-announcement">
        <marquee scrollamount={2}>
          {fakeAnnouncements.join('　　●　　')}
        </marquee>
      </div>
    </div>
  );
};

// JR-style footer component
const JRFooter = () => (
  <div className="jr-footer">
    <div className="jr-footer-links">
      <a href="#">利用規約</a>
      <span>|</span>
      <a href="#">プライバシーポリシー</a>
      <span>|</span>
      <a href="#">セキュリティポリシー</a>
      <span>|</span>
      <a href="#">Cookie設定</a>
      <span>|</span>
      <a href="#">アクセシビリティ</a>
      <span>|</span>
      <a href="#">お問い合わせ</a>
      <span>|</span>
      <a href="#">サイトマップ</a>
      <span>|</span>
      <a href="#">運営会社</a>
    </div>
    <div className="jr-footer-info">
      <div className="jr-footer-row">
        <span>運営: Hyper Chat Corporation</span>
        <span>|</span>
        <span>Build: 2003.12.25.rev.4521</span>
        <span>|</span>
        <span>Region: APAC-JP-TOKYO-03</span>
        <span>|</span>
        <span>Node: hc-prod-web-042</span>
      </div>
      <div className="jr-footer-row">
        <span>Session: {Math.random().toString(36).substring(2, 15)}</span>
        <span>|</span>
        <span>Request ID: {Date.now()}</span>
      </div>
    </div>
    <div className="jr-footer-copyright">
      © 2003-2024 HYPER CHAT CORPORATION. All Rights Reserved.
      本サービスの無断複製・転載を禁じます。
    </div>
    <div className="jr-footer-badges">
      <span className="jr-footer-badge">ISO 27001</span>
      <span className="jr-footer-badge">SOC 2 Type II</span>
      <span className="jr-footer-badge">GDPR Compliant</span>
      <span className="jr-footer-badge">ISMS認証</span>
    </div>
  </div>
);

// JR-style info table
const InfoTable = ({ data }: { data: { label: string; value: string; status?: 'ok' | 'warn' | 'info' }[] }) => (
  <table className="jr-info-table">
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          <th>{row.label}</th>
          <td className={row.status ? `status-${row.status}` : ''}>{row.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function EntryFlow({ onComplete }: EntryFlowProps) {
  const [step, setStep] = useState<EntryStep>('loading');
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [robotChecked, setRobotChecked] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [securityQuestion] = useState(
    fakeSecurityQuestions[Math.floor(Math.random() * fakeSecurityQuestions.length)]
  );
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });

  const popupMessages = [
    { title: 'セキュリティ通知 / Security Notice', message: 'このセッションは暗号化されています。セキュリティ上の理由から、10分間操作がない場合は自動的にログアウトされます。\n\nThis session is encrypted. For security reasons, you will be automatically logged out after 10 minutes of inactivity.' },
    { title: 'Cookie使用について / Cookie Policy', message: '当サイトでは、サービス向上のためCookieを使用しています。引き続きご利用いただくことで、Cookie使用に同意したものとみなされます。\n\nWe use cookies to improve our services. By continuing to use this site, you consent to our use of cookies.' },
    { title: 'システム通知 / System Notice', message: '現在、サーバーの負荷が通常より高くなっています。応答に時間がかかる場合があります。ご了承ください。\n\nServer load is currently higher than usual. Response times may be slower.' },
    { title: 'メンテナンス予告 / Maintenance Notice', message: '2024年1月15日 午前2:00〜6:00（JST）に定期メンテナンスを実施予定です。この間、サービスをご利用いただけません。\n\nScheduled maintenance: January 15, 2024, 2:00 AM - 6:00 AM JST.' },
  ];

  // Show random popup during loading or robot step
  useEffect(() => {
    if (step === 'loading' && progress > 50 && progress < 60) {
      const randomPopup = popupMessages[Math.floor(Math.random() * popupMessages.length)];
      setPopupContent(randomPopup);
      setShowPopup(true);
    }
  }, [progress, step]);

  // Show another popup when entering login step
  useEffect(() => {
    if (step === 'login') {
      const timer = setTimeout(() => {
        setPopupContent({
          title: 'ログイン前の確認 / Pre-Login Confirmation',
          message: '企業ポータルへのログインを試みています。\n\n認証情報は安全に処理されます。不正アクセスの試みは記録され、法的措置の対象となる場合があります。\n\nYou are attempting to log in to the enterprise portal. Your credentials will be processed securely. Unauthorized access attempts are logged and may be subject to legal action.'
        });
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // CAPTCHA state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaSelections, setCaptchaSelections] = useState<number[]>([]);
  const [captchaError, setCaptchaError] = useState('');

  // CAPTCHA grid - select all trains (indices 0, 3, 5, 7)
  const captchaImages = [
    { emoji: '🚃', label: '電車', isTrain: true },
    { emoji: '🚗', label: '車', isTrain: false },
    { emoji: '🚲', label: '自転車', isTrain: false },
    { emoji: '🚄', label: '新幹線', isTrain: true },
    { emoji: '✈️', label: '飛行機', isTrain: false },
    { emoji: '🚂', label: '蒸気機関車', isTrain: true },
    { emoji: '🚌', label: 'バス', isTrain: false },
    { emoji: '🚅', label: '高速鉄道', isTrain: true },
    { emoji: '🛵', label: 'スクーター', isTrain: false },
  ];

  const correctTrainIndices = captchaImages
    .map((img, idx) => img.isTrain ? idx : -1)
    .filter(idx => idx !== -1);

  const toggleCaptchaSelection = (index: number) => {
    if (captchaVerified) return;
    setCaptchaSelections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    setCaptchaError('');
  };

  const verifyCaptcha = () => {
    const sortedSelections = [...captchaSelections].sort();
    const sortedCorrect = [...correctTrainIndices].sort();

    if (sortedSelections.length === sortedCorrect.length &&
        sortedSelections.every((val, idx) => val === sortedCorrect[idx])) {
      setCaptchaVerified(true);
      setCaptchaError('');
    } else {
      setCaptchaError('認証に失敗しました。すべての電車・列車を選択してください。/ Verification failed. Select all trains.');
      setCaptchaSelections([]);
    }
  };

  // Loading screen progress - slower
  useEffect(() => {
    if (step !== 'loading') return;

    const msgInterval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % loadingMessages.length);
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const jump = Math.random() * 8 + 2;
        const newProgress = prev + jump;
        if (newProgress >= 100) {
          setTimeout(() => setStep('robot'), 800);
          return 100;
        }
        if (Math.random() < 0.15 && prev > 20) {
          return prev - 3;
        }
        return Math.min(newProgress, 100);
      });
    }, 500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [step]);

  const handleRobotCheck = () => {
    if (robotChecked) return;
    setRobotChecked(true);
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setTimeout(() => setStep('login'), 1200);
    }, 3000);
  };

  const handleLogin = () => {
    if (!captchaVerified) {
      setLoginError('画像認証を完了してください。/ Please complete the image verification.');
      setTimeout(() => setLoginError(''), 4000);
      return;
    }
    if (!termsChecked || !privacyChecked) {
      setLoginError('利用規約およびプライバシーポリシーへの同意が必要です。/ You must agree to Terms and Privacy Policy.');
      setTimeout(() => setLoginError(''), 4000);
      return;
    }
    if (username.toLowerCase() === 'claude' && password.toLowerCase() === 'claude') {
      setStep('complete');
      setTimeout(onComplete, 800);
    } else {
      setLoginError('認証エラー: 社員IDまたはパスワードが正しくありません。3回連続で失敗するとアカウントがロックされます。/ Authentication failed. Invalid credentials.');
      setTimeout(() => setLoginError(''), 4000);
    }
  };

  // Popup Component (defined here for use in all steps)
  const EntryPopup = () => {
    if (!showPopup) return null;
    return (
      <div className="jr-popup-overlay" onClick={() => setShowPopup(false)}>
        <div className="jr-popup" onClick={(e) => e.stopPropagation()}>
          <div className="jr-popup-header">
            <span className="jr-popup-title">{popupContent.title}</span>
            <button className="jr-popup-close" onClick={() => setShowPopup(false)}>✕</button>
          </div>
          <div className="jr-popup-content">
            <div className="jr-popup-notice" style={{ whiteSpace: 'pre-line' }}>
              {popupContent.message}
            </div>
          </div>
          <div className="jr-popup-footer">
            <button className="jr-btn primary" onClick={() => setShowPopup(false)}>OK / 閉じる</button>
          </div>
        </div>
      </div>
    );
  };

  if (step === 'loading') {
    return (
      <>
      <div className="entry-screen loading-step">
        <JRHeader currentStep={step} />

        <div className="jr-content">
          <div className="jr-sidebar-left">
            <div className="jr-box">
              <div className="jr-box-header green">お知らせ / Announcements</div>
              <div className="jr-box-content">
                <ul className="jr-notice-list">
                  <li><span className="jr-badge new">NEW</span> システムアップデート完了</li>
                  <li><span className="jr-badge">重要</span> 年末年始の運用について</li>
                  <li><span className="jr-badge warn">注意</span> パスワード変更のお願い</li>
                  <li>セキュリティパッチ適用済み</li>
                  <li>新機能: AI応答の高速化</li>
                </ul>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header blue">システム情報</div>
              <InfoTable data={[
                { label: 'Version', value: 'v2003.12.25' },
                { label: 'Status', value: '● 稼働中', status: 'ok' },
                { label: 'Latency', value: '42ms', status: 'ok' },
                { label: 'Region', value: 'APAC-TOKYO' },
                { label: 'Load', value: '23%', status: 'ok' },
                { label: 'Uptime', value: '99.97%', status: 'ok' },
              ]} />
            </div>

            <div className="jr-box">
              <div className="jr-box-header">クイックリンク</div>
              <div className="jr-box-content">
                <ul className="jr-link-list">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>📖 ユーザーマニュアル</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>🔧 トラブルシューティング</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>📞 サポートデスク</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>📊 利用統計</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="jr-main-content">
            <div className="jr-breadcrumb">
              トップ &gt; エンタープライズポータル &gt; ログイン &gt; システム起動
            </div>

            <div className="jr-panel main-loading-panel">
              <div className="jr-panel-header">
                <span className="jr-panel-icon">●</span>
                HYPER CHAT 2003 - Enterprise AI Platform
                <span className="jr-panel-badge">Enterprise Edition</span>
              </div>
              <div className="jr-panel-content">
                <div className="loading-visual">
                  <div className="loading-ascii-small">
                    {'[ H Y P E R  C H A T ]'}
                  </div>
                  <div className="loading-subtitle">次世代AIコミュニケーションプラットフォーム</div>
                </div>

                <div className="jr-progress-section">
                  <div className="jr-progress-header">
                    <span>システム初期化 / System Initialization</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>
                  <div className="jr-progress-bar">
                    <div className="jr-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="jr-progress-message">
                    {loadingMessages[loadingMsg]}
                  </div>
                </div>

                <div className="jr-loading-table">
                  <InfoTable data={[
                    { label: 'Network', value: progress > 10 ? '● 接続済み' : '○ 接続中...', status: progress > 10 ? 'ok' : 'info' },
                    { label: 'SSL/TLS', value: progress > 25 ? '● 確立済み' : '○ ハンドシェイク中...', status: progress > 25 ? 'ok' : 'info' },
                    { label: 'Auth Server', value: progress > 40 ? '● 応答あり' : '○ 接続中...', status: progress > 40 ? 'ok' : 'info' },
                    { label: 'Session', value: progress > 55 ? '● 作成済み' : '○ 作成中...', status: progress > 55 ? 'ok' : 'info' },
                    { label: 'Modules', value: progress > 70 ? '● 読込完了' : '○ 読込中...', status: progress > 70 ? 'ok' : 'info' },
                    { label: 'UI Render', value: progress > 85 ? '● 準備完了' : '○ 描画中...', status: progress > 85 ? 'ok' : 'info' },
                  ]} />
                </div>

                <div className="jr-loading-notice">
                  <span className="jr-notice-icon">ℹ</span>
                  初回ログイン時は読み込みに時間がかかる場合があります。
                  しばらくお待ちください。
                </div>
              </div>
            </div>

            <div className="jr-panel secondary-panel">
              <div className="jr-panel-header small">推奨環境 / System Requirements</div>
              <div className="jr-panel-content compact">
                <div className="jr-requirements">
                  <span>Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+</span>
                  <span>|</span>
                  <span>JavaScript: 有効</span>
                  <span>|</span>
                  <span>Cookie: 有効</span>
                  <span>|</span>
                  <span>画面解像度: 1280x720以上</span>
                </div>
              </div>
            </div>
          </div>

          <div className="jr-sidebar-right">
            <div className="jr-box">
              <div className="jr-box-header orange">ご注意 / Important</div>
              <div className="jr-box-content warning">
                <p>● ログイン処理中は画面を閉じないでください。</p>
                <p>● ブラウザの戻るボタンを使用しないでください。</p>
                <p>● セッションは30分で自動的に切れます。</p>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">サーバー状況</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: 'Web', value: '● 正常', status: 'ok' },
                  { label: 'API', value: '● 正常', status: 'ok' },
                  { label: 'DB', value: '● 正常', status: 'ok' },
                  { label: 'Cache', value: '● 正常', status: 'ok' },
                ]} />
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">関連リンク</div>
              <div className="jr-box-content">
                <ul className="jr-link-list">
                  <li><a href="#">ヘルプセンター</a></li>
                  <li><a href="#">よくある質問</a></li>
                  <li><a href="#">お問い合わせ</a></li>
                  <li><a href="#">障害情報</a></li>
                  <li><a href="#">メンテナンス予定</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <JRFooter />
      </div>
      <EntryPopup />
      </>
    );
  }

  if (step === 'robot') {
    return (
      <>
      <div className="entry-screen robot-step">
        <JRHeader currentStep={step} />

        <div className="jr-content">
          <div className="jr-sidebar-left">
            <div className="jr-box">
              <div className="jr-box-header green">セキュリティ認証</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: '認証方式', value: 'reCAPTCHA v3' },
                  { label: '暗号化', value: 'AES-256-GCM', status: 'ok' },
                  { label: 'SSL/TLS', value: 'TLS 1.3', status: 'ok' },
                  { label: 'HSTS', value: '有効', status: 'ok' },
                  { label: 'CSP', value: '有効', status: 'ok' },
                ]} />
              </div>
            </div>

            <div className="jr-box fake-option-box" onClick={() => alert('この機能は現在メンテナンス中です。/ This feature is under maintenance.')}>
              <div className="jr-box-header">追加オプション</div>
              <div className="jr-box-content">
                <label className="jr-checkbox-label disabled">
                  <input type="checkbox" disabled />
                  <span>二段階認証をスキップ</span>
                </label>
                <label className="jr-checkbox-label disabled">
                  <input type="checkbox" disabled />
                  <span>このデバイスを記憶</span>
                </label>
                <label className="jr-checkbox-label disabled">
                  <input type="checkbox" disabled />
                  <span>シングルサインオン(SSO)</span>
                </label>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">認証ステータス</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: 'STEP1', value: '✓ 完了', status: 'ok' },
                  { label: 'STEP2', value: '● 進行中', status: 'info' },
                  { label: 'STEP3', value: '○ 待機中' },
                  { label: 'STEP4', value: '○ 待機中' },
                  { label: 'STEP5', value: '○ 待機中' },
                ]} />
              </div>
            </div>
          </div>

          <div className="jr-main-content">
            <div className="jr-breadcrumb">
              トップ &gt; エンタープライズポータル &gt; ログイン &gt; 本人確認
            </div>

            <div className="jr-panel">
              <div className="jr-panel-header">
                <span className="jr-panel-icon">●</span>
                本人確認 / Identity Verification
                <span className="jr-panel-badge required">必須</span>
              </div>
              <div className="jr-panel-content">
                <div className="jr-verification-notice">
                  <span className="jr-notice-icon">ℹ</span>
                  セキュリティのため、本人確認を行います。下記のチェックボックスをクリックしてください。
                  認証には数秒かかる場合があります。
                </div>

                {/* Fake captcha options - confusing */}
                <div className="jr-captcha-options">
                  <div className="jr-captcha-option disabled" onClick={() => alert('画像認証は現在利用できません。/ Image verification is unavailable.')}>
                    <input type="radio" name="captcha" disabled />
                    <span>画像認証 (Image CAPTCHA)</span>
                    <span className="jr-option-badge">メンテナンス中</span>
                  </div>
                  <div className="jr-captcha-option disabled" onClick={() => alert('音声認証は現在利用できません。/ Audio verification is unavailable.')}>
                    <input type="radio" name="captcha" disabled />
                    <span>音声認証 (Audio CAPTCHA)</span>
                    <span className="jr-option-badge">準備中</span>
                  </div>
                  <div className="jr-captcha-option active">
                    <input type="radio" name="captcha" checked readOnly />
                    <span>チェックボックス認証 (Checkbox)</span>
                    <span className="jr-option-badge green">推奨</span>
                  </div>
                </div>

                {/* Main robot check */}
                <div className="jr-captcha-box" onClick={handleRobotCheck}>
                  <div className={`jr-checkbox ${robotChecked ? 'checked' : ''}`}>
                    {robotChecked && <span>✓</span>}
                  </div>
                  <div className="jr-captcha-label">
                    <div className="jr-captcha-main">私はロボットではありません</div>
                    <div className="jr-captcha-sub">I am not a robot</div>
                  </div>
                  <div className="jr-captcha-logo">
                    <div className="jr-captcha-brand">SecureVerify™</div>
                    <div className="jr-captcha-brand-sub">Enterprise Edition</div>
                  </div>
                </div>

                {analyzing && (
                  <div className="jr-analyzing">
                    <div className="jr-spinner">◐</div>
                    <div className="jr-analyzing-text">
                      認証処理中... / Processing verification...
                    </div>
                    <div className="jr-analyzing-steps">
                      <div>● ブラウザフィンガープリント検証中...</div>
                      <div>● マウス動作パターン分析中...</div>
                      <div>● セッショントークン検証中...</div>
                      <div>● セキュリティレベル確認中...</div>
                      <div>● コンプライアンスステータス確認中...</div>
                      <div>● 地理的位置情報確認中...</div>
                    </div>
                    <div className="jr-analyzing-progress">
                      <div className="jr-mini-progress" />
                    </div>
                  </div>
                )}

                {robotChecked && !analyzing && (
                  <div className="jr-success-message">
                    <span className="jr-success-icon">✓</span>
                    本人確認が完了しました。次のステップに進みます。
                  </div>
                )}
              </div>
            </div>

            <div className="jr-panel secondary-panel">
              <div className="jr-panel-header small">
                予備認証（任意）/ Backup Verification (Optional)
              </div>
              <div className="jr-panel-content">
                <div className="jr-security-q">
                  <label>セキュリティの質問: {securityQuestion}</label>
                  <input type="text" placeholder="回答を入力（任意）/ Enter answer (optional)" disabled className="jr-input" />
                  <div className="jr-input-hint">※ この質問への回答は任意です。スキップできます。</div>
                </div>
              </div>
            </div>

            <div className="jr-panel secondary-panel">
              <div className="jr-panel-header small">追加セキュリティ設定</div>
              <div className="jr-panel-content">
                <label className="jr-checkbox-label disabled">
                  <input type="checkbox" disabled />
                  <span>生体認証を有効にする（指紋/顔認証）</span>
                </label>
                <label className="jr-checkbox-label disabled">
                  <input type="checkbox" disabled />
                  <span>ハードウェアキーを登録する（YubiKey等）</span>
                </label>
                <div className="jr-input-hint">※ 追加セキュリティ設定はログイン後に変更できます。</div>
              </div>
            </div>
          </div>

          <div className="jr-sidebar-right">
            <div className="jr-box">
              <div className="jr-box-header orange">ご注意事項</div>
              <div className="jr-box-content warning">
                <ul className="jr-warning-list">
                  <li>認証は必須です</li>
                  <li>10分以内に完了してください</li>
                  <li>ブラウザのCookieを有効にしてください</li>
                  <li>JavaScriptを有効にしてください</li>
                  <li>VPN使用時は認証に時間がかかる場合があります</li>
                </ul>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">セッション情報</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: 'Session ID', value: 'hc-' + Math.random().toString(36).substring(2, 8) },
                  { label: '有効期限', value: '09:58', status: 'warn' },
                  { label: 'IP', value: '192.168.xxx.xxx' },
                ]} />
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">お困りの場合</div>
              <div className="jr-box-content">
                <ul className="jr-link-list">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('サポートセンターに接続中...'); }}>サポートに問い合わせ</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('よくある質問を表示します。'); }}>FAQ</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('認証に関するヘルプ'); }}>認証ヘルプ</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('別の認証方法を試す'); }}>別の方法で認証</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <JRFooter />
      </div>
      <EntryPopup />
      </>
    );
  }

  if (step === 'login') {
    return (
      <>
      <div className="entry-screen login-step">
        <JRHeader currentStep={step} />

        <div className="jr-content">
          <div className="jr-sidebar-left">
            <div className="jr-box">
              <div className="jr-box-header green">ログイン情報</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: 'セッション', value: '有効', status: 'ok' },
                  { label: '暗号化', value: 'AES-256-GCM', status: 'ok' },
                  { label: 'タイムアウト', value: '30分' },
                  { label: '試行回数', value: '0/3', status: 'ok' },
                ]} />
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">ログイン方法</div>
              <div className="jr-box-content">
                <div className="jr-login-methods">
                  <div className="jr-login-method active">
                    <input type="radio" name="method" checked readOnly />
                    <span>社員ID + パスワード</span>
                  </div>
                  <div className="jr-login-method disabled" onClick={() => alert('SSO認証は現在利用できません。')}>
                    <input type="radio" name="method" disabled />
                    <span>シングルサインオン (SSO)</span>
                  </div>
                  <div className="jr-login-method disabled" onClick={() => alert('証明書認証は現在利用できません。')}>
                    <input type="radio" name="method" disabled />
                    <span>クライアント証明書</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">ヘルプ</div>
              <div className="jr-box-content">
                <ul className="jr-link-list">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('システム管理者にお問い合わせください。'); }}>パスワードを忘れた方</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('人事部で受け付けています。'); }}>アカウント申請</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('VPN接続が必要です。'); }}>外部ログイン</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('アカウントがロックされています。'); }}>アカウントロック解除</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="jr-main-content">
            <div className="jr-breadcrumb">
              トップ &gt; エンタープライズポータル &gt; ログイン &gt; 認証情報入力
            </div>

            <div className="jr-panel">
              <div className="jr-panel-header">
                <span className="jr-panel-icon">●</span>
                ログイン / Sign In
                <span className="jr-panel-badge required">必須項目</span>
              </div>
              <div className="jr-panel-content">
                {loginError && (
                  <div className="jr-error-message">
                    <span className="jr-error-icon">⚠</span>
                    {loginError}
                  </div>
                )}

                <div className="jr-login-form">
                  <div className="jr-form-row">
                    <label className="jr-form-label">
                      <span className="jr-required">*</span>
                      社員ID / Employee ID
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="jr-input"
                      placeholder="例: EMP-12345 または claude"
                    />
                    <div className="jr-input-hint">※ 社員IDは人事部から発行されたIDを入力してください</div>
                  </div>

                  <div className="jr-form-row">
                    <label className="jr-form-label">
                      <span className="jr-required">*</span>
                      パスワード / Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="jr-input"
                      placeholder="パスワードを入力"
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <div className="jr-input-hint">※ 8文字以上、大文字小文字数字を含む</div>
                  </div>

                  <div className="jr-form-row">
                    <label className="jr-form-label">部署コード（任意）</label>
                    <input
                      type="text"
                      className="jr-input"
                      placeholder="例: DEPT-001"
                      disabled
                    />
                    <div className="jr-input-hint">※ 部署コードは通常不要です</div>
                  </div>

                  <div className="jr-form-divider" />

                  {/* CAPTCHA Section */}
                  <div className="jr-captcha-section">
                    <div className="jr-captcha-header">
                      <span className="jr-required">*</span>
                      画像認証 / Image Verification
                      {captchaVerified && <span className="jr-captcha-verified">✓ 認証済み</span>}
                    </div>
                    <div className="jr-captcha-instruction">
                      下の画像から<strong>すべての電車・列車</strong>を選択してください。
                      <br />
                      <small>Select all images containing trains.</small>
                    </div>
                    <div className="jr-captcha-grid">
                      {captchaImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`jr-captcha-cell ${captchaSelections.includes(idx) ? 'selected' : ''} ${captchaVerified ? 'disabled' : ''}`}
                          onClick={() => toggleCaptchaSelection(idx)}
                        >
                          <span className="jr-captcha-emoji">{img.emoji}</span>
                          <span className="jr-captcha-label">{img.label}</span>
                          {captchaSelections.includes(idx) && <span className="jr-captcha-check">✓</span>}
                        </div>
                      ))}
                    </div>
                    {captchaError && (
                      <div className="jr-captcha-error">
                        <span className="jr-error-icon">⚠</span> {captchaError}
                      </div>
                    )}
                    {!captchaVerified && (
                      <button
                        type="button"
                        className="jr-btn secondary jr-captcha-verify-btn"
                        onClick={verifyCaptcha}
                        disabled={captchaSelections.length === 0}
                      >
                        認証する / Verify
                      </button>
                    )}
                    {captchaVerified && (
                      <div className="jr-captcha-success">
                        <span className="jr-success-icon">✓</span>
                        画像認証が完了しました。/ Image verification successful.
                      </div>
                    )}
                  </div>

                  <div className="jr-form-divider" />

                  <div className="jr-form-options">
                    <label className="jr-checkbox-label">
                      <input
                        type="checkbox"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                      />
                      <span><span className="jr-required">*</span> <a href="#" onClick={(e) => e.preventDefault()}>利用規約</a>に同意する</span>
                    </label>
                    <label className="jr-checkbox-label">
                      <input
                        type="checkbox"
                        checked={privacyChecked}
                        onChange={(e) => setPrivacyChecked(e.target.checked)}
                      />
                      <span><span className="jr-required">*</span> <a href="#" onClick={(e) => e.preventDefault()}>プライバシーポリシー</a>に同意する</span>
                    </label>
                    <label className="jr-checkbox-label">
                      <input type="checkbox" />
                      <span>ログイン状態を保持する（このデバイスのみ）</span>
                    </label>
                    <label className="jr-checkbox-label">
                      <input type="checkbox" />
                      <span>次回から自動ログインする</span>
                    </label>
                  </div>

                  <div className="jr-form-actions">
                    <button className="jr-btn primary" onClick={handleLogin}>
                      ログイン / Sign In
                    </button>
                    <button className="jr-btn secondary" onClick={() => { setUsername(''); setPassword(''); }}>
                      クリア / Clear
                    </button>
                    <button className="jr-btn secondary" onClick={() => alert('パスワードリセットページに移動します。')}>
                      パスワードを忘れた
                    </button>
                  </div>
                </div>

                <div className="jr-demo-hint">
                  <span className="jr-hint-icon">💡</span>
                  <div>
                    <strong>デモ用アカウント / Demo Account:</strong><br />
                    社員ID: <code>claude</code> / パスワード: <code>claude</code><br />
                    <small>※ 画像認証（電車を選択）、利用規約、プライバシーポリシーへの同意も必要です</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="jr-panel secondary-panel">
              <div className="jr-panel-header small">パスワードポリシー</div>
              <div className="jr-panel-content compact">
                <ul className="jr-policy-list">
                  <li>8文字以上であること</li>
                  <li>大文字・小文字・数字を含むこと</li>
                  <li>過去5回のパスワードと異なること</li>
                  <li>90日ごとに変更が必要</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="jr-sidebar-right">
            <div className="jr-box">
              <div className="jr-box-header orange">セキュリティ警告</div>
              <div className="jr-box-content warning">
                <ul className="jr-warning-list">
                  <li>許可された人員のみアクセス可能</li>
                  <li>すべての活動は監視・記録されています</li>
                  <li>不正アクセスは法的措置の対象</li>
                  <li>3回連続失敗でアカウントロック</li>
                  <li>30分間操作がないと自動ログアウト</li>
                </ul>
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header blue">接続情報</div>
              <div className="jr-box-content">
                <InfoTable data={[
                  { label: 'Protocol', value: 'HTTPS/2', status: 'ok' },
                  { label: 'TLS', value: '1.3', status: 'ok' },
                  { label: 'Certificate', value: '有効', status: 'ok' },
                  { label: 'Region', value: 'JP-TOKYO' },
                  { label: 'Server', value: 'hc-web-042' },
                ]} />
              </div>
            </div>

            <div className="jr-box">
              <div className="jr-box-header">最近のお知らせ</div>
              <div className="jr-box-content">
                <ul className="jr-notice-list compact">
                  <li><span className="jr-badge new">NEW</span> 新UI公開</li>
                  <li><span className="jr-badge">重要</span> セキュリティ更新</li>
                  <li>メンテナンス完了</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <JRFooter />
      </div>
      <EntryPopup />
      </>
    );
  }

  // Complete - brief transition
  return (
    <>
      <div className="entry-screen complete-step">
        <div className="jr-complete-box">
          <div className="jr-complete-header">
            <span className="jr-complete-icon">✓</span>
          </div>
          <div className="jr-complete-body">
            <div className="jr-complete-title">認証完了 / Authentication Successful</div>
            <div className="jr-complete-message">
              ワークスペースに移動しています...<br />
              Redirecting to your workspace...
            </div>
            <div className="jr-complete-details">
              <div>Session ID: hc-{Math.random().toString(36).substring(2, 10)}</div>
              <div>Login Time: {new Date().toLocaleString('ja-JP')}</div>
            </div>
            <div className="jr-complete-spinner">
              <span>●</span><span>●</span><span>●</span>
            </div>
          </div>
        </div>
      </div>
      <EntryPopup />
    </>
  );
}
