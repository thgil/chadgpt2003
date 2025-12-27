'use client';

import { useState, useEffect } from 'react';
import { getVisitorCount } from '@/lib/utils';

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getVisitorCount());
  }, []);

  const digits = count.toString().padStart(8, '0').split('');

  return (
    <div className="widget visitor-counter">
      <div className="widget-title">
        <span className="blink">★</span> Access Counter <span className="blink">★</span>
      </div>
      <div className="counter-display">
        {digits.map((digit, i) => (
          <span key={i} className="counter-digit">{digit}</span>
        ))}
      </div>
      <div className="counter-label">You are visitor #{count}!</div>
      <div className="counter-since">since 2003.04.01</div>
    </div>
  );
}
