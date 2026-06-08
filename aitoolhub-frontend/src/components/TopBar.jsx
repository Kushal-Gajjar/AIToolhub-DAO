import React from 'react';

export default function TopBar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>☰</button>
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <div className="notif-btn"><span>🔔</span><span className="notif-badge">3</span></div>
        <div className="avatar">AK</div>
      </div>
    </header>
  );
}
