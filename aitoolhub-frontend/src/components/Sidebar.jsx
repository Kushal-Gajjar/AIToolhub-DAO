import React from 'react';

const navLinks = [
  { page: 'dashboard', icon: '◈', label: 'Dashboard' },
  { page: 'tools',     icon: '⬢', label: 'AI Tools' },
  { page: 'governance',icon: '◉', label: 'Governance' },
  { page: 'treasury',  icon: '◈', label: 'Treasury' },
  { page: 'profile',   icon: '○', label: 'Profile' },
];

export default function Sidebar({ activePage, onNavigate, aitBalance }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⬡</div>
        <span className="logo-text">AIToolHub <em>DAO</em></span>
      </div>
      <div className="sidebar-token-card">
        <div className="token-label">AIT Balance</div>
        <div className="token-amount">{aitBalance.toLocaleString()} <span>AIT</span></div>
        <div className="token-sub">Voting Power: {aitBalance.toLocaleString()}</div>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map(link => (
          <a
            key={link.page}
            href="#"
            className={`nav-item${activePage === link.page ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); onNavigate(link.page); }}
          >
            <span className="nav-icon">{link.icon}</span> {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
