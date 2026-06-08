import React from 'react';
import { timeUntil } from '../../utils/formatters';

export default function ProposalCard({ proposal, onVote, onOpen }) {
  const pct = proposal.weightFor + proposal.weightAgainst > 0
    ? Math.round((proposal.weightFor / (proposal.weightFor + proposal.weightAgainst)) * 100) : 0;

  return (
    <div className="proposal-card" onClick={() => onOpen(proposal.id)}>
      <div className="pc-top">
        <span className="pc-id">#{proposal.id}</span>
        <span className="pc-tag">{proposal.category}</span>
        <span className={`pc-status ${proposal.status.toLowerCase()}-status`}>{proposal.status}</span>
      </div>
      <div className="pc-title">{proposal.title}</div>
      <div className="pc-desc">{proposal.description.slice(0, 120)}...</div>
      <div className="pc-votes">
        <div className="pv-for">
          <div className="pv-bar"><div className="pv-fill for-fill" style={{ width: `${pct}%` }}></div></div>
          <div className="pv-num">{pct}%</div>
        </div>
      </div>
      <div className="pc-footer">
        <span>Ends {timeUntil(proposal.votingEndsAt)}</span>
        <div className="pc-btns">
          <button className="vote-for-btn" onClick={e => { e.stopPropagation(); onVote(proposal.id, true); }}>Vote For</button>
          <button className="vote-against-btn" onClick={e => { e.stopPropagation(); onVote(proposal.id, false); }}>Vote Against</button>
        </div>
      </div>
    </div>
  );
}
