'use client';

import { announcements } from '@/lib/utils';

export default function Announcements() {
  return (
    <div className="widget announcements">
      <div className="widget-title">
        <span className="blink">!</span> Announcements <span className="badge badge-new">NEW</span>
      </div>
      <div className="announcements-scroll">
        {announcements.map((announcement, i) => (
          <div key={i} className="announcement-item">
            <span className="announcement-bullet">▶</span>
            {announcement}
          </div>
        ))}
      </div>
    </div>
  );
}
