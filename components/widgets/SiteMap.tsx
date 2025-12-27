'use client';

import { siteMapLinks } from '@/lib/utils';

export default function SiteMap() {
  return (
    <div className="widget site-map">
      <div className="widget-title">Site Map</div>
      <div className="site-map-links">
        {siteMapLinks.map((link, i) => (
          <span key={i}>
            <a href={link.href} className="site-map-link">
              {link.name}
            </a>
            {i < siteMapLinks.length - 1 && <span className="site-map-separator">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
