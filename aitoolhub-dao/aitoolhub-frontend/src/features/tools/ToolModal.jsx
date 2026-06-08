import React from 'react';

export default function ToolModal({ toolId, onClose }) {
  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div id="toolModalContent">
          <div className="modal-title">Tool: {toolId}</div>
          <div className="modal-desc">This tool is powered by Claude AI via the Anthropic API.</div>
        </div>
      </div>
    </div>
  );
}
