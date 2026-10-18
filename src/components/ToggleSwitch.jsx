import React from 'react';

const ToggleSwitch = ({ checked, onChange, label = 'Add to Notification' }) => (
  <label className="notify-toggle" onClick={(e) => e.stopPropagation()}>
    <span className="notify-toggle-label">{label}</span>
    <input
      type="checkbox"
      checked={Boolean(checked)}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="notify-toggle-track">
      <span className="notify-toggle-thumb" />
    </span>
    <style>{`
      .notify-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        cursor: pointer;
        user-select: none;
        margin: 0;
        min-height: 38px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      .notify-toggle-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted, #94a3b8);
        transition: color 0.2s ease;
      }
      .notify-toggle:hover .notify-toggle-label {
        color: var(--text-main, #f8fafc);
      }
      .notify-toggle input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        margin: 0;
      }
      .notify-toggle-track {
        position: relative;
        display: inline-block;
        width: 38px;
        height: 22px;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
      }
      .notify-toggle input:checked + .notify-toggle-track {
        background: #10b981;
        border-color: #059669;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.35);
      }
      .notify-toggle input:focus-visible + .notify-toggle-track {
        outline: 2px solid var(--primary, #6366f1);
        outline-offset: 2px;
      }
      .notify-toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .notify-toggle input:checked + .notify-toggle-track .notify-toggle-thumb {
        transform: translateX(16px);
      }
    `}</style>
  </label>
);

export default ToggleSwitch;
