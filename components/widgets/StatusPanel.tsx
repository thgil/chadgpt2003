'use client';

import { useState, useEffect } from 'react';
import { getFakeStats } from '@/lib/utils';

export default function StatusPanel() {
  const [stats, setStats] = useState(getFakeStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getFakeStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="widget status-panel">
      <div className="widget-title">
        <span className="blink">●</span> System Status
      </div>
      <table className="status-table">
        <tbody>
          <tr>
            <td className="status-label">CPU</td>
            <td className="status-value">
              <div className="status-bar">
                <div className="status-bar-fill cpu" style={{ width: `${stats.cpu}%` }}></div>
              </div>
              <span className="status-percent">{stats.cpu}%</span>
            </td>
          </tr>
          <tr>
            <td className="status-label">RAM</td>
            <td className="status-value">
              <div className="status-bar">
                <div className="status-bar-fill ram" style={{ width: `${stats.ram}%` }}></div>
              </div>
              <span className="status-percent">{stats.ram}%</span>
            </td>
          </tr>
          <tr>
            <td className="status-label">NET</td>
            <td className="status-value">
              <div className="status-bar">
                <div className="status-bar-fill net" style={{ width: `${stats.network}%` }}></div>
              </div>
              <span className="status-percent">{stats.network}kb/s</span>
            </td>
          </tr>
          <tr>
            <td className="status-label">Uptime</td>
            <td className="status-value status-uptime">{stats.uptime}</td>
          </tr>
        </tbody>
      </table>
      <div className="status-footer">
        <span>Users: <strong>{stats.users}</strong></span>
        <span>Messages: <strong>{stats.messages.toLocaleString()}</strong></span>
      </div>
    </div>
  );
}
