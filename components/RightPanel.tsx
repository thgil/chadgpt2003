'use client';

import VisitorCounter from './widgets/VisitorCounter';
import Fortune from './widgets/Fortune';
import TagCloud from './widgets/TagCloud';
import FakeAds from './widgets/FakeAds';
import Announcements from './widgets/Announcements';
import SiteMap from './widgets/SiteMap';
import Rankings from './widgets/Rankings';
import StatusPanel from './widgets/StatusPanel';

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="panel-header">
        <span className="blink">▶</span> INFO / ADS <span className="blink">◀</span>
      </div>

      <VisitorCounter />

      <div className="panel-divider">
        <span>- - - - - - - -</span>
      </div>

      <Fortune />

      <div className="panel-divider">
        <span>★ ★ ★ ★ ★</span>
      </div>

      <StatusPanel />

      <FakeAds />

      <div className="panel-divider">
        <span>◆ ◇ ◆ ◇ ◆</span>
      </div>

      <TagCloud />

      <Announcements />

      <div className="panel-divider">
        <span>═════════</span>
      </div>

      <Rankings />

      <SiteMap />

      <div className="panel-footer">
        <div className="panel-ascii">
          ┌─────────┐<br />
          │ (◕‿◕) │<br />
          │ ADS WANTED │<br />
          └─────────┘
        </div>
        <div className="powered-by">
          Powered by<br />
          <span className="rainbow-text">Hyper Chat 2003</span>
        </div>
      </div>

      <div className="warning-box">
        <span className="warning-icon blink">⚠</span>
        <span className="warning-text">
          WARNING: This site is<br />
          NOT easy on the eyes
        </span>
      </div>
    </aside>
  );
}
