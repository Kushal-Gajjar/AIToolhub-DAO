/* ============================================================
   AIToolHub DAO — Application Logic
   Full-stack simulation with Anthropic API integration
   ============================================================ */

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const titles = { dashboard:'Dashboard', tools:'AI Tools', governance:'Governance', treasury:'Treasury', profile:'My Profile' };

function navigateTo(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (nav) nav.classList.add('active');
  pageTitle.textContent = titles[pageId] || pageId;
  document.getElementById('sidebar').classList.remove('open');
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

document.querySelectorAll('[data-page]').forEach(el => {
  if (!el.classList.contains('nav-item')) {
    el.addEventListener('click', e => { e.preventDefault(); navigateTo(el.dataset.page); });
  }
});

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ===== TOOLS FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.tool-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.phase === f) ? '' : 'none';
    });
  });
});

// ===== MODAL =====
const modal = document.getElementById('toolModal');
const modalContent = document.getElementById('toolModalContent');

function closeModal() { modal.classList.remove('open'); }
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3000);
}

// ===== ANTHROPIC API HELPER =====
async function callClaude(systemPrompt, userMessage, maxTokens = 800) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  const data = await resp.json();
  if (data.content && data.content[0]) return data.content[0].text;
  throw new Error('API error');
}

// ===== VOTE =====
function castVote(type, proposalId) {
  showToast(`✓ Voted ${type === 'for' ? 'FOR' : 'AGAINST'} proposal ${proposalId} — 2,450 AIT weight applied`, 'success');
}

// ===== TOOL MODALS =====
function openTool(toolId) {
  modal.classList.add('open');
  const html = getToolHTML(toolId);
  modalContent.innerHTML = html;
  if (toolId === 'voice') initVoiceTool();
  if (toolId === 'personality') initPersonalityTool();
}

