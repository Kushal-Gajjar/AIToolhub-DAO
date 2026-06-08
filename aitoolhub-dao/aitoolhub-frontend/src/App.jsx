import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import Governance from './pages/Governance';
import Treasury from './pages/Treasury';
import Profile from './pages/Profile';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  tools: 'AI Tools',
  governance: 'Governance',
  treasury: 'Treasury',
  profile: 'My Profile',
};

const DEFAULT_USER = {
  initials: 'AK',
  name: 'Aryan Kumar',
  wallet: '0x4f3a...8d2c',
  role: 'Builder + Voter',
  aitBalance: 2450,
  votesCast: 14,
  proposals: 3,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard onNavigate={setPage} />;
      case 'tools':      return <Tools onOpenTool={(id) => console.log('open tool', id)} />;
      case 'governance': return <Governance onCastVote={() => {}} onOpenProposal={() => {}} onNewProposal={() => {}} />;
      case 'treasury':   return <Treasury />;
      case 'profile':    return <Profile user={DEFAULT_USER} />;
      default:           return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div id="app">
      <Sidebar
        activePage={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false); }}
        aitBalance={DEFAULT_USER.aitBalance}
      />
      <main className="main-content">
        <TopBar title={PAGE_TITLES[page]} onMenuClick={() => setSidebarOpen(v => !v)} />
        {renderPage()}
      </main>
    </div>
  );
}
