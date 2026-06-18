/* ═══════════════════════════════════════════════
   ACADELYTICS V2.0 — script.js
════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────
let selectedBranch   = null;
let selectedSemester = null;
let currentSgpa      = null;
let currentSgpaLabel = null;

// ── LocalStorage Keys ────────────────────────────
const LS_THEME   = 'acadelytics-theme';
const LS_HISTORY = 'acadelytics-history';
const LS_STATE   = 'acadelytics-state';

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initSgpa();
  initCgpa();
  initTools();
  initDashboard();
  restoreState();
  renderHistory();
  updateDashboard();
  renderTrendChart();
});

// ═══════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════
function initTheme() {
  const saved = localStorage.getItem(LS_THEME) || 'dark';
  applyTheme(saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(LS_THEME, theme);
  const icon = document.getElementById('themeIcon');
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ═══════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════
const sections = {
  home:  document.getElementById('homeSection'),
  sgpa:  document.getElementById('sgpaSection'),
  cgpa:  document.getElementById('cgpaSection'),
  tools: document.getElementById('toolsSection'),
  about: document.getElementById('aboutSection'),
};

function initNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinksEl = document.getElementById('navLinks');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      showSection(link.dataset.section);
      navLinksEl.classList.remove('open');
    });
  });

  mobileBtn.addEventListener('click', () => navLinksEl.classList.toggle('open'));

  // data-nav buttons
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });
}

function showSection(name) {
  Object.values(sections).forEach(s => s.classList.add('hidden'));
  sections[name].classList.remove('hidden');
}

function navigateTo(section) {
  const link = document.querySelector(`.nav-link[data-section="${section}"]`);
  if (link) link.click();
}

// ═══════════════════════════════════════════════
//  SGPA CALCULATOR
// ═══════════════════════════════════════════════
function initSgpa() {
  const branchChips   = document.querySelectorAll('.branch-chip');
  const semChips      = document.querySelectorAll('.semester-chip');
  const calcBtn       = document.getElementById('calculateBtn');
  const resetBtn      = document.getElementById('resetBtn');
  const saveBtn       = document.getElementById('saveToHistoryBtn');
  const pdfBtn        = document.getElementById('downloadPdfBtn');

  branchChips.forEach(chip => {
    chip.addEventListener('click', () => {
      branchChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedBranch = chip.dataset.branch;
      loadSemesterData();
      saveState();
    });
  });

  semChips.forEach(chip => {
    chip.addEventListener('click', () => {
      semChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedSemester = chip.dataset.semester;
      loadSemesterData();
      saveState();
    });
  });

  calcBtn.addEventListener('click', calculateSgpa);
  resetBtn.addEventListener('click', resetSgpa);
  saveBtn.addEventListener('click', saveToHistory);
  pdfBtn.addEventListener('click', exportSgpaPdf);
}

function getSemKey() {
  if (!selectedBranch || !selectedSemester) return null;
  if (selectedSemester === '1' || selectedSemester === '2') {
    return `1yr-${selectedSemester}`;
  }
  return `${selectedBranch.toLowerCase()}-${selectedSemester}`;
}

function loadSemesterData() {
  hideAll();
  const key  = getSemKey();
  const data = key ? semesterData[key] : null;

  if (!data) {
    if (key) showWip(`Data for ${selectedBranch.toUpperCase()} Semester ${selectedSemester} is coming soon.`);
    return;
  }

  renderSemesterInfo(data);
  renderSubjects(data);

  ['semesterInfo','subjectsCard','buttonsSection'].forEach(id => {
    document.getElementById(id).classList.remove('hidden');
  });
}

function hideAll() {
  ['semesterInfo','subjectsCard','buttonsSection','resultCard','errorMessage','comingSoon'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  currentSgpa = null;
}

function showWip(msg) {
  document.getElementById('comingSoonText').textContent = msg;
  document.getElementById('comingSoon').classList.remove('hidden');
}

function renderSemesterInfo(data) {
  document.getElementById('semesterTitle').textContent = data.label;
  document.getElementById('subjectCount').textContent  = `${data.subjects.length} Subjects`;

  let base = 0, total = 0;
  data.subjects.forEach(s => {
    total += s.credit;
    if (!s.optional) base += s.credit;
  });

  const el = document.getElementById('totalCredits');
  if (base === total) {
    el.textContent = base;
  } else {
    el.innerHTML = `${base}/<span class="muted" style="font-size:1.2rem">${total}</span>`;
  }
}

function renderSubjects(data) {
  const container = document.getElementById('subjectsContainer');
  container.innerHTML = '';

  data.subjects.forEach((subject, i) => {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.dataset.credit  = subject.credit;
    row.dataset.index   = i;

    const typeTag = subject.type === 'practical' ? ' <span style="font-size:0.7rem;background:var(--blue-glow);color:var(--blue-light);padding:2px 8px;border-radius:4px">Lab</span>'
                  : subject.type === 'project'   ? ' <span style="font-size:0.7rem;background:rgba(110,64,201,0.2);color:var(--purple-light);padding:2px 8px;border-radius:4px">Project</span>'
                  : '';

    row.innerHTML = `
      <div class="subject-info">
        <h4>${subject.name}${typeTag}</h4>
        <p>${subject.credit === 0 ? 'No Credit' : `${subject.credit} Credit${subject.credit !== 1 ? 's' : ''}`}</p>
      </div>
      <div class="subject-controls">
        ${subject.optional ? renderOptionalUI() : renderInputUI()}
      </div>`;

    container.appendChild(row);
  });

  attachSubjectListeners();
}

function renderOptionalUI() {
  return `
    <div class="optional-pills">
      <button class="toggle-pill optional-toggle active" data-value="no">Not Taken</button>
      <button class="toggle-pill optional-toggle" data-value="yes">Taken</button>
    </div>
    <div class="optional-content hidden"></div>`;
}

function renderInputUI() {
  return `
    <div class="method-pills">
      <button class="toggle-pill method-btn active" data-method="grade">Grade</button>
      <button class="toggle-pill method-btn" data-method="marks">Marks</button>
    </div>
    <div class="input-area">
      <div class="grade-area">${renderGradePills()}</div>
      <div class="marks-area hidden">${renderMarksInput()}</div>
    </div>`;
}

function renderGradePills() {
  return `<div class="grade-pills">
    ${['O','E','A','B','C','D','U'].map(g =>
      `<button class="grade-pill" data-grade="${g}">${g}</button>`
    ).join('')}
  </div>`;
}

function renderMarksInput() {
  return `<input type="number" inputmode="numeric" min="0" max="100" class="marks-input" placeholder="Enter marks (0–100)" />`;
}

function attachSubjectListeners() {
  // Marks validation
  document.querySelectorAll('.marks-input').forEach(inp => {
    inp.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      const v = Number(this.value);
      if (v > 100) this.value = 100;
      if (v < 0)   this.value = 0;
      saveState();
    });
  });

  // Optional toggle
  document.querySelectorAll('.optional-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const pills   = this.parentElement;
      const content = pills.nextElementSibling;
      pills.querySelectorAll('.optional-toggle').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (this.dataset.value === 'yes') {
        content.innerHTML = renderInputUI();
        content.classList.remove('hidden');
        attachSubjectListeners();
      } else {
        content.innerHTML = '';
        content.classList.add('hidden');
      }
      saveState();
    });
  });

  // Method switch (grade/marks)
  document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const row  = this.closest('.subject-controls');
      const area = row.querySelector('.input-area');
      row.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const isGrade = this.dataset.method === 'grade';
      area.querySelector('.grade-area').classList.toggle('hidden', !isGrade);
      area.querySelector('.marks-area').classList.toggle('hidden', isGrade);
      saveState();
    });
  });

  // Grade pill selection
  document.querySelectorAll('.grade-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      const pills = this.closest('.grade-pills');
      pills.querySelectorAll('.grade-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      saveState();
    });
  });
}

function getSubjectGrade(row) {
  const controls = row.querySelector('.subject-controls');

  // Optional subjects
  const optTaken = row.querySelector('.optional-toggle.active');
  if (optTaken) {
    if (optTaken.dataset.value === 'no') return { grade: null, skip: true };
    // "yes" — fall through to read grade from optional-content
    const content = row.querySelector('.optional-content');
    if (!content || !content.innerHTML.trim()) return { grade: null, skip: true };
    return readGradeFromControls(content);
  }

  return readGradeFromControls(controls);
}

function readGradeFromControls(parent) {
  const methodBtn = parent.querySelector('.method-btn.active');
  const method    = methodBtn ? methodBtn.dataset.method : 'grade';

  if (method === 'grade') {
    const active = parent.querySelector('.grade-pill.active');
    if (!active) return { grade: null, skip: false };
    return { grade: active.dataset.grade, skip: false };
  } else {
    const inp = parent.querySelector('.marks-input');
    if (!inp || inp.value.trim() === '') return { grade: null, skip: false };
    return { grade: marksToGrade(Number(inp.value)), skip: false };
  }
}

function calculateSgpa() {
  const rows   = document.querySelectorAll('.subject-row');
  const errors = [];
  let totalPoints = 0;
  let totalCredits = 0;
  let missingCount = 0;

  rows.forEach((row, i) => {
    const credit = Number(row.dataset.credit);
    const { grade, skip } = getSubjectGrade(row);

    if (skip || credit === 0) return;

    if (!grade) {
      missingCount++;
      return;
    }

    totalPoints  += credit * gradePoints[grade];
    totalCredits += credit;
  });

  if (missingCount > 0) {
    showError(`Please select a grade for all subjects. (${missingCount} subject${missingCount > 1 ? 's' : ''} missing)`);
    return;
  }
  if (totalCredits === 0) {
    showError('No credits to calculate. All subjects may be 0-credit or skipped.');
    return;
  }

  hideError();
  const sgpa = totalPoints / totalCredits;
  const rounded = Math.round(sgpa * 100) / 100;
  showResult(rounded, totalCredits);
}

function showResult(sgpa, credits) {
  currentSgpa      = sgpa;
  currentSgpaLabel = getSemKey();

  document.getElementById('sgpaValue').textContent = sgpa.toFixed(2);

  const mot = getMotivation(sgpa);
  document.getElementById('motivationTitle').textContent   = mot.title;
  document.getElementById('motivationMessage').textContent = mot.message;

  document.getElementById('resultCard').classList.remove('hidden');
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(msg) {
  const el = document.getElementById('errorMessage');
  el.textContent = `⚠ ${msg}`;
  el.classList.remove('hidden');
}

function hideError() {
  document.getElementById('errorMessage').classList.add('hidden');
}

function resetSgpa() {
  hideAll();
  document.querySelectorAll('.branch-chip, .semester-chip').forEach(c => c.classList.remove('active'));
  selectedBranch = selectedSemester = null;
  currentSgpa = null;
  hideError();
  clearState();
}

// ═══════════════════════════════════════════════
//  HISTORY
// ═══════════════════════════════════════════════
function getHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
  catch { return []; }
}

function saveHistory(hist) {
  localStorage.setItem(LS_HISTORY, JSON.stringify(hist));
}

function saveToHistory() {
  if (currentSgpa === null) return;

  const key   = getSemKey();
  const data  = semesterData[key];
  const label = data ? data.label : key;

  const hist  = getHistory();
  const entry = {
    id: Date.now(),
    key,
    label,
    sgpa: currentSgpa,
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
  };

  // Remove duplicate key if exists
  const existing = hist.findIndex(e => e.key === key);
  if (existing !== -1) hist.splice(existing, 1);
  hist.push(entry);

  saveHistory(hist);
  renderHistory();
  updateDashboard();
  renderTrendChart();
  showToast('Saved to history!');
}

function renderHistory() {
  const container = document.getElementById('semesterHistory');
  const hist      = getHistory();

  if (!hist.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-book-open fa-2x"></i>
        <p>No semester records saved yet.</p>
        <p class="muted">Calculate an SGPA and save it here.</p>
      </div>`;
    return;
  }

  const sorted = [...hist].sort((a, b) => {
    const order = (x) => {
      const parts = x.key.split('-');
      return parseFloat(parts[parts.length - 1]) || 0;
    };
    return order(a) - order(b);
  });

  let html = `<table class="history-table">
    <thead><tr>
      <th>Semester</th><th>SGPA</th><th>Performance</th><th>Saved On</th><th></th>
    </tr></thead><tbody>`;

  sorted.forEach(entry => {
    const cls = sgpaBadgeClass(entry.sgpa);
    const mot = getMotivation(entry.sgpa);
    html += `<tr>
      <td style="font-weight:600">${entry.label}</td>
      <td><span class="sgpa-badge ${cls}">${entry.sgpa.toFixed(2)}</span></td>
      <td style="color:var(--text2)">${mot.title}</td>
      <td style="color:var(--muted);font-size:0.8rem">${entry.date}</td>
      <td><button class="history-del" data-id="${entry.id}">
        <i class="fa-solid fa-trash-alt"></i>
      </button></td>
    </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  container.querySelectorAll('.history-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const hist2 = getHistory().filter(e => e.id !== Number(btn.dataset.id));
      saveHistory(hist2);
      renderHistory();
      updateDashboard();
      renderTrendChart();
    });
  });
}

function sgpaBadgeClass(sgpa) {
  if (sgpa >= 9) return 'sgpa-o';
  if (sgpa >= 8) return 'sgpa-e';
  if (sgpa >= 7) return 'sgpa-a';
  if (sgpa >= 6) return 'sgpa-b';
  return 'sgpa-low';
}

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════
function initDashboard() {
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    const hist = getHistory();
    if (hist.length === 0) return;
    if (!confirm('Clear all semester history? This cannot be undone.')) return;
    saveHistory([]);
    renderHistory();
    updateDashboard();
    renderTrendChart();
  });
}

function updateDashboard() {
  const hist = getHistory();

  if (!hist.length) {
    ['dashCgpa','dashCredits','dashBest','dashLatest'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
    document.getElementById('dashCgpaLabel').textContent   = 'No data yet';
    document.getElementById('dashCreditsLabel').textContent = 'Across all semesters';
    document.getElementById('dashBestLabel').textContent   = 'No records yet';
    document.getElementById('dashLatestLabel').textContent = 'No records yet';
    return;
  }

  // CGPA
  const cgpa = hist.reduce((s, e) => s + e.sgpa, 0) / hist.length;
  document.getElementById('dashCgpa').textContent    = cgpa.toFixed(2);
  document.getElementById('dashCgpaLabel').textContent = getCgpaMotivation(cgpa).title;

  // Credits
  let totalCreds = 0;
  hist.forEach(e => {
    const data = semesterData[e.key];
    if (data) {
      data.subjects.forEach(s => { if (!s.optional) totalCreds += s.credit; });
    }
  });
  document.getElementById('dashCredits').textContent    = totalCreds;
  document.getElementById('dashCreditsLabel').textContent = `${hist.length} semester${hist.length !== 1 ? 's' : ''} recorded`;

  // Best semester
  const best = hist.reduce((a, b) => a.sgpa >= b.sgpa ? a : b);
  document.getElementById('dashBest').textContent    = best.sgpa.toFixed(2);
  document.getElementById('dashBestLabel').textContent = best.label;

  // Latest
  const latest = hist[hist.length - 1];
  document.getElementById('dashLatest').textContent    = latest.sgpa.toFixed(2);
  document.getElementById('dashLatestLabel').textContent = latest.label;
}

// ═══════════════════════════════════════════════
//  TREND CHART (Canvas API)
// ═══════════════════════════════════════════════
function renderTrendChart() {
  const hist    = getHistory();
  const canvas  = document.getElementById('trendChart');
  const empty   = document.getElementById('chartEmpty');

  if (!hist.length) {
    canvas.style.display = 'none';
    empty.style.display  = 'flex';
    return;
  }

  canvas.style.display = 'block';
  empty.style.display  = 'none';

  const sorted = [...hist].sort((a, b) => {
    const idx = k => {
      const parts = k.split('-');
      return parseFloat(parts[parts.length - 1]) || 0;
    };
    return idx(a.key) - idx(b.key);
  });

  const isDark  = document.documentElement.getAttribute('data-theme') !== 'light';
  const dpr     = window.devicePixelRatio || 1;
  const rect    = canvas.parentElement.getBoundingClientRect();
  const W       = rect.width || 700;
  const H       = 220;

  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  canvas.width        = W * dpr;
  canvas.height       = H * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL = 50, padR = 24, padT = 24, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Background
  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridColor = isDark ? 'rgba(48,54,61,0.8)' : 'rgba(208,215,222,0.8)';
  const textColor = isDark ? '#848d97' : '#6e7781';
  const lineColor = isDark ? '#238636' : '#1a7f37';

  ctx.strokeStyle = gridColor;
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();

    const label = (10 - i * 2.5).toFixed(1);
    ctx.fillStyle   = textColor;
    ctx.font        = '11px Inter, sans-serif';
    ctx.textAlign   = 'right';
    ctx.fillText(label, padL - 8, y + 4);
  }

  // Data points
  const n = sorted.length;
  const xs = sorted.map((_, i) => padL + (n === 1 ? chartW / 2 : (chartW / (n - 1)) * i));
  const ys = sorted.map(e => padT + chartH - ((e.sgpa / 10) * chartH));

  // Filled area gradient
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, isDark ? 'rgba(35,134,54,0.35)' : 'rgba(26,127,55,0.25)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.moveTo(xs[0], padT + chartH);
  xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
  ctx.lineTo(xs[n-1], padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]));
  ctx.stroke();

  // Points + labels
  sorted.forEach((entry, i) => {
    const x = xs[i], y = ys[i];

    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#0d1117' : '#ffffff';
    ctx.fill();

    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // SGPA label above
    ctx.fillStyle   = isDark ? '#e6edf3' : '#1f2328';
    ctx.font        = 'bold 11px Inter, sans-serif';
    ctx.textAlign   = 'center';
    ctx.fillText(entry.sgpa.toFixed(2), x, y - 12);

    // Semester label below axis
    const shortLabel = entry.label.replace(/• Semester/i, '').replace(/1st Year/, 'Y1').trim();
    ctx.fillStyle   = textColor;
    ctx.font        = '10px Inter, sans-serif';
    ctx.fillText(shortLabel, x, H - padB + 16);
  });
}

// Redraw on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderTrendChart, 150);
});

// Redraw when switching to home tab
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    if (l.dataset.section === 'home') setTimeout(renderTrendChart, 50);
  });
});

// ═══════════════════════════════════════════════
//  CGPA CALCULATOR
// ═══════════════════════════════════════════════
function initCgpa() {
  const countChips = document.querySelectorAll('.cgpa-count');
  const calcBtn    = document.getElementById('cgpa-calc-btn');
  const resetBtn   = document.getElementById('cgpa-reset-btn');
  const pdfBtn     = document.getElementById('downloadCgpaPdfBtn');

  countChips.forEach(chip => {
    chip.addEventListener('click', () => {
      countChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderCgpaInputs(Number(chip.dataset.count));
      document.getElementById('cgpa-result').classList.add('hidden');
    });
  });

  calcBtn.addEventListener('click', calculateCgpa);
  resetBtn.addEventListener('click', () => {
    countChips.forEach(c => c.classList.remove('active'));
    document.getElementById('cgpa-input-card').classList.add('hidden');
    document.getElementById('cgpa-result').classList.add('hidden');
  });
  pdfBtn.addEventListener('click', exportCgpaPdf);
}

function renderCgpaInputs(count) {
  const card   = document.getElementById('cgpa-input-card');
  const inputs = document.getElementById('cgpa-inputs');
  const hist   = getHistory();

  inputs.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const saved = hist.find(e => {
      const parts = (e.key || '').split('-');
      return parseInt(parts[parts.length - 1]) === i;
    });

    const row = document.createElement('div');
    row.className = 'cgpa-input-row';
    row.innerHTML = `
      <div>
        <p class="cgpa-sem-label">Semester ${i}</p>
        ${saved ? `<p class="cgpa-sem-from-history"><i class="fa-solid fa-bookmark"></i> ${saved.label}</p>` : ''}
      </div>
      <input type="number" class="cgpa-sem-input" inputmode="decimal"
        placeholder="SGPA (0–10)"
        min="0" max="10" step="0.01"
        value="${saved ? saved.sgpa.toFixed(2) : ''}"
        data-sem="${i}" />`;
    inputs.appendChild(row);
  }

  card.classList.remove('hidden');
}

function calculateCgpa() {
  const inputs = document.querySelectorAll('.cgpa-sem-input');
  let sum = 0, count = 0;

  for (const inp of inputs) {
    const v = parseFloat(inp.value);
    if (isNaN(v) || v < 0 || v > 10) {
      showCgpaError(`Invalid SGPA for Semester ${inp.dataset.sem}. Must be 0–10.`);
      return;
    }
    sum += v; count++;
  }

  if (!count) return;

  const cgpa    = sum / count;
  const rounded = Math.round(cgpa * 100) / 100;
  const mot     = getCgpaMotivation(rounded);

  document.getElementById('cgpa-value').textContent  = rounded.toFixed(2);
  document.getElementById('cgpa-msg').textContent    = mot.title;
  document.getElementById('cgpa-submsg').textContent = mot.message;

  document.getElementById('cgpa-result').classList.remove('hidden');
  document.getElementById('cgpa-result').scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function showCgpaError(msg) { alert(msg); }

// ═══════════════════════════════════════════════
//  TOOLS
// ═══════════════════════════════════════════════
function initTools() {
  initToolTabs();
  initPredictor();
  initPlanner();
  initAttendance();
  initGradeReq();
}

function initToolTabs() {
  const tabs   = document.querySelectorAll('.tool-tab');
  const panels = document.querySelectorAll('.tool-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(`tool-${tab.dataset.tool}`).classList.remove('hidden');
    });
  });
}

// ── Target CGPA Predictor ──
function initPredictor() {
  document.getElementById('predictBtn').addEventListener('click', () => {
    const curCgpa  = parseFloat(document.getElementById('pred-current-cgpa').value);
    const compCred = parseFloat(document.getElementById('pred-completed-credits').value);
    const remCred  = parseFloat(document.getElementById('pred-remaining-credits').value);
    const tgtCgpa  = parseFloat(document.getElementById('pred-target-cgpa').value);

    if ([curCgpa, compCred, remCred, tgtCgpa].some(isNaN)) {
      alert('Please fill all fields correctly.'); return;
    }
    if (tgtCgpa < 0 || tgtCgpa > 10) { alert('Target CGPA must be 0–10.'); return; }
    if (curCgpa < 0 || curCgpa > 10) { alert('Current CGPA must be 0–10.'); return; }

    const totalCred = compCred + remCred;
    if (totalCred === 0) { alert('Total credits cannot be zero.'); return; }

    const needed = (tgtCgpa * totalCred - curCgpa * compCred) / remCred;
    const result = document.getElementById('predictorResult');
    const sgpaEl = document.getElementById('predSgpa');
    const diffEl = document.getElementById('predDifficulty');
    const msgEl  = document.getElementById('predMessage');

    if (needed > 10) {
      sgpaEl.textContent = '>10';
      diffEl.className   = 'difficulty-badge diff-impossible';
      diffEl.textContent = 'Not Possible';
      msgEl.textContent  = 'Your target CGPA is mathematically impossible given your current standing.';
    } else if (needed < 0) {
      sgpaEl.textContent = '0.00';
      diffEl.className   = 'difficulty-badge diff-easy';
      diffEl.textContent = 'Already Achieved';
      msgEl.textContent  = 'You have already surpassed your target CGPA! Keep it up!';
    } else {
      sgpaEl.textContent = needed.toFixed(2);
      if      (needed <= 6.5) { diffEl.className = 'difficulty-badge diff-easy';     diffEl.textContent = 'Easy';             }
      else if (needed <= 7.5) { diffEl.className = 'difficulty-badge diff-moderate'; diffEl.textContent = 'Moderate';         }
      else if (needed <= 8.5) { diffEl.className = 'difficulty-badge diff-hard';     diffEl.textContent = 'Difficult';        }
      else if (needed <= 9.5) { diffEl.className = 'difficulty-badge diff-extreme';  diffEl.textContent = 'Very Difficult';   }
      else                    { diffEl.className = 'difficulty-badge diff-impossible';diffEl.textContent = 'Nearly Impossible';}
      msgEl.textContent = `You need an average SGPA of ${needed.toFixed(2)} in all remaining semesters.`;
    }

    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ── Grade Planner ──
let plannerIndex = 1;

function initPlanner() {
  document.getElementById('addPlannerRow').addEventListener('click', addPlannerRow);
  document.getElementById('calcPlannerBtn').addEventListener('click', calculatePlanner);
  document.getElementById('resetPlannerBtn').addEventListener('click', resetPlanner);
  attachPlannerRowListeners(document.querySelector('.planner-row'));
}

function addPlannerRow() {
  const container = document.getElementById('plannerSubjects');
  const row       = document.createElement('div');
  row.className   = 'planner-row';
  row.dataset.index = plannerIndex++;
  row.innerHTML = `
    <input type="text"   class="form-input plan-name"   placeholder="Subject name" />
    <input type="number" class="form-input plan-credit"  placeholder="Credits" min="1" max="6" />
    <div class="chip-group plan-grades">
      ${['O','E','A','B','C','D','U'].map(g => `<button class="chip grade-chip" data-grade="${g}">${g}</button>`).join('')}
    </div>
    <button class="btn-icon remove-planner-row" title="Remove"><i class="fa-solid fa-xmark"></i></button>`;
  container.appendChild(row);
  attachPlannerRowListeners(row);
}

function attachPlannerRowListeners(row) {
  row.querySelectorAll('.grade-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      this.closest('.plan-grades').querySelectorAll('.grade-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
  const removeBtn = row.querySelector('.remove-planner-row');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (document.querySelectorAll('.planner-row').length > 1) row.remove();
    });
  }
}

function calculatePlanner() {
  const rows = document.querySelectorAll('.planner-row');
  let totalPoints = 0, totalCredits = 0, errors = 0;

  rows.forEach(row => {
    const credit    = parseInt(row.querySelector('.plan-credit').value);
    const activeChip = row.querySelector('.grade-chip.active');
    if (!activeChip || isNaN(credit) || credit <= 0) { errors++; return; }
    totalPoints  += credit * gradePoints[activeChip.dataset.grade];
    totalCredits += credit;
  });

  if (errors > 0) { alert(`Please fill all subjects (name, credits, grade).`); return; }
  if (totalCredits === 0) { alert('Add at least one subject with valid credits.'); return; }

  const sgpa = totalPoints / totalCredits;
  const el   = document.getElementById('plannerSgpa');
  const msg  = document.getElementById('plannerMsg');
  el.textContent  = sgpa.toFixed(2);
  msg.textContent = getMotivation(sgpa).title + ' — ' + getMotivation(sgpa).message;
  document.getElementById('plannerResult').classList.remove('hidden');
}

function resetPlanner() {
  document.getElementById('plannerSubjects').innerHTML = `
    <div class="planner-row" data-index="0">
      <input type="text"   class="form-input plan-name"   placeholder="Subject name" />
      <input type="number" class="form-input plan-credit"  placeholder="Credits" min="1" max="6" />
      <div class="chip-group plan-grades">
        ${['O','E','A','B','C','D','U'].map(g => `<button class="chip grade-chip" data-grade="${g}">${g}</button>`).join('')}
      </div>
      <button class="btn-icon remove-planner-row" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>`;
  attachPlannerRowListeners(document.querySelector('.planner-row'));
  plannerIndex = 1;
  document.getElementById('plannerResult').classList.add('hidden');
}

// ── Attendance Calculator ──
function initAttendance() {
  document.getElementById('calcAttendanceBtn').addEventListener('click', calculateAttendance);
  ['att-attended','att-total'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') calculateAttendance();
    });
  });
}

function calculateAttendance() {
  const attended = parseInt(document.getElementById('att-attended').value);
  const total    = parseInt(document.getElementById('att-total').value);

  if (isNaN(attended) || isNaN(total) || attended < 0 || total <= 0) {
    alert('Please enter valid values. Total classes must be > 0.'); return;
  }
  if (attended > total) {
    alert('Classes attended cannot exceed total classes held.'); return;
  }

  const pct     = (attended / total) * 100;
  const pctDisp = pct.toFixed(1);

  document.getElementById('attCurrentPct').textContent = pctDisp + '%';

  const statusEl = document.getElementById('attStatus');
  if      (pct >= 80) { statusEl.textContent = 'Good Standing'; statusEl.className = 'att-status att-ok'; }
  else if (pct >= 75) { statusEl.textContent = 'At Minimum';    statusEl.className = 'att-status att-warn'; }
  else                { statusEl.textContent = 'Below Minimum'; statusEl.className = 'att-status att-danger'; }

  // Can miss (to stay ≥ 75%)
  // attended / (total + x) >= 0.75 → x ≤ attended/0.75 - total
  const canMiss = Math.max(0, Math.floor(attended / 0.75 - total));
  document.getElementById('attCanMiss').textContent = canMiss > 0 ? `${canMiss} class${canMiss !== 1 ? 'es' : ''}` : '0 classes';

  // Need to reach 75%
  const need75 = needToReach(attended, total, 75);
  const need80 = needToReach(attended, total, 80);
  const need85 = needToReach(attended, total, 85);

  document.getElementById('attNeed75').textContent = need75 <= 0 ? '✓ Achieved' : `${need75} class${need75 !== 1 ? 'es' : ''}`;
  document.getElementById('attNeed80').textContent = need80 <= 0 ? '✓ Achieved' : `${need80} class${need80 !== 1 ? 'es' : ''}`;
  document.getElementById('attNeed85').textContent = need85 <= 0 ? '✓ Achieved' : `${need85} class${need85 !== 1 ? 'es' : ''}`;

  document.getElementById('attendanceResult').classList.remove('hidden');
}

function needToReach(attended, total, target) {
  // (attended + x) / (total + x) >= target/100
  // attended + x >= (target/100)(total + x)
  // attended + x >= target*total/100 + target*x/100
  // x(1 - target/100) >= target*total/100 - attended
  // x >= (target*total/100 - attended) / (1 - target/100)
  const t = target / 100;
  if (attended / total >= t) return 0;
  return Math.ceil((t * total - attended) / (1 - t));
}

// ── Grade Requirement Calculator ──
function initGradeReq() {
  document.getElementById('calcGradeReqBtn').addEventListener('click', calculateGradeReq);
}

function calculateGradeReq() {
  const targetSgpa = parseFloat(document.getElementById('gr-target-sgpa').value);
  const numSubs    = parseInt(document.getElementById('gr-subjects').value);
  const avgCredit  = parseFloat(document.getElementById('gr-credits').value);

  if (isNaN(targetSgpa) || isNaN(numSubs) || isNaN(avgCredit)) {
    alert('Please fill all fields.'); return;
  }
  if (targetSgpa < 0 || targetSgpa > 10) { alert('Target SGPA must be 0–10.'); return; }

  const totalPoints = targetSgpa * numSubs * avgCredit;
  const totalCredits = numSubs * avgCredit;

  // Grade distribution suggestion
  const grades  = ['O','E','A','B','C','D'];
  const points  = grades.map(g => gradePoints[g]);
  const content = document.getElementById('gradeReqContent');
  const result  = document.getElementById('gradeReqResult');

  let html = `
    <p style="margin-bottom:16px;color:var(--text2)">
      To achieve SGPA <strong>${targetSgpa}</strong> with ${numSubs} subjects (avg ${avgCredit} credits each),
      you need a total of <strong>${totalPoints.toFixed(0)}</strong> grade points from ${totalCredits.toFixed(0)} total credits.
    </p>
    <div class="grade-req-row">
      <span class="grade-req-label">Target SGPA</span>
      <span class="grade-req-value">${targetSgpa}</span>
    </div>
    <div class="grade-req-row">
      <span class="grade-req-label">Total Credits</span>
      <span class="grade-req-value">${totalCredits}</span>
    </div>
    <div class="grade-req-row">
      <span class="grade-req-label">Total Grade Points Needed</span>
      <span class="grade-req-value">${totalPoints.toFixed(1)}</span>
    </div>
    <div class="grade-req-row">
      <span class="grade-req-label">Minimum Average Grade Points/Credit</span>
      <span class="grade-req-value">${targetSgpa}</span>
    </div>`;

  // Recommend a grade mix
  const minGrade = grades.findIndex(g => gradePoints[g] <= targetSgpa);
  const minG     = minGrade === -1 ? 'D' : grades[minGrade < grades.length ? minGrade : grades.length - 1];

  html += `
    <div class="grade-req-row" style="margin-top:8px">
      <span class="grade-req-label">Recommended Minimum Grade</span>
      <span class="grade-req-value" style="color:var(--green-hover)">${minG} (${gradePoints[minG]} pts) in most subjects</span>
    </div>
    <p style="margin-top:14px;font-size:0.8rem;color:var(--muted)">
      * This is an estimate. Actual SGPA depends on individual subject credits and exact grades.
    </p>`;

  content.innerHTML = html;
  result.classList.remove('hidden');
}

// ═══════════════════════════════════════════════
//  PDF EXPORT
// ═══════════════════════════════════════════════
function exportSgpaPdf() {
  if (currentSgpa === null) {
    showToast('Calculate SGPA first before exporting.'); return;
  }

  const key    = getSemKey();
  const data   = semesterData[key];
  const label  = data ? data.label : key;
  const mot    = getMotivation(currentSgpa);

  // Build print content
  const rows = document.querySelectorAll('.subject-row');
  let subjectRows = '';
  let tableRows   = '';

  rows.forEach(row => {
    const name   = row.querySelector('.subject-info h4').textContent;
    const credit = row.dataset.credit;
    const { grade, skip } = getSubjectGrade(row);
    if (skip) return;
    const pts = grade ? gradePoints[grade] : '—';
    tableRows += `<tr>
      <td>${name}</td>
      <td style="text-align:center">${credit}</td>
      <td style="text-align:center">${grade || '—'}</td>
      <td style="text-align:center">${pts}</td>
    </tr>`;
  });

  const hist = getHistory();
  let histRows = '';
  hist.forEach(e => {
    histRows += `<tr>
      <td>${e.label}</td>
      <td style="text-align:center">${e.sgpa.toFixed(2)}</td>
      <td>${getMotivation(e.sgpa).title}</td>
      <td>${e.date}</td>
    </tr>`;
  });

  document.getElementById('printDate').textContent = 'Generated: ' + new Date().toLocaleString('en-IN');
  document.getElementById('printContent').innerHTML = `
    <div class="print-summary">
      <div class="print-summary-card">
        <div class="label">Semester</div>
        <div class="val" style="font-size:0.9rem">${label}</div>
      </div>
      <div class="print-summary-card">
        <div class="label">SGPA</div>
        <div class="val">${currentSgpa.toFixed(2)}</div>
      </div>
      <div class="print-summary-card">
        <div class="label">Performance</div>
        <div class="val" style="font-size:0.9rem">${mot.title}</div>
      </div>
    </div>

    <p class="print-section-title">Subject-wise Grades</p>
    <table class="print-table">
      <thead><tr>
        <th>Subject</th><th>Credits</th><th>Grade</th><th>Grade Points</th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>

    ${hist.length ? `
      <p class="print-section-title">Semester History</p>
      <table class="print-table">
        <thead><tr>
          <th>Semester</th><th>SGPA</th><th>Performance</th><th>Date</th>
        </tr></thead>
        <tbody>${histRows}</tbody>
      </table>
    ` : ''}`;

  window.print();
}

function exportCgpaPdf() {
  const cgpaEl = document.getElementById('cgpa-value');
  if (!cgpaEl || cgpaEl.textContent === '0.00') {
    showToast('Calculate CGPA first before exporting.'); return;
  }

  const cgpa = cgpaEl.textContent;
  const msg  = document.getElementById('cgpa-msg').textContent;
  const hist = getHistory();
  let histRows = '';
  hist.forEach(e => {
    histRows += `<tr>
      <td>${e.label}</td>
      <td style="text-align:center">${e.sgpa.toFixed(2)}</td>
      <td>${getMotivation(e.sgpa).title}</td>
    </tr>`;
  });

  document.getElementById('printDate').textContent = 'Generated: ' + new Date().toLocaleString('en-IN');
  document.getElementById('printContent').innerHTML = `
    <div class="print-summary">
      <div class="print-summary-card">
        <div class="label">CGPA</div>
        <div class="val">${cgpa}</div>
      </div>
      <div class="print-summary-card">
        <div class="label">Performance</div>
        <div class="val" style="font-size:0.9rem">${msg}</div>
      </div>
      <div class="print-summary-card">
        <div class="label">Semesters</div>
        <div class="val">${document.querySelectorAll('.cgpa-sem-input').length}</div>
      </div>
    </div>
    ${histRows ? `
      <p class="print-section-title">Semester-wise SGPA</p>
      <table class="print-table">
        <thead><tr><th>Semester</th><th>SGPA</th><th>Performance</th></tr></thead>
        <tbody>${histRows}</tbody>
      </table>
    ` : ''}`;

  window.print();
}

// ═══════════════════════════════════════════════
//  STATE PERSISTENCE
// ═══════════════════════════════════════════════
function saveState() {
  const rows  = document.querySelectorAll('.subject-row');
  const grades = [];

  rows.forEach((row, i) => {
    const { grade, skip } = getSubjectGrade(row);
    grades.push({ i, grade, skip });
  });

  localStorage.setItem(LS_STATE, JSON.stringify({
    branch: selectedBranch, semester: selectedSemester, grades
  }));
}

function restoreState() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_STATE));
    if (!s) return;

    if (s.branch) {
      const bc = document.querySelector(`.branch-chip[data-branch="${s.branch}"]`);
      if (bc) { bc.classList.add('active'); selectedBranch = s.branch; }
    }
    if (s.semester) {
      const sc = document.querySelector(`.semester-chip[data-semester="${s.semester}"]`);
      if (sc) { sc.classList.add('active'); selectedSemester = s.semester; }
    }
    if (s.branch && s.semester) {
      loadSemesterData();
    }
  } catch {}
}

function clearState() {
  localStorage.removeItem(LS_STATE);
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
}
