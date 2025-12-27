'use client';

import { rankings, recommendedLinks } from '@/lib/utils';

export default function Rankings() {
  return (
    <div className="widget rankings">
      <div className="widget-title">
        <span className="sparkle">★</span> AI Rankings <span className="sparkle">★</span>
      </div>
      <table className="ranking-table">
        <tbody>
          {rankings.map((item) => (
            <tr key={item.rank} className="ranking-row">
              <td className={`ranking-number rank-${item.rank}`}>{item.rank}</td>
              <td className="ranking-name">{item.name}</td>
              <td className={`ranking-change ${item.change === '↑' ? 'up' : item.change === '↓' ? 'down' : ''}`}>
                {item.change === 'NEW' ? <span className="badge badge-new">NEW</span> : item.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="widget-title" style={{ marginTop: '10px' }}>
        Recommended Links
      </div>
      <ul className="recommended-links">
        {recommendedLinks.map((link, i) => (
          <li key={i} className="recommended-link">
            <a href="#">
              {link.name}
              {link.badge && (
                <span className={`badge badge-${link.badge === 'HOT' ? 'hot' : link.badge === 'NEW' ? 'new' : 'rec'}`}>
                  {link.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
