import React, { useState } from 'react';

const tools = [
  { id: 'ocr',         phase: 'phase1', name: 'OCR Text Extractor',    meta: '1.2K uses · Image→Text', status: 'live' },
  { id: 'summarizer',  phase: 'phase1', name: 'Text Summarizer',        meta: '890 uses · NLP',         status: 'live' },
  { id: 'grammar',     phase: 'phase1', name: 'Grammar Checker',        meta: '640 uses · Writing',     status: 'live' },
  { id: 'resume',      phase: 'phase2', name: 'Resume Analyzer',        meta: '430 uses · Career AI',   status: 'live' },
  { id: 'chatbot',     phase: 'phase2', name: 'Chatbot Builder',        meta: '210 uses · NLP',         status: 'live' },
  { id: 'voice',       phase: 'phase3', name: 'Voice Emotion Detector', meta: 'NEW · Audio Analysis',   status: 'new'  },
  { id: 'personality', phase: 'phase3', name: 'Personality AI',         meta: 'NEW · Psychology AI',    status: 'new'  },
];

export default function Tools({ onOpenTool }) {
  const [filter, setFilter] = useState('all');
  const filtered = tools.filter(t => filter === 'all' || t.phase === filter);

  return (
    <div className="page active" id="page-tools">
      <div className="filter-bar">
        {['all','phase1','phase2','phase3'].map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            data-filter={f}
            onClick={() => setFilter(f)}
          >{f === 'all' ? 'All' : `Phase ${f.slice(-1)}`}</button>
        ))}
      </div>
      <div className="tools-grid">
        {filtered.map(tool => (
          <div
            key={tool.id}
            className="tool-card"
            data-phase={tool.phase}
            onClick={() => onOpenTool(tool.id)}
          >
            <div className={`tool-badge ${tool.phase}`}>{tool.phase.replace('phase','P')}</div>
            <div className="tool-name">{tool.name}</div>
            <div className="tool-meta">{tool.meta}</div>
            <div className={`tool-status ${tool.status}`}>{tool.status === 'live' ? 'Live' : 'New'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