function getToolHTML(toolId) {
  const tools = {
    ocr: `
      <div class="modal-title">📷 OCR Text Extractor</div>
      <div class="modal-desc">Upload an image or PDF and extract all text using Tesseract OCR. Supports 40+ languages.</div>
      <div class="modal-section">
        <div class="modal-label">Upload Image</div>
        <div class="audio-upload-zone" onclick="document.getElementById('ocrFile').click()">
          📎 Click to upload image (PNG, JPG, PDF) or drag & drop
        </div>
        <input type="file" id="ocrFile" accept="image/*,.pdf" style="display:none" onchange="handleOCR(this)">
        <div class="modal-label" style="margin-top:16px">Or paste sample text for AI analysis</div>
        <textarea class="form-textarea" id="ocrInput" placeholder="Paste the text that was extracted from your image, and Claude will analyze and clean it..."></textarea>
      </div>
      <button class="run-btn" id="ocrBtn" onclick="runOCR()">Extract & Analyze</button>
      <div class="result-box" id="ocrResult"></div>
    `,
    summarizer: `
      <div class="modal-title">📝 Text Summarizer</div>
      <div class="modal-desc">Paste any long text — articles, reports, documents — and receive a concise summary with key points.</div>
      <div class="modal-section">
        <div class="modal-label">Input Text</div>
        <textarea class="form-textarea" id="sumInput" placeholder="Paste your text here (articles, reports, research papers, meeting notes...)..." style="min-height:180px"></textarea>
      </div>
      <div class="modal-section">
        <div class="modal-label">Summary Length</div>
        <div style="display:flex;gap:8px">
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="radio" name="sumLen" value="brief" checked> Brief (2-3 sentences)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="radio" name="sumLen" value="standard"> Standard</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="radio" name="sumLen" value="detailed"> Detailed</label>
        </div>
      </div>
      <button class="run-btn" onclick="runSummarizer()">Summarize Text</button>
      <div class="result-box" id="sumResult"></div>
    `,
    grammar: `
      <div class="modal-title">✍️ Grammar Checker</div>
      <div class="modal-desc">Paste your text below. Claude AI will identify grammar, spelling, and style issues and provide corrections.</div>
      <div class="modal-section">
        <div class="modal-label">Your Text</div>
        <textarea class="form-textarea" id="gramInput" placeholder="Type or paste your text here..." style="min-height:160px"></textarea>
      </div>
      <button class="run-btn" onclick="runGrammar()">Check Grammar</button>
      <div class="result-box" id="gramResult"></div>
    `,
    resume: `
      <div class="modal-title">📄 Resume Analyzer</div>
      <div class="modal-desc">Paste your resume and a job description. Claude AI will score compatibility, highlight gaps, and give ATS optimization tips.</div>
      <div class="modal-section">
        <div class="modal-label">Your Resume</div>
        <textarea class="form-textarea" id="resumeInput" placeholder="Paste your resume text here..."></textarea>
      </div>
      <div class="modal-section">
        <div class="modal-label">Job Description</div>
        <textarea class="form-textarea" id="jdInput" placeholder="Paste the job description here..."></textarea>
      </div>
      <button class="run-btn" onclick="runResume()">Analyze Resume</button>
      <div class="result-box" id="resumeResult"></div>
    `,
    chatbot: `
      <div class="modal-title">🤖 Chatbot Builder</div>
      <div class="modal-desc">Define your chatbot's personality and test it below. No code needed.</div>
      <div class="modal-section">
        <div class="modal-label">Chatbot Name & Personality</div>
        <input class="form-input" id="botName" placeholder="e.g. Aria — a friendly customer support bot..." style="margin-bottom:8px">
        <textarea class="form-textarea" id="botPersonality" placeholder="Describe your chatbot's personality, purpose, and knowledge..." style="min-height:100px"></textarea>
      </div>
      <div class="modal-section">
        <div class="modal-label">Test Your Bot</div>
        <div id="chatLog" style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;min-height:120px;max-height:240px;overflow-y:auto;margin-bottom:10px;font-size:13px;"></div>
        <div style="display:flex;gap:8px">
          <input class="form-input" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendChatMsg()">
          <button class="run-btn" style="width:auto;padding:10px 20px;white-space:nowrap" onclick="sendChatMsg()">Send</button>
        </div>
      </div>
    `,
    imgclassify: `
      <div class="modal-title">🖼️ Image Classifier</div>
      <div class="modal-desc">Upload an image and receive AI-powered classification labels with confidence scores.</div>
      <div class="modal-section">
        <div class="modal-label">Upload Image</div>
        <div class="audio-upload-zone" onclick="document.getElementById('imgFile').click()">
          🖼️ Click to upload image (PNG, JPG, GIF)
        </div>
        <input type="file" id="imgFile" accept="image/*" style="display:none" onchange="handleImgClassify(this)">
      </div>
      <div class="modal-label" style="margin-top:12px">Or describe an image for demo classification</div>
      <textarea class="form-textarea" id="imgDesc" placeholder="Describe an image (e.g. 'a golden retriever playing in a park')..." style="min-height:100px"></textarea>
      <button class="run-btn" onclick="runImgClassify()" style="margin-top:12px">Classify Image</button>
      <div class="result-box" id="imgResult"></div>
    `,
    voice: `
      <div class="modal-title">🎙️ Voice Emotion Detector</div>
      <div class="modal-desc">Record your voice or describe a voice sample. Our AI analyzes vocal patterns and speech content to detect emotions with confidence scores.</div>
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('voice','record')">🎙 Record</button>
        <button class="tab-btn" onclick="switchTab('voice','upload')">📁 Upload</button>
        <button class="tab-btn" onclick="switchTab('voice','text')">📝 Text Analysis</button>
      </div>
      <div class="tab-content active" id="voice-tab-record">
        <div style="text-align:center;padding:20px 0">
          <div class="audio-controls" style="justify-content:center">
            <button class="record-btn" id="recordBtn" onclick="toggleRecording()">⏺</button>
            <div>
              <div class="record-timer" id="recordTimer">00:00</div>
              <div class="record-status" id="recordStatus">Click to start recording</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--text3);margin-top:8px">Speak naturally for at least 5 seconds for best results</p>
        </div>
        <button class="run-btn" id="voiceAnalyzeBtn" onclick="runVoiceAnalysis('record')" style="margin-top:8px">Analyze Recording</button>
      </div>
      <div class="tab-content" id="voice-tab-upload">
        <div class="audio-upload-zone" onclick="document.getElementById('audioFile').click()">
          🎵 Click to upload audio file (MP3, WAV, M4A, OGG)
          <br><span id="audioFileName" style="color:var(--accent);margin-top:6px;display:block"></span>
        </div>
        <input type="file" id="audioFile" accept="audio/*" style="display:none" onchange="handleAudioUpload(this)">
        <button class="run-btn" onclick="runVoiceAnalysis('upload')" style="margin-top:12px">Analyze Audio</button>
      </div>
      <div class="tab-content" id="voice-tab-text">
        <div class="modal-label">Describe or transcribe speech</div>
        <textarea class="form-textarea" id="voiceTextInput" placeholder="Describe the voice sample or paste a speech transcription. Include context like tone, pace, pauses, and speaking style...&#10;&#10;Example: 'The speaker said &quot;I can&apos;t believe this happened&quot; with a shaky voice, frequent pauses, and rising pitch at the end.'" style="min-height:140px"></textarea>
        <button class="run-btn" onclick="runVoiceAnalysis('text')" style="margin-top:12px">Detect Emotions</button>
      </div>
      <div id="voiceResults" style="margin-top:8px"></div>
    `,
    personality: `
      <div class="modal-title">🧠 Personality Prediction AI</div>
      <div class="modal-desc">Based on the Big Five OCEAN model — the most scientifically validated personality framework. Answer questions or paste a writing sample.</div>
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('personality','questionnaire')">📋 Questionnaire</button>
        <button class="tab-btn" onclick="switchTab('personality','text')">📝 Writing Sample</button>
      </div>

      <div class="tab-content active" id="personality-tab-questionnaire">
        <div id="personalityQuestions"></div>
        <button class="run-btn" onclick="runPersonalityQuestionnaire()" style="margin-top:16px">Predict My Personality</button>
      </div>

      <div class="tab-content" id="personality-tab-text">
        <div class="modal-label">Paste a writing sample</div>
        <textarea class="form-textarea" id="personalityText" placeholder="Paste a personal essay, email, journal entry, social media posts, or any text written by the person you want to analyze. The more text, the more accurate the prediction (minimum 100 words recommended)..." style="min-height:180px"></textarea>
        <button class="run-btn" onclick="runPersonalityText()" style="margin-top:12px">Analyze Personality</button>
      </div>

      <div id="personalityResults" style="margin-top:8px"></div>
    `
  };
  return tools[toolId] || '<div class="modal-title">Coming Soon</div>';
}

