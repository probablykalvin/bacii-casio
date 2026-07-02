(() => {
  'use strict';

  /* ═══════════════════════════════════════════
     i18n — TRANSLATIONS
     ═══════════════════════════════════════════ */
  const I18N = {
    en: {
      tag: 'Bac II',
      heroDesc: 'Enter your seven Cambodian Bac II exam subject scores below. Instantly see your total and letter grade.',
      cardTitle: 'Exam Scores',
      trackScience: 'Science',
      trackSocial: 'Social Science',
      calcBtn: 'Calculate Grade',
      tableTitle: 'Grading Scale',
      thGrade: 'Grade',
      thRange: 'Score Range',
      thStatus: 'Status',
      pass: 'Pass',
      fail: 'Fail',
      footer: '© 2026 BACCASIO — Built for Cambodian students 🇰🇭',
      gradeRequires: (letter, min, max) => `Grade <strong>${letter}</strong> requires <strong>${min}–${max}</strong> points`,
      subjects: {
        science: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Biology',
          'Khmer Literature',
          'Foreign Language',
          'Chosen Subject'
        ],
        social: [
          'Khmer Literature',
          'History',
          'Geography',
          'Morality',
          'Mathematics',
          'Foreign Language',
          'Chosen Subject'
        ]
      },
      errValid: 'Enter a valid number',
      errNegative: 'Score cannot be negative',
      errMax: (n) => `Max score is ${n}`,
      errDecimal: 'Whole numbers only',
      max: 'max',
      breakdownTitle: 'Detailed Breakdown',
      thBreakdownSubject: 'Subject',
      thBreakdownScore: 'Score',
      thBreakdownPct: 'Percentage'
    },
    kh: {
      tag: 'បាក់ II',
      heroDesc: 'បញ្ចូលពិន្ទុមុខវិជ្ជាទាំង ៧ នៃការប្រឡងបាក់ II ខាងក្រោម។ មើលពិន្ទុសរុប និងកម្រិតរបស់អ្នកភ្លាមៗ។',
      cardTitle: 'ពិន្ទុប្រឡង',
      trackScience: 'វិទ្យាសាស្ត្រ',
      trackSocial: 'វិទ្យាសាស្ត្រសង្គម',
      calcBtn: 'គណនាពិន្ទុ',
      tableTitle: 'ខ្នាតចំណាត់ថ្នាក់',
      thGrade: 'កម្រិត',
      thRange: 'ចន្លោះពិន្ទុ',
      thStatus: 'ស្ថានភាព',
      pass: 'ជាប់',
      fail: 'ធ្លាក់',
      footer: '© ២០២៦ BACCASIO — បង្កើតសម្រាប់សិស្សកម្ពុជា 🇰🇭',
      gradeRequires: (letter, min, max) => `កម្រិត <strong>${letter}</strong> ត្រូវការ <strong>${min}–${max}</strong> ពិន្ទុ`,
      subjects: {
        science: [
          'គណិតវិទ្យា',
          'រូបវិទ្យា',
          'គីមីវិទ្យា',
          'ជីវវិទ្យា',
          'អក្សរសាស្ត្រខ្មែរ',
          'ភាសាបរទេស',
          'មុខវិជ្ជាជ្រើសរើស'
        ],
        social: [
          'អក្សរសាស្ត្រខ្មែរ',
          'ប្រវត្តិវិទ្យា',
          'ភូមិវិទ្យា',
          'សីលធម៌',
          'គណិតវិទ្យា',
          'ភាសាបរទេស',
          'មុខវិជ្ជាជ្រើសរើស'
        ]
      },
      errValid: 'បញ្ចូលលេខត្រឹមត្រូវ',
      errNegative: 'ពិន្ទុមិនអាចអវិជ្ជមាន',
      errMax: (n) => `ពិន្ទុអតិបរមា ${n}`,
      errDecimal: 'លេខគត់ប៉ុណ្ណោះ',
      max: 'អតិបរមា',
      breakdownTitle: 'របាយការណ៍លម្អិត',
      thBreakdownSubject: 'មុខវិជ្ជា',
      thBreakdownScore: 'ពិន្ទុ',
      thBreakdownPct: 'ភាគរយ'
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('baccasio-lang');
    if (saved === 'en' || saved === 'kh') currentLang = saved;
  } catch (e) {}

  function t() { return I18N[currentLang]; }

  /* ═══════════════════════════════════════════
     INTERACTIVE DOT GRID BACKGROUND
     ═══════════════════════════════════════════ */
  const canvas = document.getElementById('dot-canvas');
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: -9999, y: -9999 };
  const DOT_SPACING = 28;
  const DOT_RADIUS = 1.2;
  const INFLUENCE_RADIUS = 120;

  function getAccentRGB() {
    return { r: 88, g: 101, b: 242 };
  }

  function getBaseGray() {
    const theme = document.body.getAttribute('data-theme');
    return theme === 'light'
      ? { r: 0, g: 0, b: 0, a: 0.08 }
      : { r: 255, g: 255, b: 255, a: 0.08 };
  }

  function initDots() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = [];
    const cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
    const rows = Math.ceil(canvas.height / DOT_SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * DOT_SPACING,
          y: r * DOT_SPACING,
          glow: 0,
          fading: false
        });
      }
    }
  }

  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const base = getBaseGray();
    const accent = getAccentRGB();

    for (const dot of dots) {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INFLUENCE_RADIUS) {
        const proximity = 1 - (dist / INFLUENCE_RADIUS);
        dot.glow = Math.min(1, dot.glow + proximity * 0.15);
        dot.fading = false;
      } else {
        dot.fading = true;
      }

      if (dot.fading && dot.glow > 0) {
        dot.glow *= 0.94;
        if (dot.glow < 0.005) dot.glow = 0;
      }

      const g = dot.glow;
      const r = base.r + (accent.r - base.r) * g;
      const gn = base.g + (accent.g - base.g) * g;
      const b = base.b + (accent.b - base.b) * g;
      const a = base.a + (1 - base.a) * g * 0.7;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS + g * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(gn)}, ${Math.round(b)}, ${a.toFixed(3)})`;
      ctx.fill();

      if (g > 0.3) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS + g * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${(g * 0.1).toFixed(3)})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(drawDots);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', () => {
    initDots();
  });

  initDots();
  drawDots();

  /* ═══════════════════════════════════════════
     GRADE CALCULATOR LOGIC
     ═══════════════════════════════════════════ */

  /* ── Per-subject max scores (Bac II scoring) ── */
  const SUBJECT_MAX = {
    science: [125, 75, 75, 75, 75, 50, 50],
    social:  [125, 75, 75, 75, 75, 50, 75]
  };

  const MAX_SCORE = 500;

  /* ── Grade thresholds ── */
  const GRADES = [
    { letter: 'A', min: 427, max: 500, color: 'var(--grade-a)' },
    { letter: 'B', min: 380, max: 426, color: 'var(--grade-b)' },
    { letter: 'C', min: 332, max: 379, color: 'var(--grade-c)' },
    { letter: 'D', min: 285, max: 331, color: 'var(--grade-d)' },
    { letter: 'E', min: 237, max: 284, color: 'var(--grade-e)' },
    { letter: 'F', min: 0,   max: 236, color: 'var(--grade-f)' }
  ];

  /* ── DOM refs ── */
  const grid = document.getElementById('subjects-grid');
  const calcBtn = document.getElementById('calculate-btn');
  const resultCard = document.getElementById('result-card');
  const gradeLetter = document.getElementById('grade-letter');
  const gradeDisplay = document.getElementById('grade-display');
  const gradeStatus = document.getElementById('grade-status');
  const scoreValue = document.getElementById('score-value');
  const progressFill = document.getElementById('progress-fill');
  const percentageText = document.getElementById('percentage-text');
  const gradeRangeText = document.getElementById('grade-range-text');
  const gradeTable = document.getElementById('grade-table');
  const sparkleContainer = document.getElementById('sparkle-container');
  const themeToggle = document.getElementById('theme-toggle');
  const langToggle = document.getElementById('lang-toggle');
  const langEnLabel = document.getElementById('lang-en-label');
  const langKhLabel = document.getElementById('lang-kh-label');

  let currentTrack = 'science';
  let lastResult = null; // stores { total, grade, pct } for language re-translation

  /* ── Build subject inputs ── */
  function buildSubjects(track) {
    const subjects = t().subjects[track];
    const maxes = SUBJECT_MAX[track];
    const existingValues = [];
    grid.querySelectorAll('input').forEach((inp, i) => {
      existingValues[i] = inp.value;
    });

    grid.innerHTML = '';
    subjects.forEach((name, i) => {
      const maxVal = maxes[i];
      const div = document.createElement('div');
      div.className = 'subject-field';
      div.innerHTML = `
        <label for="subject-${i}">${name} <span style="opacity:.5;font-weight:400">(${t().max} ${maxVal})</span></label>
        <input
          type="number"
          id="subject-${i}"
          name="subject-${i}"
          placeholder="0"
          min="0"
          max="${maxVal}"
          data-max="${maxVal}"
          inputmode="numeric"
          autocomplete="off"
        />
        <div class="error-msg" id="error-${i}"></div>
      `;
      const input = div.querySelector('input');
      if (existingValues[i] !== undefined) input.value = existingValues[i];

      input.addEventListener('input', () => {
        validateField(div, input, maxVal);
      });

      grid.appendChild(div);
    });
  }

  /* ── Validate a single field ── */
  function validateField(fieldEl, inputEl, maxVal) {
    const raw = inputEl.value.trim();
    const errorEl = fieldEl.querySelector('.error-msg');

    fieldEl.classList.remove('error', 'shake');

    if (raw === '') {
      errorEl.textContent = '';
      return true;
    }

    const val = parseFloat(raw);

    if (isNaN(val) || !isFinite(val)) {
      fieldEl.classList.add('error');
      errorEl.textContent = t().errValid;
      return false;
    }

    if (val < 0) {
      fieldEl.classList.add('error');
      errorEl.textContent = t().errNegative;
      return false;
    }

    if (val > maxVal) {
      fieldEl.classList.add('error');
      errorEl.textContent = t().errMax(maxVal);
      return false;
    }

    if (!Number.isInteger(val)) {
      fieldEl.classList.add('error');
      errorEl.textContent = t().errDecimal;
      return false;
    }

    errorEl.textContent = '';
    return true;
  }

  /* ── Track toggle ── */
  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.track-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTrack = btn.dataset.track;
      buildSubjects(currentTrack);
    });
  });

  /* ── Theme toggle ── */
  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('baccasio-theme', theme); } catch (e) {}
  }

  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  setTheme(document.body.getAttribute('data-theme') || 'dark');

  /* ── Language toggle ── */
  function applyLanguage() {
    const tr = t();
    document.getElementById('topbar-tag').textContent = tr.tag;
    document.getElementById('hero-desc').textContent = tr.heroDesc;
    document.getElementById('card-title').textContent = tr.cardTitle;
    document.getElementById('track-science').textContent = tr.trackScience;
    document.getElementById('track-social').textContent = tr.trackSocial;
    calcBtn.textContent = tr.calcBtn;
    document.getElementById('table-title').textContent = tr.tableTitle;
    document.getElementById('th-grade').textContent = tr.thGrade;
    document.getElementById('th-range').textContent = tr.thRange;
    document.getElementById('th-status').textContent = tr.thStatus;
    document.getElementById('footer-text').textContent = tr.footer;

    // Update table pass/fail badges
    document.querySelectorAll('[data-pass-badge]').forEach(el => { el.textContent = tr.pass; });
    document.querySelectorAll('[data-fail-badge]').forEach(el => { el.textContent = tr.fail; });

    // Update language toggle highlighting
    langEnLabel.classList.toggle('lang-active', currentLang === 'en');
    langKhLabel.classList.toggle('lang-active', currentLang === 'kh');

    // Rebuild subjects with translated names
    buildSubjects(currentTrack);

    // Update breakdown header translations
    document.getElementById('breakdown-title-text').textContent = tr.breakdownTitle;
    document.getElementById('th-breakdown-subject').textContent = tr.thBreakdownSubject;
    document.getElementById('th-breakdown-score').textContent = tr.thBreakdownScore;
    document.getElementById('th-breakdown-pct').textContent = tr.thBreakdownPct;

    // Re-translate the result card if it's visible
    if (lastResult && !resultCard.classList.contains('hidden')) {
      const isPass = lastResult.grade.letter !== 'F';
      gradeStatus.textContent = isPass ? tr.pass : tr.fail;
      gradeRangeText.innerHTML = tr.gradeRequires(lastResult.grade.letter, lastResult.grade.min, lastResult.grade.max);
      // Re-build breakdown table
      buildBreakdownTable();
    }

    // Update html lang
    document.documentElement.lang = currentLang === 'kh' ? 'km' : 'en';

    try { localStorage.setItem('baccasio-lang', currentLang); } catch (e) {}
  }

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'kh' : 'en';
    applyLanguage();
  });

  /* ── Get grade ── */
  function getGrade(total) {
    for (const g of GRADES) {
      if (total >= g.min && total <= g.max) return g;
    }
    return GRADES[GRADES.length - 1];
  }

  /* ── Animated counter ── */
  function animateCounter(el, target, duration = 600) {
    const start = parseInt(el.textContent) || 0;
    const startTime = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ── Spawn sparkle particles ── */
  function spawnSparkles(color, count = 24) {
    sparkleContainer.innerHTML = '';
    const rect = sparkleContainer.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'sparkle';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - .5) * .4;
      const dist = 60 + Math.random() * 100;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist;
      spark.style.cssText = `
        left: ${cx}px;
        top: ${cy}px;
        width: ${3 + Math.random() * 4}px;
        height: ${3 + Math.random() * 4}px;
        background: ${color};
        --sx: ${sx}px;
        --sy: ${sy}px;
        animation-delay: ${Math.random() * .15}s;
        animation-duration: ${.6 + Math.random() * .5}s;
      `;
      sparkleContainer.appendChild(spark);
    }

    setTimeout(() => { sparkleContainer.innerHTML = ''; }, 1500);
  }

  /* ── Detailed Breakdown Table Builder ── */
  function buildBreakdownTable() {
    const tr = t();
    const tbody = document.getElementById('breakdown-tbody');
    tbody.innerHTML = '';

    const subjects = tr.subjects[currentTrack];
    const maxes = SUBJECT_MAX[currentTrack];
    const inputs = grid.querySelectorAll('input');

    subjects.forEach((name, i) => {
      const input = inputs[i];
      const val = input ? parseFloat(input.value) : 0;
      const scoreVal = isNaN(val) ? 0 : val;
      const maxVal = maxes[i];
      const subPct = ((scoreVal / maxVal) * 100).toFixed(0);

      let badgeClass = 'badge-neutral';
      if (subPct >= 80) {
        badgeClass = 'badge-pass';
      } else if (subPct < 50) {
        badgeClass = 'badge-fail';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${name}</td>
        <td style="font-family: 'JetBrains Mono', monospace; color: var(--text-primary); font-weight: 500;">
          ${scoreVal} <span style="opacity: 0.45; font-size: 0.75rem; font-weight: 400;">/ ${maxVal}</span>
        </td>
        <td>
          <span class="${badgeClass}" style="display: inline-block; min-width: 45px; text-align: center;">${subPct}%</span>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  /* ── Calculate ── */
  function calculate() {
    const fields = grid.querySelectorAll('.subject-field');
    const maxes = SUBJECT_MAX[currentTrack];
    let total = 0;
    let hasErrors = false;

    fields.forEach((field, i) => {
      const input = field.querySelector('input');
      const maxVal = maxes[i];
      const valid = validateField(field, input, maxVal);

      if (!valid) {
        hasErrors = true;
        field.classList.remove('shake');
        void field.offsetWidth;
        field.classList.add('shake');
      } else {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
          // Foreign Language is index 5 — deduct 25 internally
          total += (i === 5) ? Math.max(val - 25, 0) : val;
        }
      }
    });

    if (hasErrors) {
      const firstError = grid.querySelector('.subject-field.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.querySelector('input').focus();
      }
      return;
    }

    total = Math.min(total, MAX_SCORE);
    total = Math.max(total, 0);

    const grade = getGrade(total);
    const pct = ((total / MAX_SCORE) * 100).toFixed(1);

    // Store result for language re-translation
    lastResult = { total, grade, pct };
    
    // Build detailed breakdown table
    buildBreakdownTable();

    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth;
    progressFill.style.transition = 'width .8s cubic-bezier(.16, 1, .3, 1), background .3s ease';

    resultCard.classList.remove('hidden');
    resultCard.classList.remove('show');
    void resultCard.offsetWidth;
    resultCard.classList.add('show');

    gradeLetter.textContent = grade.letter;
    gradeLetter.style.color = grade.color;
    gradeLetter.classList.remove('animate');
    void gradeLetter.offsetWidth;
    gradeLetter.classList.add('animate');

    gradeDisplay.classList.remove('glow-active');
    void gradeDisplay.offsetWidth;
    gradeDisplay.classList.add('glow-active');

    const computedColor = getComputedStyle(document.documentElement).getPropertyValue(
      grade.color.replace('var(', '').replace(')', '')
    ).trim() || '#5865F2';
    spawnSparkles(computedColor);

    const isPass = grade.letter !== 'F';
    gradeStatus.textContent = isPass ? t().pass : t().fail;
    gradeStatus.className = `grade-status ${isPass ? 'pass' : 'fail'}`;

    animateCounter(scoreValue, total);

    setTimeout(() => {
      progressFill.style.width = `${pct}%`;
      progressFill.style.background = grade.color;
    }, 150);

    percentageText.textContent = `${pct}%`;

    gradeRangeText.innerHTML = t().gradeRequires(grade.letter, grade.min, grade.max);

    gradeTable.querySelectorAll('tbody tr').forEach(row => {
      row.classList.toggle('current-row', row.dataset.grade === grade.letter);
    });

    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  calcBtn.addEventListener('click', calculate);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
      e.preventDefault();
      calculate();
    }
  });

  /* ── Random fill button ── */
  document.getElementById('random-btn').addEventListener('click', () => {
    const maxes = SUBJECT_MAX[currentTrack];
    const inputs = grid.querySelectorAll('input');
    inputs.forEach((inp, i) => {
      inp.value = Math.floor(Math.random() * (maxes[i] + 1));
      // Clear any lingering errors
      const field = inp.closest('.subject-field');
      field.classList.remove('error', 'shake');
      const errEl = field.querySelector('.error-msg');
      if (errEl) errEl.textContent = '';
    });
  });

  /* ── Init ── */
  applyLanguage();
})();
