'use client';

import { ChatSettings } from '@/lib/types';
import SlotMachineSelector from './SlotMachineSelector';

interface SystemControlsProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClearCache: () => void;
}

export default function SystemControls({
  settings,
  onSettingsChange,
  onClearCache,
}: SystemControlsProps) {
  return (
    <div className="system-controls">
      <div className="controls-header">
        <span className="sparkle">⚙</span> Settings Panel <span className="sparkle">⚙</span>
      </div>

      <div className="controls-grid">
        <div className="control-group slot-machine-group">
          <SlotMachineSelector
            value={settings.model}
            onChange={(model) => onSettingsChange({ ...settings, model })}
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span className="label-icon">🌡️</span>
            Temperature: {settings.temperature.toFixed(1)}
          </label>
          <input
            type="range"
            className="temperature-slider"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) =>
              onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })
            }
          />
          <div className="slider-labels">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="control-group">
          <button className="clear-cache-btn" onClick={onClearCache}>
            <span className="btn-icon">🗑️</span>
            Clear Cache
          </button>
          <div className="control-warning">
            * All history will be deleted
          </div>
        </div>
      </div>

      <div className="controls-footer">
        <table className="controls-info-table">
          <tbody>
            <tr>
              <td>API</td>
              <td className="status-ok">✓ Connected</td>
            </tr>
            <tr>
              <td>Version</td>
              <td>v2003.12.25</td>
            </tr>
            <tr>
              <td>Status</td>
              <td className="status-ok blink">● ONLINE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