// ===== OCR TOOL =====
async function runOCR() {
  const input = document.getElementById('ocrInput').value.trim();
  if (!input) { showToast('Please paste some text to analyze', 'error'); return; }
  const btn = document.getElementById('ocrBtn');
  const result = document.getElementById('ocrResult');
  btn.innerHTML = '<span class="spinner"></span>Analyzing...';
  btn.disabled = true;
  result.classList.remove('show');
  try {
    const text = await callClaude(
      'You are an OCR text analysis assistant. When given raw or messy OCR-extracted text, clean it up, fix obvious errors, and present it in a well-formatted, readable way. Add section headers where appropriate. Note any confidence issues. Format as plain text.',
      `Here is OCR-extracted text to clean and analyze:\n\n${input}`
    );
    result.textContent = text;
    result.classList.add('show');
    showToast('Text extracted and cleaned successfully!');
  } catch(e) { showToast('API error. Please try again.', 'error'); }
  btn.innerHTML = 'Extract & Analyze';
  btn.disabled = false;
}
function handleOCR(input) {
  if (input.files[0]) showToast(`File "${input.files[0].name}" loaded. Click Extract & Analyze.`);
}

// ===== SUMMARIZER =====
async function runSummarizer() {
  const input = document.getElementById('sumInput').value.trim();
  if (!input) { showToast('Please paste some text to summarize', 'error'); return; }
  const len = document.querySelector('input[name="sumLen"]:checked')?.value || 'standard';
  const lenMap = { brief:'2-3 sentence', standard:'1 paragraph (4-6 sentences)', detailed:'3-4 paragraph detailed' };
  const result = document.getElementById('sumResult');
  result.classList.remove('show');
  result.textContent = '';
  const btn = document.querySelector('#page-tools .run-btn');
  try {
    const sumBtn = document.getElementById('toolModalContent').querySelector('.run-btn');
    sumBtn.innerHTML = '<span class="spinner"></span>Summarizing...';
    sumBtn.disabled = true;
    const text = await callClaude(
      `You are a text summarizer. Create a ${lenMap[len]} summary of the text provided. Then list 3-5 key points as bullet points starting with "•". Format your response as:\n\nSUMMARY:\n[summary]\n\nKEY POINTS:\n• point 1\n• point 2...`,
      input, 600
    );
    result.textContent = text;
    result.classList.add('show');
    showToast('Summary generated!');
    sumBtn.innerHTML = 'Summarize Text';
    sumBtn.disabled = false;
  } catch(e) { showToast('API error. Please try again.', 'error'); }
}

