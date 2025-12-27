'use client';

export default function FakeAds() {
  const ads = [
    {
      title: '★CHEAP★ AI Server',
      subtitle: 'From $9.99/mo',
      badge: 'LIMITED',
      color: '#ff00ff',
    },
    {
      title: 'Start FREE!',
      subtitle: 'Coding Bootcamp',
      badge: 'NEW',
      color: '#00ffff',
    },
    {
      title: '【AD】Mystery Service',
      subtitle: 'Click for details→',
      badge: 'AD',
      color: '#ffff00',
    },
  ];

  return (
    <div className="fake-ads-container">
      {ads.map((ad, i) => (
        <div
          key={i}
          className="fake-ad"
          style={{ borderColor: ad.color }}
          onClick={() => alert('This is not a real ad!')}
        >
          <div className="fake-ad-badge" style={{ backgroundColor: ad.color }}>
            {ad.badge}
          </div>
          <div className="fake-ad-title">{ad.title}</div>
          <div className="fake-ad-subtitle">{ad.subtitle}</div>
          <div className="fake-ad-click blink">▶ Click!</div>
        </div>
      ))}
    </div>
  );
}
