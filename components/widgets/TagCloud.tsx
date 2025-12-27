'use client';

import { hotKeywords } from '@/lib/utils';

export default function TagCloud() {
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff6600', '#ff0099'];

  return (
    <div className="widget tag-cloud">
      <div className="widget-title">
        <span className="blink">♨</span> Trending Words <span className="badge badge-hot">HOT</span>
      </div>
      <div className="tag-cloud-container">
        {hotKeywords.map((keyword, i) => (
          <span
            key={i}
            className="tag"
            style={{
              fontSize: `${10 + keyword.weight * 3}px`,
              color: colors[i % colors.length],
            }}
          >
            {keyword.text}
          </span>
        ))}
      </div>
    </div>
  );
}
