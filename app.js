/**
 * ==========================================================================
 * CORE APPLICATION ENGINE — ACADEMIFLOW
 * Author: AI Pair-Programmer for Ilham (Semester 4 Student)
 * Purpose: Robust, self-contained client-side state engine. Handles long-term
 *          academic scheduling, GPA math simulations, milestone subtask rendering,
 *          responsive view router, web audio synth alerts, and offline JSON backup tools.
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. STATE DEFINITION & DEFAULT SEED DATA
// --------------------------------------------------------------------------

// Default academic data used when the app is opened for the first time
const DEFAULT_STATE = {
  userSettings: {
    name: "Ilham",
    targetGraduationDate: "2028-08-31",
    soundEnabled: true,
    theme: "dark"
  },
  activeSemester: "4",
  tasks: [
    {
      id: "t1",
      title: "Laporan Praktikum Basis Data Lanjut - Optimasi Query",
      courseId: "c2", // Relevan dengan Basis Data Lanjut
      category: "Tugas",
      dueDate: getFutureDate(3),
      priority: "High",
      notes: "Gunakan EXPLAIN PLAN untuk menganalisis indeks tabel b-tree.",
      completed: false,
      semester: "4",
      createdAt: new Date().toISOString()
    },
    {
      id: "t2",
      title: "Membuat Prototype UI/UX Sistem Informasi Klinik",
      courseId: "c1", // Rekayasa Perangkat Lunak
      category: "Project",
      dueDate: getFutureDate(7),
      priority: "Medium",
      notes: "Kumpulkan link Figma di portal LMS.",
      completed: false,
      semester: "4",
      createdAt: new Date().toISOString()
    },
    {
      id: "t3",
      title: "Revisi Abstrak Proposal Riset Skripsi",
      courseId: "none",
      category: "Skripsi",
      dueDate: getFutureDate(12),
      priority: "Low",
      notes: "Konsultasikan hasil dengan koordinator lab riset mengenai implementasi AI.",
      completed: false,
      semester: "4",
      createdAt: new Date().toISOString()
    }
  ],
  courses: [
    { id: "c1", name: "Rekayasa Perangkat Lunak", sks: 3, targetGrade: "A", realGrade: "none", semester: "4" },
    { id: "c2", name: "Sistem Basis Data Lanjut", sks: 4, targetGrade: "A", realGrade: "none", semester: "4" },
    { id: "c3", name: "Pemrograman Web Lanjut", sks: 3, targetGrade: "AB", realGrade: "none", semester: "4" },
    { id: "c4", name: "Analisis & Desain Algoritma", sks: 3, targetGrade: "A", realGrade: "none", semester: "4" },
    { id: "c5", name: "Kecerdasan Artifisial Dasar", sks: 3, targetGrade: "B", realGrade: "none", semester: "4" },
    { id: "c6", name: "Kewirausahaan Teknologi", sks: 2, targetGrade: "A", realGrade: "none", semester: "4" }
  ],
  thesis: {
    title: "Analisis Kinerja Model Deep Learning pada Klasifikasi Data Akademik Mahasiswa",
    supervisor1: "Prof. Dr. Ir. Budi Santoso, M.T.",
    supervisor2: "Rina Wijaya, S.Kom., M.Cs.",
    milestones: [
      {
        id: "m1",
        title: "Perencanaan & Eksplorasi Topik (Semester 4-5)",
        desc: "Mengeksplorasi ide riset awal, mengumpulkan referensi, dan berkonsultasi mengenai roadmap.",
        completed: false,
        subtasks: [
          { id: "ms1", text: "Konsultasi ide topik riset ke dosen wali / koordinator skripsi", completed: true },
          { id: "ms2", text: "Cari 10 paper referensi utama terindeks Scopus/Sinta", completed: false },
          { id: "ms3", text: "Identifikasi masalah (problem statement) dan rumusan riset awal", completed: false }
        ]
      },
      {
        id: "m2",
        title: "Penyusunan Proposal Skripsi (Semester 6)",
        desc: "Menulis draf awal Bab 1-3 sebagai prasyarat melaksanakan Seminar Proposal (Sempro).",
        completed: false,
        subtasks: [
          { id: "ms4", text: "Tulis Bab 1: Pendahuluan (Latar Belakang & Tujuan)", completed: false },
          { id: "ms5", text: "Tulis Bab 2: Kajian Pustaka & Landasan Teori", completed: false },
          { id: "ms6", text: "Tulis Bab 3: Metodologi Penelitian & Desain Sistem", completed: false }
        ]
      },
      {
        id: "m3",
        title: "Seminar Proposal & Persetujuan (Semester 6-7)",
        desc: "Melaksanakan seminar untuk mempertahankan urgensi riset di depan tim penguji akademik.",
        completed: false,
        subtasks: [
          { id: "ms7", text: "Daftar Seminar Proposal di portal departemen", completed: false },
          { id: "ms8", text: "Revisi proposal sesuai feedback Dosen Penguji", completed: false },
          { id: "ms9", text: "Mendapatkan SK Dosen Pembimbing Skripsi resmi", completed: false }
        ]
      },
      {
        id: "m4",
        title: "Implementasi & Eksperimen Sistem (Semester 7)",
        desc: "Melakukan instalasi environment, crawling data, pengujian performa sistem, dan iterasi model.",
        completed: false,
        subtasks: [
          { id: "ms10", text: "Rancang bangun sistem / pengumpulan dataset riset utama", completed: false },
          { id: "ms11", text: "Running uji coba model/algoritma dan evaluasi metrik", completed: false },
          { id: "ms12", text: "Analisis hasil eksperimen dan pembuatan visualisasi grafik", completed: false }
        ]
      },
      {
        id: "m5",
        title: "Penulisan Draf Skripsi Lengkap (Semester 8)",
        desc: "Merangkum seluruh temuan riset ke dalam draf Bab 4-5 dan menyiapkan naskah publikasi ilmiah.",
        completed: false,
        subtasks: [
          { id: "ms13", text: "Tulis Bab 4: Hasil Analisis & Pembahasan", completed: false },
          { id: "ms14", text: "Tulis Bab 5: Kesimpulan & Saran Penelitian lanjutan", completed: false },
          { id: "ms15", text: "Cek Turnitin (Similiarity Index target < 20%)", completed: false },
          { id: "ms16", text: "Persetujuan draf akhir dari Pembimbing I & II", completed: false }
        ]
      },
      {
        id: "m6",
        title: "Sidang Akhir & Kelulusan (Semester 8)",
        desc: "Tahap final mempresentasikan skripsi, yudisium kelulusan, dan mempublikasikan karya.",
        completed: false,
        subtasks: [
          { id: "ms17", text: "Mendaftar Sidang Akhir / Pertahanan Skripsi", completed: false },
          { id: "ms18", text: "Melaksanakan Ujian Sidang Skripsi (Viva Voce)", completed: false },
          { id: "ms19", text: "Revisi naskah pasca-sidang & penyerahan ke repositori", completed: false }
        ]
      }
    ]
  },
  references: [
    {
      id: "r1",
      title: "Review Paper: Deep Learning Applications in Higher Education",
      url: "https://scholar.google.com",
      notes: "Sangat berguna untuk menyusun Bab 2 (Landasan Teori) klasifikasi siswa."
    }
  ],
  pomodoroLogs: [],
  gpaSetup: {
    targetGpa: 3.75,
    prevGpa: 3.60,
    prevSks: 60
  }
};

// State Object holding working memory of the app
let state = {};

// Helper to calculate future date (relative to today)
function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

// --------------------------------------------------------------------------
// 2. WEB AUDIO SYNTHESIZER (No external file dependencies, offline first)
// --------------------------------------------------------------------------
const SoundSynth = {
  ctx: null,

  init() {
    // Why: We initialize AudioContext on user interaction to satisfy browser security policies.
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playAlert(type) {
    if (!state.userSettings.soundEnabled) return;
    this.init();
    
    // Resume context if suspended (safari / chrome autplay guard)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'tick') {
      // Quiet organic high wood-click sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } else if (type === 'gong') {
      // Pleasant ambient chime (gong) representing task/pomodoro completion
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5 Note
      osc.frequency.exponentialRampToValueAtTime(329.63, this.ctx.currentTime + 0.4); // E4 Note
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    }
  }
};

// --------------------------------------------------------------------------
// 3. DATABASE CONTROLLERS (LocalStorage Engine & Portability)
// --------------------------------------------------------------------------
const DB = {
  STORAGE_KEY: 'academi_flow_db',

  load() {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY);
      if (dataStr) {
        state = JSON.parse(dataStr);
        // Deep verification to guarantee missing schema keys in updates do not crash
        this.verifySchema();
      } else {
        // First load: seed with detailed default values
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.save();
      }
    } catch (e) {
      console.error("Gagal memuat database localstorage: ", e);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  },

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      // Triggers live sync updates on dashboard & indicators
      this.syncUIIndicators();
    } catch (e) {
      console.error("Gagal menyimpan data ke localstorage: ", e);
      alert("Error: Ruang penyimpanan penuh atau dibatasi browser!");
    }
  },

  verifySchema() {
    // Fill in schema gaps if user upgrades from previous versions
    if (!state.userSettings) state.userSettings = { ...DEFAULT_STATE.userSettings };
    if (!state.tasks) state.tasks = [];
    if (!state.courses) state.courses = [];
    if (!state.thesis) state.thesis = { ...DEFAULT_STATE.thesis };
    if (!state.references) state.references = [];
    if (!state.pomodoroLogs) state.pomodoroLogs = [];
    if (!state.gpaSetup) state.gpaSetup = { ...DEFAULT_STATE.gpaSetup };
    if (!state.activeSemester) state.activeSemester = "4";
  },

  syncUIIndicators() {
    // Sync critical indicators across DOM instantly on state write
    const activeTasks = state.tasks.filter(t => t.semester === state.activeSemester && !t.completed).length;
    
    // Quick Update Dashboard Card Values if elements exist
    const elActive = document.getElementById('dash-active-tasks');
    if (elActive) elActive.textContent = activeTasks;

    // Calculate Semester Completion Bar
    const totalSemesterTasks = state.tasks.filter(t => t.semester === state.activeSemester).length;
    const completedSemesterTasks = state.tasks.filter(t => t.semester === state.activeSemester && t.completed).length;
    
    const fillBar = document.getElementById('task-completion-bar');
    const fillText = document.getElementById('task-completion-text');
    if (fillBar && fillText) {
      const percentage = totalSemesterTasks > 0 ? Math.round((completedSemesterTasks / totalSemesterTasks) * 100) : 0;
      fillBar.style.width = percentage + "%";
      fillText.textContent = `${completedSemesterTasks}/${totalSemesterTasks} Tugas Selesai (${percentage}%)`;
    }
  }
};

// --------------------------------------------------------------------------
// 4. POMODORO focus STATE & CONTROLLER
// --------------------------------------------------------------------------
const Pomodoro = {
  timerId: null,
  timeLeft: 1500, // seconds (25 minutes)
  durationTotal: 1500,
  isRunning: false,
  currentMode: 'work', // 'work', 'short', 'long'
  
  modes: {
    work: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  },

  init() {
    this.timeLeft = this.modes[this.currentMode];
    this.durationTotal = this.timeLeft;
    this.updateDisplay();
  },

  startPause() {
    SoundSynth.init(); // Warm up Web Audio
    if (this.isRunning) {
      // Pause
      clearInterval(this.timerId);
      this.isRunning = false;
      document.getElementById('btn-timer-start-pause').innerHTML = '<i class="fa-solid fa-play"></i> Mulai';
      document.getElementById('mini-timer-text').textContent = 'Timer Paused';
    } else {
      // Start
      this.isRunning = true;
      document.getElementById('btn-timer-start-pause').innerHTML = '<i class="fa-solid fa-pause"></i> Jeda';
      this.timerId = setInterval(() => {
        this.tick();
      }, 1000);
    }
  },

  reset() {
    clearInterval(this.timerId);
    this.isRunning = false;
    this.timeLeft = this.modes[this.currentMode];
    this.durationTotal = this.timeLeft;
    document.getElementById('btn-timer-start-pause').innerHTML = '<i class="fa-solid fa-play"></i> Mulai';
    document.getElementById('mini-timer-text').textContent = 'Focus Mode: Off';
    this.updateDisplay();
  },

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.updateDisplay();
      
      // Play a very subtle organic click every second during study to aid rhythm (optional visual sync)
      // SoundSynth.playAlert('tick');
    } else {
      // Finished!
      clearInterval(this.timerId);
      this.isRunning = false;
      SoundSynth.playAlert('gong');
      
      this.logCompletedSession();
      
      alert(`Sesi ${this.currentMode === 'work' ? 'Fokus Belajar' : 'Istirahat'} selesai!`);
      
      // Auto-toggle modes to maintain momentum
      if (this.currentMode === 'work') {
        this.setMode('short');
      } else {
        this.setMode('work');
      }
      this.reset();
    }
  },

  setMode(mode) {
    this.currentMode = mode;
    this.timeLeft = this.modes[mode];
    this.durationTotal = this.timeLeft;
    
    // Toggle active classes on visual mode buttons
    document.querySelectorAll('.pomodoro-modes .btn-mode').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`pomodoro-mode-${mode}`);
    if (targetBtn) targetBtn.classList.add('active');

    // Update status labels
    const label = document.getElementById('timer-status-label');
    if (label) {
      if (mode === 'work') label.textContent = 'WAKTUNYA FOKUS!';
      else if (mode === 'short') label.textContent = 'ISTIRAHAT SEBENTAR';
      else label.textContent = 'ISTIRAHAT PANJANG';
    }

    this.reset();
  },

  updateDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    // Page Title & Timer Display Elements
    document.getElementById('timer-time-string').textContent = timeStr;
    document.getElementById('mini-timer-text').textContent = `Fokus: ${timeStr}`;
    document.title = `${timeStr} — AcademiFlow`;

    // SVG Progress Bar Math
    const progressFill = document.getElementById('timer-progress-fill');
    if (progressFill) {
      const radius = 90;
      const circumference = 2 * Math.PI * radius;
      progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
      
      const elapsedPercent = (this.durationTotal - this.timeLeft) / this.durationTotal;
      const offset = circumference - (elapsedPercent * circumference);
      progressFill.style.strokeDashoffset = offset;
    }
  },

  logCompletedSession() {
    if (this.currentMode !== 'work') return; // only log focus study sessions

    const taskBindingSelect = document.getElementById('pomodoro-task-select');
    let bindingName = "Belajar Mandiri";
    if (taskBindingSelect && taskBindingSelect.value !== 'none') {
      const selectedTask = state.tasks.find(t => t.id === taskBindingSelect.value);
      if (selectedTask) bindingName = selectedTask.title;
    }

    const durationMinutes = Math.round(this.durationTotal / 60);
    const newLog = {
      id: "log_" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      courseName: bindingName,
      durationMinutes: durationMinutes
    };

    state.pomodoroLogs.push(newLog);
    DB.save();
    
    // Re-render Pomodoro lists & dashboards
    renderPomodoroLog();
    updateDashboardStats();
  }
};

// --------------------------------------------------------------------------
// 5. ACADEMIC & GPA MATHEMATICAL SIMULATORS
// --------------------------------------------------------------------------
const AcademicMath = {
  GRADE_POINTS: {
    "A": 4.0,
    "AB": 3.5,
    "B": 3.0,
    "BC": 2.5,
    "C": 2.0,
    "D": 1.0,
    "E": 0.0
  },

  calculateSemesterStats(semesterNum) {
    const semCourses = state.courses.filter(c => c.semester === String(semesterNum));
    let totalCredits = 0;
    let targetGradePoints = 0;
    let realGradePoints = 0;
    let realGradedCredits = 0;

    semCourses.forEach(c => {
      totalCredits += c.sks;
      // Target grade simulation point
      targetGradePoints += (c.sks * this.GRADE_POINTS[c.targetGrade]);

      // Real Grade math
      if (c.realGrade !== 'none') {
        realGradePoints += (c.sks * this.GRADE_POINTS[c.realGrade]);
        realGradedCredits += c.sks;
      }
    });

    const targetIPS = totalCredits > 0 ? (targetGradePoints / totalCredits) : 0;
    const realIPS = realGradedCredits > 0 ? (realGradePoints / realGradedCredits) : 0;

    return {
      totalCredits,
      targetIPS,
      realIPS,
      realGradedCredits
    };
  },

  calculateProjectedGPA() {
    // Math: GPA = ((Past GPA * Past SKS) + Current Grade Points) / (Past SKS + Current Graded SKS)
    const prevGpa = Number(state.gpaSetup.prevGpa) || 0;
    const prevSks = Number(state.gpaSetup.prevSks) || 0;
    
    let totalGradedPoints = prevGpa * prevSks;
    let totalSKS = prevSks;

    // Compile GPA details for the current active semester using simulation priority
    // Priority: If actual grade is set, use actual; else simulate via targetGrade!
    const activeSemCourses = state.courses.filter(c => c.semester === state.activeSemester);
    
    activeSemCourses.forEach(c => {
      totalSKS += c.sks;
      const grade = c.realGrade !== 'none' ? c.realGrade : c.targetGrade;
      const points = this.GRADE_POINTS[grade] || 0;
      totalGradedPoints += (c.sks * points);
    });

    const projectedGPA = totalSKS > 0 ? (totalGradedPoints / totalSKS) : 0;
    
    return {
      projectedGPA: projectedGPA.toFixed(2),
      currentGradedSKS: totalSKS
    };
  }
};

// --------------------------------------------------------------------------
// 6. RENDERERS & VIEW ROUTER
// --------------------------------------------------------------------------

// Switch active views smoothly
window.switchTab = function(tabName) {
  // Update nav button state
  document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
  });

  // Switch display blocks
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });
  const targetSection = document.getElementById(`tab-${tabName}`);
  if (targetSection) targetSection.classList.add('active');

  // Dynamically update view header text
  const viewTitle = document.getElementById('view-title');
  const viewSubtitle = document.getElementById('view-subtitle');

  if (tabName === 'dashboard') {
    viewTitle.textContent = "Dashboard Overview";
    viewSubtitle.textContent = "Ringkasan agenda kuliah, target kelulusan, dan progres milestone skripsi.";
    updateDashboardStats();
    renderUrgentTasks();
    renderGraduationCountdown();
  } else if (tabName === 'tasks') {
    viewTitle.textContent = "Agenda Kuliah & Tugas";
    viewSubtitle.textContent = "Susun pengerjaan tugas kuliah, kelompok, dan persiapan ujian untuk semester berjalan.";
    populateCourseFilterDropdowns();
    renderTasksDeck();
  } else if (tabName === 'gpa') {
    viewTitle.textContent = "Target IPK & Rencana Studi";
    viewSubtitle.textContent = "Simulasikan rencana kelulusan akademik dan catat daftar mata kuliah semester berjalan.";
    renderGpaPanel();
  } else if (tabName === 'skripsi') {
    viewTitle.textContent = "Planner & Roadmap Skripsi";
    viewSubtitle.textContent = "Susun milestone riset sejak semester 4 agar sidang skripsi dapat dicapai tepat waktu.";
    renderSkripsiPanel();
  } else if (tabName === 'pomodoro') {
    viewTitle.textContent = "Focus Study Timer";
    viewSubtitle.textContent = "Gunakan teknik Pomodoro untuk meningkatkan kefokusan saat mencicil tugas.";
    populatePomodoroTasksSelect();
    renderPomodoroLog();
  } else if (tabName === 'analytics') {
    viewTitle.textContent = "Statistik & Insight Belajar";
    viewSubtitle.textContent = "Laporan komprehensif distribusi tugas dan durasi waktu belajar kuliah.";
    renderAnalyticsCharts();
  } else if (tabName === 'settings') {
    viewTitle.textContent = "Konfigurasi Hub & Portabilitas";
    viewSubtitle.textContent = "Lakukan pencadangan data terenkripsi local-first untuk portabilitas jangka panjang.";
    renderSettingsPanel();
  }
};

// ------------------- VIEW 1: DASHBOARD OVERVIEW -------------------
function updateDashboardStats() {
  const activeSemester = state.activeSemester;
  
  // 1. Task Pending
  const activeTasks = state.tasks.filter(t => t.semester === activeSemester && !t.completed).length;
  document.getElementById('dash-active-tasks').textContent = activeTasks;
  
  // Active in week
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const dueThisWeek = state.tasks.filter(t => {
    if (t.semester !== activeSemester || t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    return due >= today && due <= nextWeek;
  }).length;
  document.getElementById('dash-due-soon').textContent = `${dueThisWeek} Tenggat Pekan Ini`;

  // 2. GPA Projected
  const statsGpa = AcademicMath.calculateProjectedGPA();
  document.getElementById('dash-target-gpa').textContent = statsGpa.projectedGPA;
  
  const currentSemesterStats = AcademicMath.calculateSemesterStats(activeSemester);
  document.getElementById('dash-current-gpa').textContent = `Target IPS Semester: ${currentSemesterStats.targetIPS.toFixed(2)}`;

  // 3. Skripsi Progress
  const totalSub = state.thesis.milestones.reduce((acc, m) => acc + m.subtasks.length, 0);
  const completedSub = state.thesis.milestones.reduce((acc, m) => acc + m.subtasks.filter(st => st.completed).length, 0);
  const skripsiPercent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
  
  document.getElementById('dash-skripsi-progress').textContent = `${skripsiPercent}%`;
  
  // Find active milestone
  const activeMilestone = state.thesis.milestones.find(m => !m.completed) || state.thesis.milestones[state.thesis.milestones.length - 1];
  document.getElementById('dash-skripsi-active').textContent = activeMilestone ? activeMilestone.title.split(' ')[0] + " sedang berjalan" : "Skripsi Selesai!";

  // 4. Focus Hours
  const totalFocusMinutes = state.pomodoroLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const hrs = Math.floor(totalFocusMinutes / 60);
  const mins = totalFocusMinutes % 60;
  document.getElementById('dash-focus-hours').textContent = `${hrs}j ${mins}m`;
  document.getElementById('dash-focus-sessions').textContent = `${state.pomodoroLogs.length} Sesi Pomodoro`;
}

function renderUrgentTasks() {
  const container = document.getElementById('dash-urgent-tasks');
  if (!container) return;

  const urgentTasks = state.tasks.filter(t => t.semester === state.activeSemester && !t.completed && t.priority === 'High');

  if (urgentTasks.length === 0) {
    container.innerHTML = `
      <li class="empty-state-list">
        <i class="fa-solid fa-circle-check text-success"></i>
        <p>Hebat! Tidak ada tugas mendesak untuk semester ini.</p>
      </li>
    `;
    return;
  }

  container.innerHTML = urgentTasks.map(t => {
    const course = state.courses.find(c => c.id === t.courseId);
    const courseName = course ? course.name : "Umum";
    return `
      <li>
        <div class="urgent-task-item">
          <div class="priority-bar priority-High"></div>
          <div class="urgent-task-info">
            <h4>${escapeHTML(t.title)}</h4>
            <p><i class="fa-solid fa-book"></i> ${escapeHTML(courseName)} &bull; <i class="fa-solid fa-calendar-alt"></i> Tenggat: ${t.dueDate}</p>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="switchTab('tasks')">Kerjakan</button>
      </li>
    `;
  }).join('');
}

function renderGraduationCountdown() {
  const targetDateInput = document.getElementById('target-graduation-date');
  const daysText = document.getElementById('countdown-days');
  const progressBar = document.getElementById('countdown-progress-bar');
  
  if (!targetDateInput || !daysText || !progressBar) return;

  const targetDateStr = state.userSettings.targetGraduationDate || "2028-08-31";
  targetDateInput.value = targetDateStr;

  const targetDate = new Date(targetDateStr);
  const today = new Date();
  
  // Calculate difference
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    daysText.textContent = diffDays;
    
    // circular offset calculation assuming starting from Semester 4 start (e.g. 1000 days countdown)
    const maxDaysProved = 1460; // Approx 4 years
    const percent = Math.max(0, Math.min(100, (diffDays / maxDaysProved) * 100));
    
    const circumference = 2 * Math.PI * 45;
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = circumference - (percent / 100 * circumference);
  } else {
    daysText.textContent = "0";
    progressBar.style.strokeDashoffset = 0;
    document.getElementById('countdown-header').textContent = "Selamat, Kamu Lulus! 🎉";
    document.getElementById('countdown-subtext').textContent = "Selamat atas pencapaian perkuliahanmu.";
  }
}

// ------------------- VIEW 2: TASKS & TODO AGENDAS -------------------
let taskFilters = {
  status: 'all',
  course: 'all',
  priority: 'all',
  category: 'all',
  search: ''
};

function populateCourseFilterDropdowns() {
  const filterSelect = document.getElementById('filter-course');
  const taskModalSelect = document.getElementById('task-course');
  if (!filterSelect || !taskModalSelect) return;

  // Preserve active selection
  const prevFilterVal = filterSelect.value;
  
  const activeCourses = state.courses.filter(c => c.semester === state.activeSemester);

  // Fill Filters
  let filterHTML = '<option value="all">Semua Mata Kuliah</option>';
  filterHTML += activeCourses.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
  filterSelect.innerHTML = filterHTML;
  filterSelect.value = prevFilterVal || 'all';

  // Fill Modal Task Form Course Select
  let modalHTML = '<option value="none">Tidak Terikat (Umum)</option>';
  modalHTML += activeCourses.map(c => `<option value="${c.id}">${escapeHTML(c.name)} (${c.sks} SKS)</option>`).join('');
  taskModalSelect.innerHTML = modalHTML;
}

function renderTasksDeck() {
  const container = document.getElementById('tasks-deck-container');
  if (!container) return;

  const activeSemester = state.activeSemester;
  const sortVal = document.getElementById('task-sort').value;

  // Filter calculations
  let filtered = state.tasks.filter(t => t.semester === activeSemester);

  // Apply filters
  if (taskFilters.status === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  } else if (taskFilters.status === 'completed') {
    filtered = filtered.filter(t => t.completed);
  }

  if (taskFilters.course !== 'all') {
    filtered = filtered.filter(t => t.courseId === taskFilters.course);
  }

  if (taskFilters.priority !== 'all') {
    filtered = filtered.filter(t => t.priority === taskFilters.priority);
  }

  if (taskFilters.category !== 'all') {
    filtered = filtered.filter(t => t.category === taskFilters.category);
  }

  if (taskFilters.search.trim() !== '') {
    const query = taskFilters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) || 
      (t.notes && t.notes.toLowerCase().includes(query))
    );
  }

  // Apply Sorting
  filtered.sort((a, b) => {
    if (sortVal === 'dueDate-asc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortVal === 'dueDate-desc') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortVal === 'priority-desc') {
      const weight = { "High": 3, "Medium": 2, "Low": 1 };
      return weight[b.priority] - weight[a.priority];
    } else if (sortVal === 'created-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-large">
        <i class="fa-solid fa-clipboard-list"></i>
        <h3>Tugas tidak ditemukan</h3>
        <p class="text-muted">Tidak ada tugas yang sesuai dengan filter pencarian aktif Anda.</p>
        <button class="btn btn-outline btn-sm mt-3" onclick="resetTaskFilters()">Atur Ulang Filter</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const course = state.courses.find(c => c.id === t.courseId);
    const courseName = course ? course.name : "Umum";
    
    // Check if task is overdue
    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = !t.completed && t.dueDate < todayStr;
    const dateClass = isOverdue ? "meta-date overdue animate-pulse" : "meta-date";
    const dateIcon = isOverdue ? '<i class="fa-solid fa-triangle-exclamation"></i> Terlambat: ' : '<i class="fa-solid fa-calendar-day"></i> Tenggat: ';

    return `
      <div class="task-card ${t.completed ? 'completed' : ''}" id="task-card-${t.id}">
        <div class="task-card-left">
          <div class="checkbox-custom-wrapper">
            <input type="checkbox" id="check-${t.id}" ${t.completed ? 'checked' : ''} onclick="toggleTaskCompletion('${t.id}')">
            <div class="checkbox-visual"><i class="fa-solid fa-check"></i></div>
          </div>
          <div class="task-card-details">
            <h4 class="task-card-title">${escapeHTML(t.title)}</h4>
            <div class="task-card-meta">
              <span class="meta-pill priority-${t.priority}">${t.priority}</span>
              <span class="meta-pill meta-course"><i class="fa-solid fa-book"></i> ${escapeHTML(courseName)}</span>
              <span class="meta-pill meta-category"><i class="fa-solid fa-tag"></i> ${t.category}</span>
              <span class="meta-pill ${dateClass}">${dateIcon}${t.dueDate}</span>
            </div>
            ${t.notes ? `<p class="task-notes-preview">${escapeHTML(t.notes)}</p>` : ''}
          </div>
        </div>
        <div class="task-card-right">
          <button class="btn-icon" onclick="openEditTaskModal('${t.id}')" title="Edit Tugas"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon btn-delete" onclick="deleteTask('${t.id}')" title="Hapus Tugas"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

window.resetTaskFilters = function() {
  taskFilters = { status: 'all', course: 'all', priority: 'all', category: 'all', search: '' };
  
  // reset filter dom
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  const allBtn = document.querySelector('.filter-pill[data-filter-status="all"]');
  if (allBtn) allBtn.classList.add('active');

  const filterCourse = document.getElementById('filter-course');
  const filterPriority = document.getElementById('filter-priority');
  const filterCategory = document.getElementById('filter-category');
  const searchInput = document.getElementById('task-search-input');

  if (filterCourse) filterCourse.value = 'all';
  if (filterPriority) filterPriority.value = 'all';
  if (filterCategory) filterCategory.value = 'all';
  if (searchInput) searchInput.value = '';

  renderTasksDeck();
};

window.toggleTaskCompletion = function(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    DB.save();
    
    // Animate item slightly then re-draw
    const card = document.getElementById(`task-card-${id}`);
    if (card) {
      if (task.completed) {
        card.classList.add('completed');
        SoundSynth.playAlert('gong');
      } else {
        card.classList.remove('completed');
      }
    }
    // Re-render
    setTimeout(() => {
      renderTasksDeck();
      updateDashboardStats();
    }, 150);
  }
};

// ------------------- VIEW 3: GPA & STUDY PLANNER -------------------
function renderGpaPanel() {
  document.getElementById('courses-semester-title').textContent = state.activeSemester;
  
  // Render Summary metrics
  const statsGpa = AcademicMath.calculateProjectedGPA();
  document.getElementById('gpa-projected-value').textContent = statsGpa.projectedGPA;

  const currentSemesterStats = AcademicMath.calculateSemesterStats(state.activeSemester);
  document.getElementById('gpa-semester-target').textContent = currentSemesterStats.targetIPS.toFixed(2);
  document.getElementById('gpa-semester-sks').textContent = `${currentSemesterStats.totalCredits} SKS`;
  document.getElementById('gpa-total-sks').textContent = `${statsGpa.currentGradedSKS} SKS`;

  // Render GPA inputs settings from DB
  document.getElementById('input-target-gpa').value = state.gpaSetup.targetGpa || 3.75;
  document.getElementById('input-prev-gpa').value = state.gpaSetup.prevGpa || 3.60;
  document.getElementById('input-prev-sks').value = state.gpaSetup.prevSks || 60;

  // Render course table rows
  const container = document.getElementById('courses-table-body');
  if (!container) return;

  const semCourses = state.courses.filter(c => c.semester === state.activeSemester);

  if (semCourses.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          <i class="fa-solid fa-book-open fs-3 mb-2 d-block"></i>
          Belum ada mata kuliah terdaftar di semester ${state.activeSemester}. Silakan tambah mata kuliah baru!
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = semCourses.map(c => {
    const isDone = c.realGrade !== 'none';
    const statusClass = isDone ? 'course-status-done' : 'course-status-running';
    const statusText = isDone ? `Selesai (${c.realGrade})` : 'Sedang Berjalan';
    
    return `
      <tr>
        <td><strong>${escapeHTML(c.name)}</strong></td>
        <td>${c.sks} SKS</td>
        <td><span class="badge semester-badge">${c.targetGrade}</span></td>
        <td><strong>${isDone ? c.realGrade : '—'}</strong></td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn-icon" onclick="openEditCourseModal('${c.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-delete" onclick="deleteCourse('${c.id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------- VIEW 4: SKRIPSI / THESIS ROADMAP -------------------
function renderSkripsiPanel() {
  const thesis = state.thesis;
  
  // Fill title metadata
  document.getElementById('thesis-title').value = thesis.title || "";
  document.getElementById('thesis-supervisor-1').value = thesis.supervisor1 || "";
  document.getElementById('thesis-supervisor-2').value = thesis.supervisor2 || "";

  // Circular progress display
  const totalSub = thesis.milestones.reduce((acc, m) => acc + m.subtasks.length, 0);
  const completedSub = thesis.milestones.reduce((acc, m) => acc + m.subtasks.filter(st => st.completed).length, 0);
  const skripsiPercent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
  
  document.getElementById('skripsi-progress-ring-fill').setAttribute('stroke-dasharray', `${skripsiPercent}, 100`);
  document.getElementById('skripsi-progress-ring-percent').textContent = `${skripsiPercent}%`;

  // Render Gantt Chronological Roadmap Items
  const timeline = document.getElementById('skripsi-milestones-timeline');
  if (!timeline) return;

  timeline.innerHTML = thesis.milestones.map((m, index) => {
    // Math to determine if active / completed / locked
    const isCompleted = m.subtasks.length > 0 && m.subtasks.every(st => st.completed);
    
    // Automatically flag completed milestones to DB logic
    m.completed = isCompleted;

    // Check if it is the currently active milestone
    let itemClass = '';
    if (isCompleted) itemClass = 'completed';
    else if (index === 0 || thesis.milestones[index - 1].completed) itemClass = 'active';

    return `
      <div class="milestone-item ${itemClass}">
        <div class="milestone-bullet"></div>
        <div class="milestone-card">
          <div class="milestone-card-header">
            <h4>${m.title}</h4>
            <span class="badge ${isCompleted ? 'course-status-done' : 'course-status-running'}">
              ${isCompleted ? 'Milestone Tercapai' : 'Belum Selesai'}
            </span>
          </div>
          <p class="milestone-desc">${m.desc}</p>
          
          <ul class="milestone-subtasks">
            ${m.subtasks.map(st => `
              <li>
                <input type="checkbox" id="check-sub-${st.id}" ${st.completed ? 'checked' : ''} onclick="toggleMilestoneSubtask('${m.id}', '${st.id}')">
                <span class="${st.completed ? 'subtask-text-checked' : ''}">${escapeHTML(st.text)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  // Render references sidebar
  renderReferencesList();
}

window.toggleMilestoneSubtask = function(milestoneId, subtaskId) {
  const milestone = state.thesis.milestones.find(m => m.id === milestoneId);
  if (milestone) {
    const subtask = milestone.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      
      // If completed, trigger sound feedback!
      if (subtask.completed) {
        SoundSynth.playAlert('gong');
      }

      DB.save();
      renderSkripsiPanel();
      updateDashboardStats();
    }
  }
};

function renderReferencesList() {
  const container = document.getElementById('ref-list-container');
  if (!container) return;

  if (state.references.length === 0) {
    container.innerHTML = `
      <div class="empty-state-list text-center py-4">
        <i class="fa-solid fa-bookmark text-muted mb-2 fs-3"></i>
        <p>Belum ada referensi riset. Mulai tambahkan paper yang relevan!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.references.map(r => `
    <div class="reference-card">
      <div class="ref-card-header">
        <h4>${escapeHTML(r.title)}</h4>
        <button class="btn-icon btn-delete btn-sm" onclick="deleteReference('${r.id}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      ${r.url ? `<a href="${escapeHTML(r.url)}" target="_blank" class="ref-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Kunjungi Sumber</a>` : ''}
      ${r.notes ? `<p class="ref-notes-text">${escapeHTML(r.notes)}</p>` : ''}
    </div>
  `).join('');
}

// ------------------- VIEW 5: POMODORO TIMER LOGS -------------------
function populatePomodoroTasksSelect() {
  const select = document.getElementById('pomodoro-task-select');
  if (!select) return;

  const activeTasks = state.tasks.filter(t => t.semester === state.activeSemester && !t.completed);
  let html = '<option value="none">Belajar Umum / Mandiri (Tanpa Tugas Spesifik)</option>';
  html += activeTasks.map(t => `<option value="${t.id}">${escapeHTML(t.title)}</option>`).join('');
  select.innerHTML = html;
}

function renderPomodoroLog() {
  const container = document.getElementById('pomodoro-log-container');
  const todayLabel = document.getElementById('focus-stat-today');
  const weekLabel = document.getElementById('focus-stat-week');
  const avgLabel = document.getElementById('focus-stat-average');
  
  if (!container) return;

  // Calculte quick metrics from Pomodoro Logs
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Today's stats
  const logsToday = state.pomodoroLogs.filter(log => log.date === todayStr);
  const minutesToday = logsToday.reduce((acc, log) => acc + log.durationMinutes, 0);
  if (todayLabel) todayLabel.textContent = `${logsToday.length} Sesi (${minutesToday} Menit)`;

  // Weekly stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const logsWeek = state.pomodoroLogs.filter(log => new Date(log.date) >= oneWeekAgo);
  const minutesWeek = logsWeek.reduce((acc, log) => acc + log.durationMinutes, 0);
  if (weekLabel) weekLabel.textContent = `${logsWeek.length} Sesi (${minutesWeek} Menit)`;

  // Average Sesi Harian calculation
  const uniqueDays = [...new Set(state.pomodoroLogs.map(log => log.date))].length || 1;
  const avgSessions = (state.pomodoroLogs.length / uniqueDays).toFixed(1);
  if (avgLabel) avgLabel.textContent = `${avgSessions} Sesi`;

  if (state.pomodoroLogs.length === 0) {
    container.innerHTML = `
      <div class="empty-state-list text-center py-4">
        <i class="fa-solid fa-circle-play text-muted mb-2 fs-2"></i>
        <p>Mulai sesi fokus pertamamu untuk mencatat jam belajar!</p>
      </div>
    `;
    return;
  }

  // Render chronologically (newest focus session first)
  const sortedLogs = [...state.pomodoroLogs].reverse();
  container.innerHTML = sortedLogs.slice(0, 10).map(log => `
    <div class="focus-log-item">
      <div class="log-meta-info">
        <strong>${escapeHTML(log.courseName)}</strong>
        <span>${log.date}</span>
      </div>
      <span class="log-duration"><i class="fa-regular fa-clock"></i> ${log.durationMinutes} Menit</span>
    </div>
  `).join('');
}

// ------------------- VIEW 6: STATISTICAL ANALYTICS -------------------
function renderAnalyticsCharts() {
  const activeSemester = state.activeSemester;
  const semCourses = state.courses.filter(c => c.semester === activeSemester);
  
  // Chart 1: Task Distribution by Course
  const courseChart = document.getElementById('analytics-courses-chart');
  if (courseChart) {
    if (semCourses.length === 0) {
      courseChart.innerHTML = '<p class="text-muted text-center py-4">Belum ada mata kuliah semester berjalan untuk melacak distribusi tugas.</p>';
    } else {
      courseChart.innerHTML = semCourses.map(c => {
        const count = state.tasks.filter(t => t.semester === activeSemester && t.courseId === c.id).length;
        
        // Find max count in semester for dynamic visual bar scaling
        const maxTasks = Math.max(...semCourses.map(co => state.tasks.filter(t => t.semester === activeSemester && t.courseId === co.id).length)) || 1;
        const scalePercent = (count / maxTasks) * 100;
        
        return `
          <div class="chart-bar-item">
            <div class="chart-bar-label">
              <span>${escapeHTML(c.name)}</span>
              <strong>${count} Tugas</strong>
            </div>
            <div class="chart-bar-fill-wrap">
              <div class="chart-bar-fill" style="width: ${scalePercent}%; background-color: var(--accent-primary);"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Chart 2: Focus Hours / Minutes per Task Target
  const focusChart = document.getElementById('analytics-focus-chart');
  if (focusChart) {
    // Group logs by topic name
    const grouped = {};
    state.pomodoroLogs.forEach(log => {
      grouped[log.courseName] = (grouped[log.courseName] || 0) + log.durationMinutes;
    });

    const entries = Object.entries(grouped);
    
    if (entries.length === 0) {
      focusChart.innerHTML = '<p class="text-muted text-center py-4">Selesaikan sesi belajar Pomodoro untuk melihat metrik visual waktu fokus Anda.</p>';
    } else {
      const maxMinutes = Math.max(...entries.map(e => e[1])) || 1;
      focusChart.innerHTML = entries.map(entry => {
        const percent = (entry[1] / maxMinutes) * 100;
        return `
          <div class="chart-bar-item">
            <div class="chart-bar-label">
              <span>${escapeHTML(entry[0])}</span>
              <strong>${entry[1]} Menit</strong>
            </div>
            <div class="chart-bar-fill-wrap">
              <div class="chart-bar-fill" style="width: ${percent}%; background-color: var(--accent-secondary);"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// ------------------- VIEW 7: BACKUP & DATABASE CONFIGS -------------------
function renderSettingsPanel() {
  const themeToggle = document.getElementById('theme-toggle');
  const soundToggle = document.getElementById('sound-toggle');

  if (themeToggle) themeToggle.checked = state.userSettings.theme === 'dark';
  if (soundToggle) soundToggle.checked = state.userSettings.soundEnabled;
}

// --------------------------------------------------------------------------
// 7. FORM SUBMISSIONS, MODALS, & API CRUD
// --------------------------------------------------------------------------

// --- Task Modals and Form Submissions ---
window.openAddTaskModal = function() {
  document.getElementById('task-modal-title').textContent = "Tambah Tugas Baru";
  document.getElementById('task-edit-id').value = "";
  document.getElementById('task-form').reset();
  
  // Set default due date to tomorrow
  const tomorrow = getFutureDate(1);
  document.getElementById('task-due-date').value = tomorrow;

  document.getElementById('task-modal').classList.add('active');
};

window.openEditTaskModal = function(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById('task-modal-title').textContent = "Edit Rincian Tugas";
  document.getElementById('task-edit-id').value = task.id;
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-course').value = task.courseId;
  document.getElementById('task-category').value = task.category;
  document.getElementById('task-due-date').value = task.dueDate;
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-notes').value = task.notes || "";

  document.getElementById('task-modal').classList.add('active');
};

window.deleteTask = function(id) {
  if (confirm("Apakah Anda yakin ingin menghapus agenda tugas ini?")) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    DB.save();
    renderTasksDeck();
    updateDashboardStats();
  }
};

// Course Modals and Forms
window.openAddCourseModal = function() {
  document.getElementById('course-modal-title').textContent = "Tambah Mata Kuliah";
  document.getElementById('course-edit-id').value = "";
  document.getElementById('course-form').reset();
  document.getElementById('course-modal').classList.add('active');
};

window.openEditCourseModal = function(id) {
  const course = state.courses.find(c => c.id === id);
  if (!course) return;

  document.getElementById('course-modal-title').textContent = "Ubah Detail Mata Kuliah";
  document.getElementById('course-edit-id').value = course.id;
  document.getElementById('course-name').value = course.name;
  document.getElementById('course-sks').value = course.sks;
  document.getElementById('course-target-grade').value = course.targetGrade;
  document.getElementById('course-real-grade').value = course.realGrade;

  document.getElementById('course-modal').classList.add('active');
};

window.deleteCourse = function(id) {
  // Check if course has tasks
  const hasTasks = state.tasks.some(t => t.courseId === id);
  const msg = hasTasks 
    ? "Mata kuliah ini memiliki tugas yang terhubung. Jika dihapus, tugas tersebut akan diatur menjadi kategori umum. Lanjutkan?"
    : "Apakah Anda yakin ingin menghapus mata kuliah ini?";

  if (confirm(msg)) {
    // Set matching tasks to general/none
    state.tasks.forEach(t => {
      if (t.courseId === id) t.courseId = 'none';
    });

    state.courses = state.courses.filter(c => c.id !== id);
    DB.save();
    renderGpaPanel();
    updateDashboardStats();
  }
};

// Research References Add & Delete
window.deleteReference = function(id) {
  if (confirm("Hapus referensi riset ini?")) {
    state.references = state.references.filter(r => r.id !== id);
    DB.save();
    renderSkripsiPanel();
  }
};

// --------------------------------------------------------------------------
// 8. EVENT BINDINGS (BOOTSTRAP PROCESS)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Load
  DB.load();

  // 2. Global Semester Select Sync
  const semSelect = document.getElementById('global-semester-select');
  if (semSelect) {
    semSelect.value = state.activeSemester;
    document.getElementById('current-semester-label').textContent = `Semester ${state.activeSemester}`;
    
    semSelect.addEventListener('change', (e) => {
      state.activeSemester = e.target.value;
      document.getElementById('current-semester-label').textContent = isNaN(state.activeSemester) ? state.activeSemester : `Semester ${state.activeSemester}`;
      DB.save();
      
      // Live reload active tab view to match selected semester context
      const activeBtn = document.querySelector('.sidebar-nav .nav-btn.active');
      if (activeBtn) {
        switchTab(activeBtn.getAttribute('data-tab'));
      }
    });
  }

  // 3. Setup Navigation Sidebar Clicks
  document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = btn.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // 4. Quick Add Buttons
  document.getElementById('btn-quick-add').addEventListener('click', () => {
    openAddTaskModal();
  });

  // 5. Pomodoro state bootstrap
  Pomodoro.init();
  document.getElementById('btn-timer-start-pause').addEventListener('click', () => Pomodoro.startPause());
  document.getElementById('btn-timer-reset').addEventListener('click', () => Pomodoro.reset());
  document.getElementById('btn-timer-skip').addEventListener('click', () => {
    if (confirm("Lewati sesi ini?")) Pomodoro.tick();
  });

  // 6. Modal Close Triggers
  document.getElementById('btn-close-task-modal').addEventListener('click', () => {
    document.getElementById('task-modal').classList.remove('active');
  });
  document.getElementById('btn-cancel-task-modal').addEventListener('click', () => {
    document.getElementById('task-modal').classList.remove('active');
  });

  document.getElementById('btn-close-course-modal').addEventListener('click', () => {
    document.getElementById('course-modal').classList.remove('active');
  });
  document.getElementById('btn-cancel-course-modal').addEventListener('click', () => {
    document.getElementById('course-modal').classList.remove('active');
  });

  // 7. Forms Submit Handlers (Double Side Safe Validations)
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const editId = document.getElementById('task-edit-id').value;
      const title = document.getElementById('task-title').value.trim();
      const courseId = document.getElementById('task-course').value;
      const category = document.getElementById('task-category').value;
      const dueDate = document.getElementById('task-due-date').value;
      const priority = document.getElementById('task-priority').value;
      const notes = document.getElementById('task-notes').value.trim();

      // Double-Side Safe Input Checks
      if (title.length < 3) {
        alert("Judul tugas minimal berisi 3 karakter!");
        return;
      }
      if (!dueDate) {
        alert("Tanggal tenggat pengerjaan wajib dipilih!");
        return;
      }

      if (editId) {
        // Edit mode
        const task = state.tasks.find(t => t.id === editId);
        if (task) {
          task.title = title;
          task.courseId = courseId;
          task.category = category;
          task.dueDate = dueDate;
          task.priority = priority;
          task.notes = notes;
        }
      } else {
        // Create mode
        const newTask = {
          id: "task_" + Date.now(),
          title,
          courseId,
          category,
          dueDate,
          priority,
          notes,
          completed: false,
          semester: state.activeSemester,
          createdAt: new Date().toISOString()
        };
        state.tasks.push(newTask);
      }

      DB.save();
      document.getElementById('task-modal').classList.remove('active');
      
      // Auto refresh list
      renderTasksDeck();
      updateDashboardStats();
    } catch (err) {
      console.error("Form error:", err);
    }
  });

  // Course Add Form Submit
  document.getElementById('btn-add-course').addEventListener('click', () => {
    openAddCourseModal();
  });

  document.getElementById('course-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const editId = document.getElementById('course-edit-id').value;
      const name = document.getElementById('course-name').value.trim();
      const sks = parseInt(document.getElementById('course-sks').value, 10);
      const targetGrade = document.getElementById('course-target-grade').value;
      const realGrade = document.getElementById('course-real-grade').value;

      if (name.length < 2) {
        alert("Nama mata kuliah minimal berisi 2 karakter!");
        return;
      }
      if (isNaN(sks) || sks < 1 || sks > 6) {
        alert("Bobot SKS tidak valid! (Harus berkisar antara 1-6 SKS)");
        return;
      }

      if (editId) {
        const course = state.courses.find(c => c.id === editId);
        if (course) {
          course.name = name;
          course.sks = sks;
          course.targetGrade = targetGrade;
          course.realGrade = realGrade;
        }
      } else {
        const newCourse = {
          id: "course_" + Date.now(),
          name,
          sks,
          targetGrade,
          realGrade,
          semester: state.activeSemester
        };
        state.courses.push(newCourse);
      }

      DB.save();
      document.getElementById('course-modal').classList.remove('active');
      renderGpaPanel();
    } catch (err) {
      console.error(err);
    }
  });

  // 8. GPA Setup Modifiers
  document.getElementById('btn-save-gpa-setup').addEventListener('click', () => {
    const targetGpa = parseFloat(document.getElementById('input-target-gpa').value);
    const prevGpa = parseFloat(document.getElementById('input-prev-gpa').value);
    const prevSks = parseInt(document.getElementById('input-prev-sks').value, 10);

    if (isNaN(targetGpa) || targetGpa < 0 || targetGpa > 4.0) {
      alert("Target IPK kelulusan harus berkisar antara 0.00 hingga 4.00!");
      return;
    }
    
    state.gpaSetup.targetGpa = targetGpa;
    state.gpaSetup.prevGpa = prevGpa;
    state.gpaSetup.prevSks = prevSks;

    DB.save();
    renderGpaPanel();
    alert("Konfigurasi parameter IPK berhasil diperbarui!");
  });

  // 9. Thesis Planner Forms Submit
  document.getElementById('btn-save-thesis-meta').addEventListener('click', () => {
    const title = document.getElementById('thesis-title').value.trim();
    const sup1 = document.getElementById('thesis-supervisor-1').value.trim();
    const sup2 = document.getElementById('thesis-supervisor-2').value.trim();

    state.thesis.title = title;
    state.thesis.supervisor1 = sup1;
    state.thesis.supervisor2 = sup2;

    DB.save();
    alert("Identitas usulan Judul Skripsi berhasil disimpan!");
  });

  // Add Reference
  document.getElementById('btn-add-ref').addEventListener('click', () => {
    const title = document.getElementById('ref-title').value.trim();
    const url = document.getElementById('ref-url').value.trim();
    const notes = document.getElementById('ref-notes').value.trim();

    if (title.length < 3) {
      alert("Masukkan judul makalah atau riset!");
      return;
    }

    const newRef = {
      id: "ref_" + Date.now(),
      title,
      url,
      notes
    };
    state.references.push(newRef);
    DB.save();
    
    // clear input fields
    document.getElementById('ref-title').value = '';
    document.getElementById('ref-url').value = '';
    document.getElementById('ref-notes').value = '';

    renderSkripsiPanel();
  });

  // 10. Task Filter events
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      taskFilters.status = e.target.getAttribute('data-filter-status');
      renderTasksDeck();
    });
  });

  document.getElementById('filter-course').addEventListener('change', (e) => {
    taskFilters.course = e.target.value;
    renderTasksDeck();
  });

  document.getElementById('filter-priority').addEventListener('change', (e) => {
    taskFilters.priority = e.target.value;
    renderTasksDeck();
  });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    taskFilters.category = e.target.value;
    renderTasksDeck();
  });

  document.getElementById('task-search-input').addEventListener('input', (e) => {
    taskFilters.search = e.target.value;
    renderTasksDeck();
  });

  document.getElementById('task-sort').addEventListener('change', () => {
    renderTasksDeck();
  });

  // 11. Graduation Countdown Custom Date modifier
  document.getElementById('target-graduation-date').addEventListener('change', (e) => {
    state.userSettings.targetGraduationDate = e.target.value;
    DB.save();
    renderGraduationCountdown();
  });

  // 12. Settings Personalization Event Listeners
  document.getElementById('theme-toggle').addEventListener('change', (e) => {
    state.userSettings.theme = e.target.checked ? 'dark' : 'light';
    DB.save();
    
    if (e.target.checked) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  });

  document.getElementById('sound-toggle').addEventListener('change', (e) => {
    state.userSettings.soundEnabled = e.target.checked;
    DB.save();
  });

  // Full Database Resetゾーン
  document.getElementById('btn-reset-database').addEventListener('click', () => {
    if (confirm("WARNING: Apakah Anda yakin ingin menghapus seluruh database perkuliahan secara permanen? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem(DB.STORAGE_KEY);
      DB.load();
      switchTab('dashboard');
      alert("Database dibersihkan kembali ke pengaturan default!");
    }
  });

  // 13. DATA PORTABILITY: EXPORT / IMPORT CONTROLLERS
  document.getElementById('btn-export-data').addEventListener('click', () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `AcademiFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      alert("Ekspor cadangan gagal: " + e.message);
    }
  });

  document.getElementById('import-file-selector').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        // Safety verification check: Make sure key properties exist before saving
        if (parsed.userSettings && parsed.tasks && parsed.courses && parsed.thesis) {
          state = parsed;
          DB.save();
          
          // Re-render UI
          switchTab('dashboard');
          alert("Selamat! Pencadangan data perkuliahan berhasil diimpor dengan sukses.");
        } else {
          alert("Gagal: Struktur berkas JSON cadangan tidak kompatibel atau rusak!");
        }
      } catch (err) {
        alert("Gagal membaca berkas: Pastikan berkas yang diunggah berupa berkas JSON yang valid.");
      }
    };
    reader.readAsText(file);
  });

  // 14. First Load Sync
  const activeTheme = state.userSettings.theme || 'dark';
  if (activeTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }

  // Draw Dashboard initial view
  switchTab('dashboard');
});

// Helper for escaping raw strings to secure against XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
