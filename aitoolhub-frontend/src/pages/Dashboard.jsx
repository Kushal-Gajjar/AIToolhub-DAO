import React from 'react';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="page active" id="page-dashboard">
      <div className="stats-grid">
        {[
          { icon: '◈', val: '12', label: 'AI Tools Live', trend: '+2 this month', bg: '#0d1f3c' },
          { icon: '◉', val: '5',  label: 'Active Proposals', trend: '2 ending soon', bg: '#1a0d2e' },
          { icon: '⬢', val: '48.2K', label: 'AIT in Treasury', trend: '+1.2K this week', bg: '#0d2a1a' },
          { icon: '○', val: '342', label: 'DAO Members', trend: '+18 new', bg: '#2a1a0d' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-body">
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <div className="stat-trend up">{s.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
