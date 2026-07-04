(() => {
  'use strict';

  /* ═══════════════════════════════════════════
     i18n — TRANSLATIONS FOR COMPARE PAGE
     ═══════════════════════════════════════════ */
  const I18N = {
    en: {
      compareTag: 'Compare',
      heroTitle: 'Compare <span class="accent">Scores</span>',
      heroDesc: 'Analyze and compare your saved score profiles',
      overviewTitle: 'Score Progress',
      selectorTitle: 'Compare Two Profiles',
      profileALabel: 'First Profile',
      profileBLabel: 'Second Profile',
      improvementLabel: 'Biggest Improvement',
      attentionLabel: 'Needs Attention',
      radarTitle: 'Strengths vs Weaknesses',
      barTitle: 'Direct Match-Up',
      tableTitle: 'Score Comparison',
      thSubject: 'Subject',
      thDiff: 'Difference',
      totalLabel: 'Total',
      totalScoreLabel: 'Total Score',
      footer: '© 2026 BACCASIO — probablykalvin.xyz | <a href="https://github.com/probablykalvin/bacii-casio" target="_blank" rel="noopener noreferrer">View Source</a>',
      subjects: {
        science: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Khmer Literature', 'Foreign Language', 'Chosen Subject'],
        social: ['Khmer Literature', 'History', 'Geography', 'Moral and Civic', 'Mathematics', 'Foreign Language', 'Chosen Subject']
      }
    },
    kh: {
      compareTag: 'ប្រៀបធៀប',
      heroTitle: 'ប្រៀបធៀប<span class="accent">ពិន្ទុ</span>',
      heroDesc: 'វិភាគ និងប្រៀបធៀបពិន្ទុដែលបានរក្សាទុក',
      overviewTitle: 'វឌ្ឍនភាពពិន្ទុ',
      selectorTitle: 'ប្រៀបធៀបពិន្ទុពីរ',
      profileALabel: 'ប្រវត្តិពិន្ទុទីមួយ',
      profileBLabel: 'ប្រវត្តិពិន្ទុទីពីរ',
      improvementLabel: 'ចំណុចល្អ',
      attentionLabel: 'ត្រូវការយកចិត្តទុកដាក់',
      radarTitle: 'ចំណុចខ្លាំង និង ចំណុចខ្សោយ',
      barTitle: 'ការប្រៀបធៀបតាមមុខវិជ្ជានីមួយៗ',
      tableTitle: 'តារាងប្រៀបធៀបពិន្ទុ',
      thSubject: 'មុខវិជ្ជា',
      thDiff: 'ភាពខុសគ្នា',
      totalLabel: 'សរុប',
      totalScoreLabel: 'ពិន្ទុសរុប',
      footer: '© ២០២៦ BACCASIO — probablykalvin.xyz | <a href="https://github.com/probablykalvin/bacii-casio" target="_blank" rel="noopener noreferrer">View Source</a>',
      subjects: {
        science: ['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'អក្សរសាស្ត្រខ្មែរ', 'ភាសាបរទេស', 'មុខវិជ្ជាជ្រើសរើស'],
        social: ['អក្សរសាស្ត្រខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌', 'គណិតវិទ្យា', 'ភាសាបរទេស', 'មុខវិជ្ជាជ្រើសរើស']
      }
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('baccasio-lang');
    if (saved === 'en' || saved === 'kh') currentLang = saved;
  } catch (e) {}

  function t() { return I18N[currentLang]; }

  /* ═══════════════════════════════════════════
     SUBJECT DATA & THRESHOLDS
     ═══════════════════════════════════════════ */
  const SUBJECT_MAX = {
    science: [125, 75, 75, 75, 75, 50, 50],
    social:  [125, 75, 75, 75, 75, 50, 75]
  };

  const GRADES = [
    { letter: 'A', min: 427, max: 500, color: 'var(--grade-a)' },
    { letter: 'B', min: 380, max: 426, color: 'var(--grade-b)' },
    { letter: 'C', min: 332, max: 379, color: 'var(--grade-c)' },
    { letter: 'D', min: 285, max: 331, color: 'var(--grade-d)' },
    { letter: 'E', min: 237, max: 284, color: 'var(--grade-e)' },
    { letter: 'F', min: 0,   max: 236, color: 'var(--grade-f)' }
  ];

  const GRADE_COLORS = {
    A: { text: 'var(--grade-a)', bg: 'rgba(72, 199, 142, 0.12)' },
    B: { text: 'var(--grade-b)', bg: 'rgba(88, 101, 242, 0.12)' },
    C: { text: 'var(--grade-c)', bg: 'rgba(254, 231, 92, 0.12)' },
    D: { text: 'var(--grade-d)', bg: 'rgba(250, 166, 26, 0.12)' },
    E: { text: 'var(--grade-e)', bg: 'rgba(244, 123, 103, 0.12)' },
    F: { text: 'var(--grade-f)', bg: 'rgba(237, 66, 69, 0.12)' }
  };

  /* ═══════════════════════════════════════════
     LOAD PROFILES
     ═══════════════════════════════════════════ */
  let profiles = [];
  try {
    const raw = localStorage.getItem('baccasio_saved_profiles');
    profiles = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(profiles)) {
      profiles = [];
    }
  } catch (e) {
    profiles = [];
  }

  let currentCompareTrack = 'science'; // science or social

  /* ═══════════════════════════════════════════
     CHART COLORS
     ═══════════════════════════════════════════ */
  const COLORS = [
    { bg: 'rgba(88, 101, 242, 0.25)',  border: '#5865F2', point: '#5865F2' },
    { bg: 'rgba(237, 66, 69, 0.25)',   border: '#ED4245', point: '#ED4245' },
    { bg: 'rgba(87, 242, 135, 0.25)',  border: '#57F287', point: '#57F287' },
    { bg: 'rgba(254, 231, 92, 0.25)',  border: '#FEE75C', point: '#FEE75C' },
    { bg: 'rgba(235, 69, 158, 0.25)',  border: '#EB459E', point: '#EB459E' },
    { bg: 'rgba(88, 203, 242, 0.25)',  border: '#58CBF2', point: '#58CBF2' },
  ];

  /* ═══════════════════════════════════════════
     CHART GLOBAL DEFAULTS
     ═══════════════════════════════════════════ */
  Chart.defaults.font.family = "'Inter', 'Noto Sans Khmer', sans-serif";
  Chart.defaults.color = 'rgba(255, 255, 255, 0.5)';

  /* ═══════════════════════════════════════════
     DOM REFS
     ═══════════════════════════════════════════ */
  const emptyState = document.getElementById('empty-state');
  const overviewSection = document.getElementById('overview-section');
  const selectorSection = document.getElementById('selector-section');
  const insightSection = document.getElementById('insight-section');
  const chartsSection = document.getElementById('charts-section');
  const tableSection = document.getElementById('table-section');
  const profileASelect = document.getElementById('profile-a-select');
  const profileBSelect = document.getElementById('profile-b-select');
  const langToggle = document.getElementById('lang-toggle');
  const currentLangLabel = document.getElementById('current-lang-label');

  let lineChart = null;
  let radarChart = null;
  let barChart = null;

  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */
  function getSubjects(track) {
    return t().subjects[track] || t().subjects.science;
  }

  function getScores(profile) {
    return (profile.scores || []).map(s => parseInt(s) || 0);
  }

  function getTotal(profile) {
    return parseInt(profile.total) || 0;
  }

  function getFilteredProfiles() {
    return profiles.filter(p => p.track === currentCompareTrack);
  }

  /* ── Subject-level grade calculator ── */
  function getSubjectGrade(score, max) {
    const pct = (score / max) * 100;
    if (pct >= 90) return { letter: 'A', color: 'var(--grade-a)' };
    if (pct >= 80) return { letter: 'B', color: 'var(--grade-b)' };
    if (pct >= 70) return { letter: 'C', color: 'var(--grade-c)' };
    if (pct >= 60) return { letter: 'D', color: 'var(--grade-d)' };
    if (pct >= 50) return { letter: 'E', color: 'var(--grade-e)' };
    return { letter: 'F', color: 'var(--grade-f)' };
  }

  /* ── Overall exam grade calculator ── */
  function getOverallGrade(total) {
    for (const g of GRADES) {
      if (total >= g.min && total <= g.max) return g;
    }
    return GRADES[GRADES.length - 1];
  }

  /* ═══════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════ */
  function init() {
    if (profiles.length === 0) {
      emptyState.classList.remove('hidden');
      updateEmptyStateText();
      return;
    }

    const trackSelectorSection = document.getElementById('track-selector-section');
    if (trackSelectorSection) trackSelectorSection.classList.remove('hidden');

    profileASelect.addEventListener('change', () => {
      // Re-populate second dropdown to exclude new First Profile selection
      updateProfileBOptions(profileBSelect.value);
      onProfileChange();
    });

    profileBSelect.addEventListener('change', onProfileChange);

    // Track Toggle Listeners
    document.querySelectorAll('#track-selector-section .track-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCompareTrack = btn.dataset.track;
        renderCompareDashboard();
      });
    });

    // Determine initial track based on profile counts
    const sciCount = profiles.filter(p => p.track === 'science').length;
    const socCount = profiles.filter(p => p.track === 'social').length;
    if (sciCount < 2 && socCount >= 2) {
      currentCompareTrack = 'social';
    } else {
      currentCompareTrack = 'science';
    }

    renderCompareDashboard();
  }

  /* ═══════════════════════════════════════════
     RENDER COMPARE DASHBOARD
     ═══════════════════════════════════════════ */
  function renderCompareDashboard() {
    const filtered = getFilteredProfiles();

    // Toggle active state of track buttons
    document.querySelectorAll('#track-selector-section .track-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.track === currentCompareTrack);
    });

    if (filtered.length < 2) {
      // Hide sections
      overviewSection.classList.add('hidden');
      selectorSection.classList.add('hidden');
      insightSection.classList.add('hidden');
      chartsSection.classList.add('hidden');
      tableSection.classList.add('hidden');

      // Show empty state for this track
      emptyState.classList.remove('hidden');
      updateEmptyStateText();
      return;
    }

    // Hide empty state
    emptyState.classList.add('hidden');

    // Show main sections
    overviewSection.classList.remove('hidden');
    selectorSection.classList.remove('hidden');

    populateSelects();
    buildLineChart();

    // Auto-select first two
    if (filtered.length >= 2) {
      profileASelect.value = filtered[0].id;
      updateProfileBOptions(filtered[1].id);
      onProfileChange();
    }
  }

  /* ═══════════════════════════════════════════
     POPULATE SELECTS
     ═══════════════════════════════════════════ */
  function populateSelects() {
    const prevA = profileASelect.value;
    const prevB = profileBSelect.value;

    profileASelect.innerHTML = '';
    const filtered = getFilteredProfiles();

    // Populate First Profile dropdown with all options
    filtered.forEach(p => {
      const optA = document.createElement('option');
      optA.value = p.id;
      optA.textContent = `${p.name} (${p.total} pts)`;
      profileASelect.appendChild(optA);
    });

    if (prevA && filtered.find(p => p.id === prevA)) {
      profileASelect.value = prevA;
    } else if (filtered.length > 0) {
      profileASelect.value = filtered[0].id;
    }

    // Populate Second Profile dropdown excluding the selected First Profile option
    updateProfileBOptions(prevB);
  }

  /* ── Populates/filters Second dropdown based on First dropdown selection ── */
  function updateProfileBOptions(preferredValue) {
    const selectedA = profileASelect.value;
    const filtered = getFilteredProfiles();

    profileBSelect.innerHTML = '';
    filtered.forEach(p => {
      if (p.id === selectedA) return; // exclude selected A

      const optB = document.createElement('option');
      optB.value = p.id;
      optB.textContent = `${p.name} (${p.total} pts)`;
      profileBSelect.appendChild(optB);
    });

    // Restore previous selection in B if it's still valid
    if (preferredValue && preferredValue !== selectedA && filtered.find(p => p.id === preferredValue)) {
      profileBSelect.value = preferredValue;
    } else {
      const options = profileBSelect.querySelectorAll('option');
      if (options.length > 0) {
        profileBSelect.value = options[0].value;
      }
    }
  }

  /* ═══════════════════════════════════════════
     ON PROFILE CHANGE
     ═══════════════════════════════════════════ */
  function onProfileChange() {
    const idA = profileASelect.value;
    const idB = profileBSelect.value;

    if (!idA || !idB || idA === idB) {
      insightSection.classList.add('hidden');
      chartsSection.classList.add('hidden');
      tableSection.classList.add('hidden');
      return;
    }

    const filtered = getFilteredProfiles();
    const profileA = filtered.find(p => p.id === idA);
    const profileB = filtered.find(p => p.id === idB);
    if (!profileA || !profileB) return;

    // Show comparison sections with animation
    [insightSection, chartsSection, tableSection].forEach(sec => {
      sec.classList.remove('hidden');
      sec.classList.remove('compare-fade-in');
      void sec.offsetWidth;
      sec.classList.add('compare-fade-in');
    });

    updateInsightCards(profileA, profileB);
    buildRadarChart(profileA, profileB);
    buildBarChart(profileA, profileB);
    buildCompareTable(profileA, profileB);

    // Update column headers
    document.getElementById('th-comp-profile-a').textContent = profileA.name;
    document.getElementById('th-comp-profile-b').textContent = profileB.name;
  }

  /* ═══════════════════════════════════════════
     1. INSIGHT CARDS
     ═══════════════════════════════════════════ */
  function updateInsightCards(profileA, profileB) {
    const track = profileA.track;
    const subjects = getSubjects(track);
    const scoresA = getScores(profileA);
    const scoresB = getScores(profileB);

    let maxImprovement = -Infinity;
    let maxImprovementIdx = 0;
    let maxDrop = Infinity;
    let maxDropIdx = 0;

    subjects.forEach((_, i) => {
      const diff = scoresB[i] - scoresA[i];
      if (diff > maxImprovement) {
        maxImprovement = diff;
        maxImprovementIdx = i;
      }
      if (diff < maxDrop) {
        maxDrop = diff;
        maxDropIdx = i;
      }
    });

    // Biggest Improvement
    const improvSubject = subjects[maxImprovementIdx] || '—';
    document.getElementById('improvement-subject').textContent = improvSubject;
    const improvEl = document.getElementById('improvement-value');
    improvEl.textContent = maxImprovement > 0 ? `+${maxImprovement}` : `${maxImprovement}`;
    improvEl.className = `insight-value ${maxImprovement >= 0 ? 'positive' : 'negative'}`;

    // Needs Attention
    const attSubject = subjects[maxDropIdx] || '—';
    document.getElementById('attention-subject').textContent = attSubject;
    const attEl = document.getElementById('attention-value');
    attEl.textContent = maxDrop < 0 ? `${maxDrop}` : `+${maxDrop}`;
    attEl.className = `insight-value ${maxDrop < 0 ? 'negative' : 'positive'}`;
  }

  /* ═══════════════════════════════════════════
     2. LINE CHART (ALL PROFILES IN TRACK)
     ═══════════════════════════════════════════ */
  function buildLineChart() {
    const ctx = document.getElementById('line-chart').getContext('2d');
    const filtered = getFilteredProfiles();
    const labels = filtered.map(p => p.name);
    const data = filtered.map(p => getTotal(p));

    if (lineChart) lineChart.destroy();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(88, 101, 242, 0.3)');
    gradient.addColorStop(1, 'rgba(88, 101, 242, 0.02)');

    lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: t().totalScoreLabel,
          data: data,
          borderColor: '#5865F2',
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: data.map((_, i) => COLORS[i % COLORS.length].border),
          pointBorderColor: '#1a1a2e',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            titleColor: '#e8e8ed',
            bodyColor: '#a0a0b0',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 14,
            displayColors: false,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `${t().totalScoreLabel}: ${item.raw} / 500`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255,255,255,0.45)',
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 0
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            min: 0,
            max: 500,
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              stepSize: 100,
              font: { size: 11 }
            },
            grid: { color: 'rgba(255,255,255,0.06)' }
          }
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     3. RADAR CHART
     ═══════════════════════════════════════════ */
  function buildRadarChart(profileA, profileB) {
    const ctx = document.getElementById('radar-chart').getContext('2d');
    const track = profileA.track;
    const subjects = getSubjects(track);
    const maxes = SUBJECT_MAX[track];
    const scoresA = getScores(profileA);
    const scoresB = getScores(profileB);

    // Normalize to percentage
    const pctA = scoresA.map((s, i) => parseFloat(((s / maxes[i]) * 100).toFixed(1)));
    const pctB = scoresB.map((s, i) => parseFloat(((s / maxes[i]) * 100).toFixed(1)));

    if (radarChart) radarChart.destroy();

    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: subjects,
        datasets: [
          {
            label: profileA.name,
            data: pctA,
            borderColor: COLORS[0].border,
            backgroundColor: COLORS[0].bg,
            pointBackgroundColor: COLORS[0].point,
            pointBorderColor: '#1a1a2e',
            pointBorderWidth: 1,
            borderWidth: 2.5,
            pointRadius: 4,
          },
          {
            label: profileB.name,
            data: pctB,
            borderColor: COLORS[1].border,
            backgroundColor: COLORS[1].bg,
            pointBackgroundColor: COLORS[1].point,
            pointBorderColor: '#1a1a2e',
            pointBorderWidth: 1,
            borderWidth: 2.5,
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255,255,255,0.65)',
              font: { size: 12, family: "'Inter', 'Noto Sans Khmer', sans-serif" },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            titleColor: '#e8e8ed',
            bodyColor: '#a0a0b0',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
            }
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            grid: { color: 'rgba(255,255,255,0.06)', circular: true },
            pointLabels: {
              color: 'rgba(255,255,255,0.55)',
              font: { size: 10, family: "'Inter', 'Noto Sans Khmer', sans-serif" }
            },
            ticks: {
              color: 'rgba(255,255,255,0.3)',
              backdropColor: 'transparent',
              stepSize: 25,
              font: { size: 9 }
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     4. GROUPED BAR CHART
     ═══════════════════════════════════════════ */
  function buildBarChart(profileA, profileB) {
    const ctx = document.getElementById('bar-chart').getContext('2d');
    const track = profileA.track;
    const subjects = getSubjects(track);
    const scoresA = getScores(profileA);
    const scoresB = getScores(profileB);

    // Shorten labels for display
    const shortLabels = subjects.map(s => {
      if (s.length > 14) return s.substring(0, 11) + '…';
      return s;
    });

    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: shortLabels,
        datasets: [
          {
            label: profileA.name,
            data: scoresA,
            backgroundColor: COLORS[0].bg,
            borderColor: COLORS[0].border,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: profileB.name,
            data: scoresB,
            backgroundColor: COLORS[1].bg,
            borderColor: COLORS[1].border,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255,255,255,0.65)',
              font: { size: 12, family: "'Inter', 'Noto Sans Khmer', sans-serif" },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            titleColor: '#e8e8ed',
            bodyColor: '#a0a0b0',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255,255,255,0.45)',
              font: { size: 9 },
              maxRotation: 45,
              minRotation: 0
            },
            grid: { display: false }
          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 }
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
            beginAtZero: true
          }
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     5. COLOR-CODED DATA TABLE (COMPARING GRADES)
     ═══════════════════════════════════════════ */
  function buildCompareTable(profileA, profileB) {
    const tbody = document.getElementById('compare-tbody');
    tbody.innerHTML = '';
    const track = profileA.track;
    const subjects = getSubjects(track);
    const maxes = SUBJECT_MAX[track];
    const scoresA = getScores(profileA);
    const scoresB = getScores(profileB);

    subjects.forEach((name, i) => {
      const diff = scoresB[i] - scoresA[i];
      let diffClass = 'diff-neutral';
      let diffText = '0';
      if (diff > 0) {
        diffClass = 'diff-positive';
        diffText = `+${diff}`;
      } else if (diff < 0) {
        diffClass = 'diff-negative';
        diffText = `${diff}`;
      }

      // Calculate subject grade letters
      const gradeA = getSubjectGrade(scoresA[i], maxes[i]);
      const gradeB = getSubjectGrade(scoresB[i], maxes[i]);

      const colorsA = GRADE_COLORS[gradeA.letter];
      const colorsB = GRADE_COLORS[gradeB.letter];

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${name}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-weight: 500; white-space: nowrap;">
          ${scoresA[i]} <span style="opacity: 0.45; font-size: 0.7rem;">/ ${maxes[i]}</span>
          <span class="grade-badge" style="background: ${colorsA.bg}; color: ${colorsA.text};">${gradeA.letter}</span>
        </td>
        <td style="font-family: 'JetBrains Mono', monospace; font-weight: 500; white-space: nowrap;">
          ${scoresB[i]} <span style="opacity: 0.45; font-size: 0.7rem;">/ ${maxes[i]}</span>
          <span class="grade-badge" style="background: ${colorsB.bg}; color: ${colorsB.text};">${gradeB.letter}</span>
        </td>
        <td class="${diffClass}" style="font-family: 'JetBrains Mono', monospace;">
          ${diffText}
        </td>
      `;
      tbody.appendChild(row);
    });

    // Total row
    const totalA = scoresA.reduce((a, b) => a + b, 0);
    const totalB = scoresB.reduce((a, b) => a + b, 0);
    const totalDiff = totalB - totalA;
    let totalDiffClass = 'diff-neutral';
    let totalDiffText = '0';
    if (totalDiff > 0) {
      totalDiffClass = 'diff-positive';
      totalDiffText = `+${totalDiff}`;
    } else if (totalDiff < 0) {
      totalDiffClass = 'diff-negative';
      totalDiffText = `${totalDiff}`;
    }

    // Calculate overall grade letters
    const overallGradeA = getOverallGrade(totalA);
    const overallGradeB = getOverallGrade(totalB);

    const overallColorsA = GRADE_COLORS[overallGradeA.letter];
    const overallColorsB = GRADE_COLORS[overallGradeB.letter];

    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
      <td style="font-weight: 700;">${t().totalLabel}</td>
      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
        ${totalA} <span style="opacity: 0.45; font-size: 0.7rem;">/ 500</span>
        <span class="grade-badge" style="background: ${overallColorsA.bg}; color: ${overallColorsA.text};">${overallGradeA.letter}</span>
      </td>
      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">
        ${totalB} <span style="opacity: 0.45; font-size: 0.7rem;">/ 500</span>
        <span class="grade-badge" style="background: ${overallColorsB.bg}; color: ${overallColorsB.text};">${overallGradeB.letter}</span>
      </td>
      <td class="${totalDiffClass}" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${totalDiffText}</td>
    `;
    tbody.appendChild(totalRow);
  }

  /* ═══════════════════════════════════════════
     UPDATE EMPTY STATE TEXT
     ═══════════════════════════════════════════ */
  function updateEmptyStateText() {
    const emptyTitle = document.getElementById('empty-title');
    const emptyDesc = document.getElementById('empty-desc');
    const isKh = currentLang === 'kh';

    if (profiles.length === 0) {
      if (emptyTitle) emptyTitle.textContent = isKh ? 'គ្មានប្រវត្តិពិន្ទុដែលបានរក្សាទុក' : 'No Saved Profiles';
      if (emptyDesc) emptyDesc.textContent = isKh ? 'អ្នកមិនទាន់បានរក្សាទុកពិន្ទុណាមួយឡើយ។ ត្រឡប់ក្រោយហើយរក្សាទុកពិន្ទុរបស់អ្នក។' : "You haven't saved any score profiles yet. Go back and save your scores.";
    } else {
      const trackLabel = currentCompareTrack === 'science' ? 
        (isKh ? 'ផ្នែកវិទ្យាសាស្ត្រ' : 'Science track') : 
        (isKh ? 'ផ្នែកវិទ្យាសាស្ត្រសង្គម' : 'Social Science track');

      const filtered = getFilteredProfiles();
      if (filtered.length === 1) {
        if (emptyTitle) emptyTitle.textContent = isKh ? 'មានប្រវត្តិពិន្ទុតែមួយប៉ុណ្ណោះក្នុងផ្នែកនេះ' : 'Only One Profile in this Track';
        if (emptyDesc) emptyDesc.textContent = isKh ? `អ្នកត្រូវការយ៉ាងហោចណាស់ ២ ប្រវត្តិពិន្ទុក្នុង${trackLabel}ដើម្បីចាប់ផ្តើមប្រៀបធៀប។` : `You need at least 2 score profiles in the ${trackLabel} to start comparing.`;
      } else {
        if (emptyTitle) emptyTitle.textContent = isKh ? 'គ្មានប្រវត្តិពិន្ទុក្នុងផ្នែកនេះទេ' : 'No Profiles in this Track';
        if (emptyDesc) emptyDesc.textContent = isKh ? `រក្សាទុកយ៉ាងហោចណាស់ ២ ក្នុង${trackLabel}ដើម្បីចាប់ផ្តើមប្រៀបធៀប។` : `Save at least 2 score profiles in the ${trackLabel} to start comparing.`;
      }
    }
  }

  /* ═══════════════════════════════════════════
     LANGUAGE
     ═══════════════════════════════════════════ */
  function applyLanguage() {
    const tr = t();
    document.documentElement.lang = currentLang === 'kh' ? 'km' : 'en';
    if (currentLangLabel) currentLangLabel.textContent = currentLang.toUpperCase();

    // Topbar
    const topbarTag = document.getElementById('topbar-tag');
    if (topbarTag) topbarTag.textContent = tr.compareTag;

    // Hero
    const heroH2 = document.querySelector('.hero h2');
    if (heroH2) heroH2.innerHTML = tr.heroTitle;
    const heroDesc = document.getElementById('compare-desc');
    if (heroDesc) heroDesc.textContent = tr.heroDesc;

    // Empty state fallback or dynamic update
    updateEmptyStateText();

    // Track Selector Title
    const trackSelectorTitle = document.getElementById('track-selector-title');
    if (trackSelectorTitle) {
      trackSelectorTitle.textContent = currentLang === 'kh' ? 'ជ្រើសរើសផ្នែកប្រឡង' : 'Select Track';
    }
    const compTrackSci = document.getElementById('compare-track-science');
    if (compTrackSci) compTrackSci.textContent = currentLang === 'kh' ? 'វិទ្យាសាស្ត្រ' : 'Science';
    const compTrackSoc = document.getElementById('compare-track-social');
    if (compTrackSoc) compTrackSoc.textContent = currentLang === 'kh' ? 'វិទ្យាសាស្ត្រសង្គម' : 'Social Science';

    // Sections
    const overviewTitle = document.getElementById('overview-title');
    if (overviewTitle) overviewTitle.textContent = tr.overviewTitle;
    const selectorTitle = document.getElementById('selector-title');
    if (selectorTitle) selectorTitle.textContent = tr.selectorTitle;
    const profileALabel = document.getElementById('profile-a-label');
    if (profileALabel) profileALabel.textContent = tr.profileALabel;
    const profileBLabel = document.getElementById('profile-b-label');
    if (profileBLabel) profileBLabel.textContent = tr.profileBLabel;

    // Insight labels
    const improvementLabel = document.getElementById('improvement-label');
    if (improvementLabel) improvementLabel.textContent = tr.improvementLabel;
    const attentionLabel = document.getElementById('attention-label');
    if (attentionLabel) attentionLabel.textContent = tr.attentionLabel;

    // Chart titles
    const radarTitle = document.getElementById('radar-title');
    if (radarTitle) radarTitle.textContent = tr.radarTitle;
    const barTitle = document.getElementById('bar-title');
    if (barTitle) barTitle.textContent = tr.barTitle;

    // Table
    const tableTitleText = document.getElementById('table-title-text');
    if (tableTitleText) tableTitleText.textContent = tr.tableTitle;
    const thSubject = document.getElementById('th-comp-subject');
    if (thSubject) thSubject.textContent = tr.thSubject;
    const thDiff = document.getElementById('th-comp-diff');
    if (thDiff) thDiff.textContent = tr.thDiff;

    // Footer
    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.innerHTML = tr.footer;
  }

  /* ═══════════════════════════════════════════
     LANGUAGE TOGGLE
     ═══════════════════════════════════════════ */
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'kh' : 'en';
      try { localStorage.setItem('baccasio-lang', currentLang); } catch (e) {}
      applyLanguage();

      // Rebuild everything with new language
      populateSelects();
      if (getFilteredProfiles().length >= 2) {
        buildLineChart();
        onProfileChange();
      }
    });
  }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */
  applyLanguage();
  init();

  // Local protocol handling for back link
  const backLink = document.getElementById('back-link');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        window.location.href = '../index.html';
      }
    });
  }

})();