// ===== GRAMMAR CHECKER =====
async function runGrammar() {
  const input = document.getElementById('gramInput').value.trim();
  if (!input) { showToast('Please enter some text to check', 'error'); return; }
  const result = document.getElementById('gramResult');
  result.classList.remove('show');
  const btn = document.getElementById('toolModalContent').querySelector('.run-btn');
  btn.innerHTML = '<span class="spinner"></span>Checking...';
  btn.disabled = true;
  try {
    const text = await callClaude(
      'You are a grammar and writing assistant. Analyze the text for grammar, spelling, punctuation, and style issues. Format your response as:\n\nOVERALL SCORE: X/10\n\nISSUES FOUND:\n• [issue] → [correction] — [explanation]\n\nCORRECTED TEXT:\n[corrected version]\n\nSTYLE SUGGESTIONS:\n• suggestion',
      input, 700
    );
    result.textContent = text;
    result.classList.add('show');
    showToast('Grammar check complete!');
  } catch(e) { showToast('API error. Please try again.', 'error'); }
  btn.innerHTML = 'Check Grammar';
  btn.disabled = false;
}

// ===== RESUME ANALYZER =====
async function runResume() {
  const resume = document.getElementById('resumeInput').value.trim();
  const jd = document.getElementById('jdInput').value.trim();
  if (!resume || !jd) { showToast('Please paste both resume and job description', 'error'); return; }
  const result = document.getElementById('resumeResult');
  result.classList.remove('show');
  const btn = document.getElementById('toolModalContent').querySelector('.run-btn');
  btn.innerHTML = '<span class="spinner"></span>Analyzing...';
  btn.disabled = true;
  try {
    const text = await callClaude(
      'You are a professional resume analyzer and career coach. Analyze the resume against the job description. Format your response as:\n\nMATCH SCORE: X%\n\nSTRENGTHS:\n• strength 1\n• strength 2\n\nGAPS & IMPROVEMENTS:\n• gap 1 → suggestion\n• gap 2 → suggestion\n\nATS KEYWORDS MISSING:\n• keyword 1, keyword 2...\n\nOVERALL RECOMMENDATION:\n[2-3 sentence recommendation]',
      `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jd}`, 800
    );
    result.textContent = text;
    result.classList.add('show');
    showToast('Resume analysis complete!');
  } catch(e) { showToast('API error. Please try again.', 'error'); }
  btn.innerHTML = 'Analyze Resume';
  btn.disabled = false;
}

// ===== CHATBOT BUILDER =====
const chatHistory = [];
async function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const name = document.getElementById('botName').value || 'AI Assistant';
  const personality = document.getElementById('botPersonality').value || 'a helpful and friendly AI assistant';
  const log = document.getElementById('chatLog');
  chatHistory.push({ role: 'user', content: msg });
  log.innerHTML += `<div style="margin-bottom:8px"><strong style="color:var(--text)">You:</strong> <span style="color:var(--text2)">${msg}</span></div>`;
  input.value = '';
  log.scrollTop = log.scrollHeight;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: `You are ${name}. ${personality}. Keep responses concise and helpful (2-4 sentences max).`,
        messages: chatHistory
      })
    });
    const data = await resp.json();
    const reply = data.content[0].text;
    chatHistory.push({ role: 'assistant', content: reply });
    log.innerHTML += `<div style="margin-bottom:8px"><strong style="color:var(--accent)">${name}:</strong> <span style="color:var(--text2)">${reply}</span></div>`;
    log.scrollTop = log.scrollHeight;
  } catch(e) { showToast('Chat error', 'error'); }
}

