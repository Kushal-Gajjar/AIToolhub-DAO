import React from 'react';

export default function Governance({ onCastVote, onOpenProposal, onNewProposal }) {
  return (
    <div className="page active" id="page-governance">
      <div className="page-intro">
        <h1 className="page-heading">Governance</h1>
        <p className="page-sub">Vote on proposals that shape the future of AIToolHub DAO.</p>
        <button className="run-btn" onClick={onNewProposal}>+ New Proposal</button>
      </div>
    </div>
  );
}
