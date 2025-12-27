'use client';

import { useState, useEffect } from 'react';
import { getTodaysFortune, Fortune as FortuneType } from '@/lib/fortune';

export default function Fortune() {
  const [fortune, setFortune] = useState<FortuneType | null>(null);

  useEffect(() => {
    setFortune(getTodaysFortune());
  }, []);

  if (!fortune) return null;

  return (
    <div className="widget fortune-widget">
      <div className="widget-title">
        <span className="sparkle">☆</span> Today's Fortune <span className="sparkle">☆</span>
      </div>
      <div className="fortune-luck" style={{ color: fortune.color }}>
        【{fortune.luck}】
      </div>
      <div className="fortune-message">{fortune.message}</div>
      <table className="fortune-details">
        <tbody>
          <tr>
            <td className="fortune-label">Lucky Item</td>
            <td className="fortune-value">{fortune.luckyItem}</td>
          </tr>
          <tr>
            <td className="fortune-label">Lucky Direction</td>
            <td className="fortune-value">{fortune.luckyDirection}</td>
          </tr>
          <tr>
            <td className="fortune-label">Lucky Color</td>
            <td className="fortune-value">{fortune.luckyColor}</td>
          </tr>
          <tr>
            <td className="fortune-label">Lucky Number</td>
            <td className="fortune-value">{fortune.luckyNumber}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
