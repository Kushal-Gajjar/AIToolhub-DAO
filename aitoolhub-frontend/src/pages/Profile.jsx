import React from 'react';

export default function Profile({ user }) {
  return (
    <div className="page active" id="page-profile">
      <div className="page-intro">
        <h1 className="page-heading">My Profile</h1>
      </div>
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">{user.initials}</div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-wallet">{user.wallet}</div>
          <div className="profile-role-badge">{user.role}</div>
          <div className="profile-stats-row">
            <div className="ps-item"><div className="ps-val">{user.aitBalance.toLocaleString()}</div><div className="ps-label">AIT Balance</div></div>
            <div className="ps-item"><div className="ps-val">{user.votesCast}</div><div className="ps-label">Votes Cast</div></div>
            <div className="ps-item"><div className="ps-val">{user.proposals}</div><div className="ps-label">Proposals</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