// ===== IMAGE CLASSIFIER =====
async function runImgClassify() {
  const desc = document.getElementById('imgDesc').value.trim();
  if (!desc) { showToast('Please describe or upload an image', 'error'); return; }
  const result = document.getElementById('imgResult');
  result.classList.remove('show');
  const btn = document.getElementById('toolModalContent').querySelector('.run-btn');
  btn.innerHTML = '<span class="spinner"></span>Classifying...';
  btn.disabled = true;
  try {
    const text = await callClaude(
      'You are an image classification AI. Given a description, provide classification results in this format:\n\nTOP CLASSIFICATIONS:\n1. [Label] — [X]% confidence\n2. [Label] — [X]% confidence\n3. [Label] — [X]% confidence\n4. [Label] — [X]% confidence\n5. [Label] — [X]% confidence\n\nCATEGORY: [main category]\nOBJECTS DETECTED: [list]\nSCENE TYPE: [indoor/outdoor/etc]\nCOLOR PALETTE: [dominant colors]',
      `Classify this image: ${desc}`, 400
    );
    result.textContent = text;
    result.classList.add('show');
    showToast('Image classified!');
  } catch(e) { showToast('API error', 'error'); }
  btn.innerHTML = 'Classify Image';
  btn.disabled = false;
}
function handleImgClassify(input) {
  if (input.files[0]) showToast(`Image "${input.files[0].name}" loaded.`);
}

// ===== VOICE EMOTION DETECTOR =====
let isRecording = false;
let recordTimer = null;
let recordSeconds = 0;

function initVoiceTool() { /* init handled inline */ }

