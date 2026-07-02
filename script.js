(() => {
  'use strict';

  /* ═══════════════════════════════════════════
     i18n — TRANSLATIONS
     ═══════════════════════════════════════════ */
  const I18N = {
    en: {
      tag: 'Bac II',
      heroDesc: 'Enter your exam subject scores below.',
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
      footer: '© 2026 BACCASIO — probablykalvin.xyz',
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
          'Moral and Civic',
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
      thBreakdownPct: 'Percentage',
      saveBtn: 'Save',
      shareBtn: 'Share',
      copyLink: 'Copy Link',
      downloadImage: 'Download Image',
      saveModalTitle: 'Save Score Profile',
      scoreNameLabel: 'Profile Name',
      scoreNamePlaceholder: 'e.g. Target Score',
      confirmSaveBtn: 'Save Profile',
      scoresModalTitle: 'My Saved Scores',
      loadingShare: '⏳ Loading...',
      copiedPopup: 'Link copied to clipboard!'
    },
    kh: {
      tag: 'បាក់ II',
      heroDesc: 'បញ្ចូលពិន្ទុមុខវិជ្ជាខាងក្រោម។',
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
      footer: '© ២០២៦ BACCASIO — probablykalvin.xyz',
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
      thBreakdownPct: 'ភាគរយ',
      saveBtn: 'រក្សាទុក',
      shareBtn: 'ចែករំលែក',
      copyLink: 'ចម្លងតំណ',
      downloadImage: 'ទាញយករូបភាព',
      saveModalTitle: 'រក្សាទុកពិន្ទុប្រឡង',
      scoreNameLabel: 'ឈ្មោះពិន្ទុប្រឡង',
      scoreNamePlaceholder: 'ឧទាហរណ៍៖ ពិន្ទុគោលដៅ',
      confirmSaveBtn: 'រក្សាទុក',
      scoresModalTitle: 'ពិន្ទុប្រឡងដែលបានរក្សាទុករបស់ខ្ញុំ',
      loadingShare: '⏳ កំពុងដំណើរការ...',
      copiedPopup: 'តំណត្រូវបានចម្លង!'
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('baccasio-lang');
    if (saved === 'en' || saved === 'kh') currentLang = saved;
  } catch (e) {}

  function t() { return I18N[currentLang]; }



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
  const langToggle = document.getElementById('lang-toggle');
  const currentLangLabel = document.getElementById('current-lang-label');

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

  /* ── Theme logic removed (dark theme permanent) ── */

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

    // Update language toggle text
    if (currentLangLabel) {
      currentLangLabel.textContent = currentLang.toUpperCase();
    }

    // Rebuild subjects with translated names
    buildSubjects(currentTrack);

    // Update breakdown header translations
    document.getElementById('breakdown-title-text').textContent = tr.breakdownTitle;
    document.getElementById('th-breakdown-subject').textContent = tr.thBreakdownSubject;
    document.getElementById('th-breakdown-score').textContent = tr.thBreakdownScore;
    document.getElementById('th-breakdown-pct').textContent = tr.thBreakdownPct;

    const saveBtnLabel = document.getElementById('save-btn-label');
    if (saveBtnLabel) saveBtnLabel.textContent = tr.saveBtn;
    const shareBtnLabel = document.getElementById('share-btn-label');
    if (shareBtnLabel) shareBtnLabel.textContent = tr.shareBtn;
    const modalCopyLabel = document.getElementById('modal-copy-label');
    if (modalCopyLabel) modalCopyLabel.textContent = tr.copyLink;
    const modalDownloadLabel = document.getElementById('modal-download-label');
    if (modalDownloadLabel) modalDownloadLabel.textContent = tr.downloadImage;
    const saveModalTitle = document.getElementById('save-modal-title');
    if (saveModalTitle) saveModalTitle.textContent = tr.saveModalTitle;
    const scoreNameLabel = document.getElementById('score-name-label');
    if (scoreNameLabel) scoreNameLabel.textContent = tr.scoreNameLabel;
    const scoreNameInput = document.getElementById('score-name-input');
    if (scoreNameInput) scoreNameInput.placeholder = tr.scoreNamePlaceholder;
    const confirmSaveBtn = document.getElementById('confirm-save-btn');
    if (confirmSaveBtn) confirmSaveBtn.textContent = tr.confirmSaveBtn;
    const scoresModalTitle = document.getElementById('scores-modal-title');
    if (scoresModalTitle) scoresModalTitle.textContent = tr.scoresModalTitle;

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
        <td style="font-family: 'JetBrains Mono', monospace; color: var(--text-primary); font-weight: 500; white-space: nowrap;">
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

  /* ── Share Modal Logic ── */
  const shareBtn = document.getElementById('share-btn');
  const shareContainer = document.getElementById('share-container');
  const shareModal = document.getElementById('share-modal');
  const modalClose = document.getElementById('modal-close');
  const modalPreview = document.getElementById('modal-preview');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const modalDownloadBtn = document.getElementById('modal-download-btn');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'var(--bg-card)';
    toast.style.color = 'var(--text-primary)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = 'var(--shadow)';
    toast.style.zIndex = '9999';
    toast.style.border = '1px solid var(--border)';
    toast.style.fontFamily = 'inherit';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, -10px)';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 0)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  if (shareBtn && shareModal) {
    shareBtn.addEventListener('click', () => {
      if (typeof html2canvas === 'undefined') {
        alert('Image generation library not loaded.');
        return;
      }
      
      const originalText = shareBtn.innerHTML;
      shareBtn.innerHTML = t().loadingShare;
      shareBtn.disabled = true;

      // Create an off-screen wrapper for the screenshot
      const clone = resultCard.cloneNode(true);
      clone.querySelector('#share-container').style.display = 'none';
      
      // Clear sparkle particles so they don't get captured mid-flight
      const clonedSparkles = clone.querySelector('#sparkle-container');
      if (clonedSparkles) clonedSparkles.innerHTML = '';
      
      clone.classList.remove('show'); // Remove the glow animation pseudo-element
      clone.style.backdropFilter = 'none';
      clone.style.webkitBackdropFilter = 'none';
      clone.style.width = resultCard.offsetWidth + 'px';
      clone.style.margin = '0';
      
      const wrapper = document.createElement('div');
      wrapper.style.padding = '40px';
      wrapper.style.paddingBottom = '30px';
      wrapper.style.background = document.body.getAttribute('data-theme') === 'light' ? '#f5f5f7' : '#0a0a0c';
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '-9999px';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      
      const headerLogo = document.createElement('div');
      headerLogo.style.textAlign = 'center';
      headerLogo.style.marginBottom = '24px';
      headerLogo.innerHTML = `
        <h2 style="font-family: 'Inter', sans-serif; font-size: 2rem; font-weight: 900; letter-spacing: -.04em; margin: 0; color: var(--text-primary);">BACCA<span style="color: var(--accent);">SIO</span></h2>
        <p style="font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); margin: 6px 0 0 0;">by probablykalvin (Reach)</p>
      `;
      wrapper.appendChild(headerLogo);
      
      wrapper.appendChild(clone);
      
      // Add watermark
      const watermark = document.createElement('div');
      const footerEl = document.getElementById('footer-text');
      watermark.textContent = footerEl ? footerEl.textContent : '© 2026 BACCASIO — probablykalvin.xyz';
      watermark.style.textAlign = 'center';
      watermark.style.marginTop = '24px';
      watermark.style.fontSize = '0.75rem';
      watermark.style.color = 'var(--text-tertiary)';
      wrapper.appendChild(watermark);

      document.body.appendChild(wrapper);

      html2canvas(wrapper, {
        scale: 2,
        backgroundColor: null
      }).then(canvas => {
        document.body.removeChild(wrapper);
        shareBtn.innerHTML = originalText;
        shareBtn.disabled = false;

        const dataUrl = canvas.toDataURL('image/png');
        modalPreview.innerHTML = `<img src="${dataUrl}" alt="Score Card Preview" style="width: 100%; border-radius: 12px; box-shadow: var(--shadow);" />`;
        
        // Reset copy box state
        modalCopyBtn.style.display = '';
        const linkBox = document.getElementById('link-box-container');
        if (linkBox) linkBox.style.display = 'none';

        // Open modal
        shareModal.classList.remove('hidden');
      }).catch(err => {
        console.error('Failed to generate image', err);
        if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
        shareBtn.innerHTML = originalText;
        shareBtn.disabled = false;
        alert('Could not generate preview.');
      });
    });

    modalClose.addEventListener('click', () => {
      shareModal.classList.add('hidden');
    });

    // Close when clicking outside of modal content
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        shareModal.classList.add('hidden');
      }
    });

    modalCopyBtn.addEventListener('click', () => {
      const inputs = grid.querySelectorAll('input');
      const scores = Array.from(inputs).map(inp => inp.value || 0).join('-');
      const prefix = currentTrack === 'science' ? 'sci' : 'soc';
      const payload = prefix + '-' + scores;
      const encoded = btoa(payload).replace(/=/g, ''); // Short, clean base64 string
      
      const url = new URL(window.location.href);
      url.search = ''; // Clear other params
      url.searchParams.set('s', encoded);
      const urlString = url.toString();
      
      navigator.clipboard.writeText(urlString).then(() => {
        modalCopyBtn.style.display = 'none';
        const linkBox = document.getElementById('link-box-container');
        if (linkBox) {
          linkBox.style.display = 'flex';
          const linkInput = document.getElementById('share-link-input');
          if (linkInput) {
            linkInput.value = urlString;
            linkInput.select();
          }
        }
        showToast(t().copiedPopup);
      });
    });

    const modalCopyIconBtn = document.getElementById('modal-copy-icon-btn');
    if (modalCopyIconBtn) {
      modalCopyIconBtn.addEventListener('click', () => {
        const linkInput = document.getElementById('share-link-input');
        if (linkInput) {
          linkInput.select();
          navigator.clipboard.writeText(linkInput.value).then(() => {
            const originalText = modalCopyIconBtn.innerHTML;
            modalCopyIconBtn.innerHTML = '✅';
            setTimeout(() => {
              modalCopyIconBtn.innerHTML = originalText;
            }, 2000);
            showToast(t().copiedPopup);
          });
        }
      });
    }

    modalDownloadBtn.addEventListener('click', () => {
      const img = modalPreview.querySelector('img');
      if (img) {
        const link = document.createElement('a');
        link.download = `baccasio-score-${Date.now()}.png`;
        link.href = img.src;
        link.click();
      }
    });
  }

  /* ── Init ── */
  applyLanguage();

  /* ── URL State Parsing ── */
  const params = new URLSearchParams(window.location.search);
  const sParam = params.get('s');
  const oldTrack = params.get('track'); // Keep backwards compatibility
  
  if (sParam || oldTrack) {
    let sharedTrack = null;
    let scoreArr = [];
    
    if (sParam) {
      try {
        let b64 = sParam;
        while (b64.length % 4 > 0) b64 += '=';
        const decoded = atob(b64);
        const parts = decoded.split('-');
        if (parts.length >= 8) {
          sharedTrack = parts[0] === 'soc' ? 'social' : 'science';
          scoreArr = parts.slice(1);
        }
      } catch (e) {
        console.error('Invalid share link format.');
      }
    } else if (oldTrack) {
      sharedTrack = oldTrack;
      const oldScores = params.get('scores');
      if (oldScores) scoreArr = oldScores.split(',');
    }
    
    if (sharedTrack && SUBJECT_MAX[sharedTrack]) {
      // Select the correct track
      const trackBtn = document.querySelector(`.track-btn[data-track="${sharedTrack}"]`);
      if (trackBtn) trackBtn.click();
      
      const inputs = grid.querySelectorAll('input');
      inputs.forEach((inp, i) => {
        if (scoreArr[i] !== undefined) {
          inp.value = scoreArr[i];
        }
      });
      
      // Clear URL query parameters so a manual refresh doesn't loop the shared scores
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Calculate automatically after a short delay
      setTimeout(calculate, 100);
    }
  }

  /* ── Saving Profiles Logic ── */
  let savedProfiles = [];
  try {
    savedProfiles = JSON.parse(localStorage.getItem('baccasio_saved_profiles') || '[]');
  } catch (e) {
    savedProfiles = [];
  }

  const myScoresBtn = document.getElementById('my-scores-btn');
  const scoresModal = document.getElementById('scores-modal');
  const scoresList = document.getElementById('saved-scores-list');
  const saveScoreBtn = document.getElementById('save-score-btn');
  const saveModal = document.getElementById('save-modal');
  const confirmSaveBtn = document.getElementById('confirm-save-btn');
  const saveNameInput = document.getElementById('score-name-input');

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  function renderSavedScores() {
    if (savedProfiles.length === 0) {
      scoresList.innerHTML = `<div class="empty-state" id="empty-scores-text">No saved profiles yet.</div>`;
      return;
    }
    scoresList.innerHTML = '';
    savedProfiles.forEach(profile => {
      const item = document.createElement('div');
      item.className = 'saved-score-item';
      const trackName = profile.track === 'science' ? 'Science' : 'Social Science';
      item.innerHTML = `
        <div class="saved-score-info">
          <div class="saved-score-name">${escapeHTML(profile.name)}</div>
          <div class="saved-score-details">${trackName} • ${profile.total} pts</div>
        </div>
        <div class="saved-score-actions">
          <button class="btn-delete" aria-label="Delete">🗑️</button>
        </div>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete')) return;
        
        const trackBtn = document.querySelector(`.track-btn[data-track="${profile.track}"]`);
        if (trackBtn) trackBtn.click();
        
        const inputs = grid.querySelectorAll('input');
        inputs.forEach((inp, i) => {
          inp.value = profile.scores[i] !== undefined ? profile.scores[i] : '';
        });
        
        scoresModal.classList.add('hidden');
        setTimeout(calculate, 100);
      });

      const deleteBtn = item.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this saved score?')) {
          savedProfiles = savedProfiles.filter(p => p.id !== profile.id);
          localStorage.setItem('baccasio_saved_profiles', JSON.stringify(savedProfiles));
          renderSavedScores();
        }
      });
      scoresList.appendChild(item);
    });
  }

  if (myScoresBtn && scoresModal) {
    myScoresBtn.addEventListener('click', () => {
      renderSavedScores();
      scoresModal.classList.remove('hidden');
    });
    document.getElementById('scores-modal-close').addEventListener('click', () => scoresModal.classList.add('hidden'));
    scoresModal.addEventListener('click', (e) => { if(e.target === scoresModal) scoresModal.classList.add('hidden'); });
  }

  if (saveScoreBtn && saveModal) {
    saveScoreBtn.addEventListener('click', () => {
      saveNameInput.value = '';
      saveModal.classList.remove('hidden');
      saveNameInput.focus();
    });
    
    document.getElementById('save-modal-close').addEventListener('click', () => saveModal.classList.add('hidden'));
    saveModal.addEventListener('click', (e) => { if(e.target === saveModal) saveModal.classList.add('hidden'); });
    
    saveNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmSaveBtn.click();
      }
    });
    
    confirmSaveBtn.addEventListener('click', () => {
      const name = saveNameInput.value.trim() || 'Untitled Score';
      const inputs = grid.querySelectorAll('input');
      const scores = Array.from(inputs).map(inp => inp.value || 0);
      const totalScoreText = document.getElementById('score-value').textContent;
      
      const profile = {
        id: Date.now().toString(),
        name: name,
        track: currentTrack,
        scores: scores,
        total: totalScoreText
      };
      
      savedProfiles.push(profile);
      localStorage.setItem('baccasio_saved_profiles', JSON.stringify(savedProfiles));
      
      const originalText = confirmSaveBtn.innerHTML;
      confirmSaveBtn.innerHTML = '✅ Saved!';
      setTimeout(() => {
        confirmSaveBtn.innerHTML = originalText;
        saveModal.classList.add('hidden');
      }, 1000);
    });
  }
})();