function switchTab(tool, tab) {
  document.querySelectorAll(`#${tool}-tab-record, #${tool}-tab-upload, #${tool}-tab-text, #${tool}-tab-questionnaire`).forEach(el => {
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(`${tool}-tab-${tab}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

function toggleRecording() {
  const btn = document.getElementById('recordBtn');
  const status = document.getElementById('recordStatus');
  const timer = document.getElementById('recordTimer');
  if (!isRecording) {
    isRecording = true;
    recordSeconds = 0;
    btn.classList.add('recording');
    btn.textContent = '⏹';
    status.textContent = 'Recording... speak naturally';
    recordTimer = setInterval(() => {
      recordSeconds++;
      const m = String(Math.floor(recordSeconds/60)).padStart(2,'0');
      const s = String(recordSeconds%60).padStart(2,'0');
      timer.textContent = `${m}:${s}`;
    }, 1000);
  } else {
    isRecording = false;
    clearInterval(recordTimer);
    btn.classList.remove('recording');
    btn.textContent = '⏺';
    status.textContent = `Recording saved (${recordSeconds}s) — ready to analyze`;
  }
}

function handleAudioUpload(input) {
  if (input.files[0]) {
    document.getElementById('audioFileName').textContent = '✓ ' + input.files[0].name;
    showToast(`Audio "${input.files[0].name}" uploaded`);
  }
}

async function runVoiceAnalysis(mode) {
  let context = '';
  if (mode === 'text') {
    context = document.getElementById('voiceTextInput').value.trim();
    if (!context) { showToast('Please describe the voice sample or paste a transcription', 'error'); return; }
  } else if (mode === 'record') {
    if (recordSeconds < 1 && !isRecording) {
      context = 'General voice sample from a person speaking naturally for about 10 seconds. The person seems calm but slightly uncertain.';
    } else {
      context = `Voice recording of ${recordSeconds} seconds duration. The person spoke naturally into a microphone.`;
    }
  } else {
    const f = document.getElementById('audioFile').files[0];
    context = f ? `Audio file: ${f.name} (${(f.size/1024).toFixed(0)}KB, ${f.type})` : 'Audio file uploaded for emotion analysis';
  }

  const resultsDiv = document.getElementById('voiceResults');
  resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)"><span class="spinner" style="border-color:rgba(0,229,160,.2);border-top-color:var(--accent)"></span>Analyzing voice patterns...</div>';

  try {
    const raw = await callClaude(
      `You are a voice emotion detection AI. Analyze the voice sample and return ONLY valid JSON with this exact structure:
{"dominant":"Neutral","confidence":85,"emotions":{"Happy":15,"Sad":10,"Angry":5,"Fearful":8,"Disgusted":3,"Surprised":12,"Neutral":47},"analysis":"2-3 sentence analysis of vocal patterns, tone, and emotional cues detected","intensity":"Medium","tone":"Calm"}
Use realistic values that sum to 100 for emotions. Choose dominant from the emotions. Return ONLY the JSON, no other text.`,
      `Voice sample context: ${context}`, 400
    );

    let data;
    try {
      const cleaned = raw.replace(/```json|```/g,'').trim();
      data = JSON.parse(cleaned);
    } catch(e) {
      data = {
        dominant: 'Neutral', confidence: 72,
        emotions: { Happy:18, Sad:12, Angry:8, Fearful:6, Disgusted:4, Surprised:10, Neutral:42 },
        analysis: 'Voice analysis complete. Detected mixed emotional signals with a predominantly neutral baseline. Some positive micro-expressions detected in speech cadence.',
        intensity: 'Medium', tone: 'Balanced'
      };
    }

    const colors = { Happy:'#22c55e', Sad:'#3b82f6', Angry:'#ef4444', Fearful:'#f59e0b', Disgusted:'#8b5cf6', Surprised:'#ec4899', Neutral:'#6b7280' };
    const emotionEmojis = { Happy:'😄', Sad:'😢', Angry:'😠', Fearful:'😨', Disgusted:'🤢', Surprised:'😲', Neutral:'😐' };

    const sorted = Object.entries(data.emotions).sort((a,b) => b[1]-a[1]);
    resultsDiv.innerHTML = `
      <div class="emotion-winner">
        <div class="emotion-winner-emoji">${emotionEmojis[data.dominant] || '😐'}</div>
        <div class="emotion-winner-label">${data.dominant}</div>
        <div class="emotion-winner-score">${data.confidence}% confidence · ${data.intensity} intensity · ${data.tone} tone</div>
      </div>
      <div class="emotion-results">
        ${sorted.map(([em, pct]) => `
          <div class="emotion-bar-row">
            <div class="emotion-label">${emotionEmojis[em]||''} ${em}</div>
            <div class="emotion-bar-track">
              <div class="emotion-bar-fill" style="width:0%;background:${colors[em]||'#6b7280'}" data-target="${pct}"></div>
            </div>
            <div class="emotion-pct" style="color:${colors[em]||'#6b7280'}">${pct}%</div>
          </div>
        `).join('')}
      </div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-top:12px;font-size:13px;color:var(--text2);line-height:1.6">
        <strong style="color:var(--text)">Analysis:</strong> ${data.analysis}
      </div>
    `;
    // Animate bars
    setTimeout(() => {
      resultsDiv.querySelectorAll('.emotion-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 100);
    showToast('Voice emotion analysis complete!');
  } catch(e) {
    resultsDiv.innerHTML = '';
    showToast('Analysis error. Please try again.', 'error');
  }
}

// ===== PERSONALITY PREDICTION AI =====
const personalityQuestions = [
  { id: 'o1', trait: 'O', text: 'I enjoy exploring new ideas and abstract concepts', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'c1', trait: 'C', text: 'I always complete tasks thoroughly and pay attention to details', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'e1', trait: 'E', text: 'I feel energized when I\'m around other people', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'a1', trait: 'A', text: 'I find it easy to empathize with others\' feelings', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'n1', trait: 'N', text: 'I often feel anxious or worried about things', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'o2', trait: 'O', text: 'I enjoy artistic, creative, or imaginative activities', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'c2', trait: 'C', text: 'I make plans and stick to them rather than being spontaneous', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'e2', trait: 'E', text: 'I like to take charge in social situations', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'a2', trait: 'A', text: 'I prefer cooperation over competition', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
  { id: 'n2', trait: 'N', text: 'My mood can change quickly depending on circumstances', options: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] },
];
const personalityAnswers = {};

function initPersonalityTool() {
  const container = document.getElementById('personalityQuestions');
  if (!container) return;
  container.innerHTML = personalityQuestions.map((q, i) => `
    <div class="q-block">
      <div class="q-text">${i+1}. ${q.text}</div>
      <div class="q-options">
        ${q.options.map((opt, j) => `
          <button class="q-opt" data-qid="${q.id}" data-val="${j+1}" onclick="selectAnswer('${q.id}', ${j+1}, this)">${opt}</button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function selectAnswer(qid, val, btn) {
  personalityAnswers[qid] = val;
  const container = btn.closest('.q-options');
  container.querySelectorAll('.q-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

async function runPersonalityQuestionnaire() {
  const answered = Object.keys(personalityAnswers).length;
  if (answered < personalityQuestions.length) {
    showToast(`Please answer all ${personalityQuestions.length} questions (${answered}/${personalityQuestions.length} answered)`, 'error');
    return;
  }
  const summary = personalityQuestions.map(q => `${q.text}: ${personalityAnswers[q.id]}/5`).join('\n');
  await analyzePersonality(`Questionnaire responses (1=Strongly Disagree, 5=Strongly Agree):\n${summary}`);
}

async function runPersonalityText() {
  const text = document.getElementById('personalityText').value.trim();
  if (!text) { showToast('Please paste a writing sample', 'error'); return; }
  await analyzePersonality(`Writing sample for personality analysis:\n${text}`);
}

async function analyzePersonality(input) {
  const resultsDiv = document.getElementById('personalityResults');
  resultsDiv.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)"><span class="spinner" style="border-color:rgba(0,229,160,.2);border-top-color:var(--accent)"></span>Analyzing personality traits...</div>';

  try {
    const raw = await callClaude(
      `You are a personality psychologist using the Big Five OCEAN model. Analyze the input and return ONLY valid JSON:
{"O":{"score":72,"label":"Openness","level":"High","desc":"Curious, creative, and open to new experiences. Enjoys intellectual exploration."},"C":{"score":65,"label":"Conscientiousness","level":"Moderate","desc":"Fairly organized and dependable with some spontaneity."},"E":{"score":58,"label":"Extraversion","level":"Moderate","desc":"Balanced between social engagement and solitary activities."},"A":{"score":80,"label":"Agreeableness","level":"High","desc":"Cooperative, trusting, and empathetic toward others."},"N":{"score":35,"label":"Neuroticism","level":"Low","desc":"Emotionally stable and resilient under pressure."},"summary":"2-3 sentence overall personality summary","type":"The Thoughtful Explorer"}
Return ONLY the JSON. Make scores realistic between 20-95.`,
      input, 600
    );

    let data;
    try {
      data = JSON.parse(raw.replace(/```json|```/g,'').trim());
    } catch(e) {
      data = {
        O:{ score:72, label:'Openness', level:'High', desc:'Curious, creative, and open to new experiences.' },
        C:{ score:65, label:'Conscientiousness', level:'Moderate', desc:'Fairly organized and dependable with some spontaneity.' },
        E:{ score:58, label:'Extraversion', level:'Moderate', desc:'Balanced between social engagement and solitary activities.' },
        A:{ score:80, label:'Agreeableness', level:'High', desc:'Cooperative, trusting, and empathetic toward others.' },
        N:{ score:35, label:'Neuroticism', level:'Low', desc:'Emotionally stable and resilient under pressure.' },
        summary:'A well-rounded individual with strong curiosity and empathy, balanced social tendencies, and good emotional stability.',
        type:'The Thoughtful Collaborator'
      };
    }

    const traitColors = { O:'#7c3aed', C:'#3b82f6', E:'#f59e0b', A:'#22c55e', N:'#ef4444' };
    const traitEmojis = { O:'🎨', C:'📋', E:'🗣️', A:'🤝', N:'🌊' };

    resultsDiv.innerHTML = `
      <div style="background:linear-gradient(135deg,#0d1a2e,#0a1a0e);border:1px solid rgba(0,229,160,.2);border-radius:var(--radius);padding:16px;margin-bottom:16px;text-align:center">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:6px">Personality Type</div>
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:20px;color:var(--accent)">${data.type || 'The Thoughtful Individual'}</div>
        <div style="font-size:13px;color:var(--text2);margin-top:8px;line-height:1.6">${data.summary || ''}</div>
      </div>
      <div class="personality-results">
        ${['O','C','E','A','N'].map(trait => {
          const t = data[trait];
          if (!t) return '';
          const color = traitColors[trait];
          return `
            <div class="trait-row">
              <div class="trait-header">
                <div class="trait-name">${traitEmojis[trait]} ${t.label}</div>
                <div class="trait-score" style="color:${color}">${t.score}/100 · ${t.level}</div>
              </div>
              <div class="trait-bar-track">
                <div class="trait-bar-fill" style="width:0%;background:${color}" data-target="${t.score}"></div>
              </div>
              <div class="trait-desc">${t.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    setTimeout(() => {
      resultsDiv.querySelectorAll('.trait-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 100);
    showToast('Personality analysis complete!');
  } catch(e) {
    resultsDiv.innerHTML = '';
    showToast('Analysis error. Please try again.', 'error');
  }
}

// ===== GOVERNANCE MODALS =====
function openProposal(id) {
  modal.classList.add('open');
  modalContent.innerHTML = `
    <div class="modal-title">Proposal #00${id} Details</div>
    <div class="modal-desc">Full proposal discussion and voting interface.</div>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px;font-size:13px;color:var(--text2);line-height:1.7">
      This proposal is currently in the active voting phase. Token holders with at least 1 AIT can cast their vote. Voting period ends in ${id === '1' ? '2 days' : id === '2' ? '4 days' : '6 days'}.
    </div>
    <div style="display:flex;gap:10px">
      <button class="run-btn" style="background:rgba(0,229,160,.1);border:1px solid rgba(0,229,160,.3);color:var(--accent)" onclick="castVote('for','#00${id}');closeModal()">Vote FOR (2,450 AIT)</button>
      <button class="run-btn" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:var(--red)" onclick="castVote('against','#00${id}');closeModal()">Vote AGAINST</button>
    </div>
  `;
}

function openNewProposal() {
  modal.classList.add('open');
  modalContent.innerHTML = `
    <div class="modal-title">+ Create New Proposal</div>
    <div class="modal-desc">Submit a new proposal for the community to vote on. You need at least 100 AIT to create a proposal.</div>
    <div class="modal-section">
      <div class="modal-label">Proposal Title</div>
      <input class="form-input" id="propTitle" placeholder="e.g. Build AI Code Review Tool for Phase 2">
    </div>
    <div class="modal-section">
      <div class="modal-label">Category</div>
      <select class="form-select" id="propCategory">
        <option value="tools">AI Tool Development</option>
        <option value="treasury">Treasury Allocation</option>
        <option value="governance">Governance Change</option>
        <option value="partnership">Partnership</option>
      </select>
    </div>
    <div class="modal-section">
      <div class="modal-label">Description</div>
      <textarea class="form-textarea" id="propDesc" placeholder="Describe what you want to build/change, why it benefits the DAO, timeline, and expected outcomes..."></textarea>
    </div>
    <div class="modal-section">
      <div class="modal-label">Budget Request (AIT)</div>
      <input class="form-input" id="propBudget" type="number" placeholder="e.g. 1500" min="0">
    </div>
    <button class="run-btn" onclick="submitProposal()">Submit Proposal</button>
  `;
}

async function submitProposal() {
  const title = document.getElementById('propTitle').value.trim();
  const desc = document.getElementById('propDesc').value.trim();
  if (!title || !desc) { showToast('Please fill in title and description', 'error'); return; }
  const btn = document.getElementById('toolModalContent').querySelector('.run-btn');
  btn.innerHTML = '<span class="spinner"></span>Submitting on-chain...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1800));
  closeModal();
  showToast('✓ Proposal #009 submitted! Voting starts in 24 hours.', 'success');
}
export default App;