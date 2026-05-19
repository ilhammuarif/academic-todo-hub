/**
 * popup.js
 * Controls the Chrome Extension popup, manages tab scripting,
 * runs the smart DOM scraper, and stores results to chrome.storage.
 */

let activeScrapedTasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const btnScan = document.getElementById("btn-scan");
  const btnSend = document.getElementById("btn-send");
  const btnOpenApp = document.getElementById("btn-open-app");
  const detectionBadge = document.getElementById("detection-badge");
  const statusMessage = document.getElementById("status-message");
  const scrapedSection = document.getElementById("scraped-section");
  const taskList = document.getElementById("task-list");
  const taskCount = document.getElementById("task-count");

  // Automatically check if the tab is an active university page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      if (url.protocol.startsWith("http")) {
        detectionBadge.className = "status-badge badge-detecting";
        detectionBadge.textContent = "💻 Portal Terdeteksi";
        statusMessage.textContent = `Siap memindai tugas dari portal: ${url.hostname}`;
      } else {
        detectionBadge.className = "status-badge";
        detectionBadge.style.background = "rgba(239, 68, 68, 0.15)";
        detectionBadge.style.color = "#fca5a5";
        detectionBadge.style.border = "1px solid rgba(239, 68, 68, 0.2)";
        detectionBadge.textContent = "⚠️ Halaman Tidak Valid";
        statusMessage.textContent = "Buka portal LMS kuliah Anda di tab aktif terlebih dahulu.";
        btnScan.disabled = true;
        btnScan.style.opacity = "0.5";
        btnScan.style.cursor = "not-allowed";
      }
    }
  });

  // Handle Scan Trigger
  btnScan.addEventListener("click", async () => {
    detectionBadge.textContent = "⏳ Memindai DOM Halaman...";
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: smartHeuristicLmsScraper
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            detectionBadge.textContent = "❌ Gagal Memindai";
            statusMessage.textContent = "Terjadi kesalahan akses tab. Pastikan tab selesai dimuat.";
            return;
          }

          if (results && results[0] && results[0].result) {
            activeScrapedTasks = results[0].result;
            renderTasks(activeScrapedTasks);
          } else {
            activeScrapedTasks = [];
            renderTasks([]);
          }
        }
      );
    });
  });

  // Render Scraped Tasks list inside popup
  function renderTasks(tasks) {
    taskList.innerHTML = "";
    taskCount.textContent = tasks.length;

    if (tasks.length === 0) {
      taskList.innerHTML = '<div class="empty-state">Tidak ditemukan tugas otomatis di halaman ini. Silakan coba buka halaman detail tugas, jadwal kuliah, atau kalender LMS Anda.</div>';
      scrapedSection.style.display = "flex";
      detectionBadge.className = "status-badge";
      detectionBadge.style.background = "rgba(239, 68, 68, 0.15)";
      detectionBadge.style.color = "#fca5a5";
      detectionBadge.style.border = "1px solid rgba(239, 68, 68, 0.2)";
      detectionBadge.textContent = "🔎 0 Tugas Ditemukan";
      return;
    }

    detectionBadge.className = "status-badge badge-detected";
    detectionBadge.textContent = `🎯 ${tasks.length} Tugas Ditemukan`;
    statusMessage.textContent = "Tugas berhasil diekstrak! Silakan tinjau dan edit judul atau tanggal tenggat jika diperlukan.";

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";
      
      taskItem.innerHTML = `
        <button class="task-delete" data-index="${index}"><i class="fa-solid fa-trash"></i> ✖</button>
        <input type="text" class="task-input-title" data-index="${index}" value="${task.title.replace(/"/g, '&quot;')}">
        <div class="task-meta">
          <span>Matkul: <b>${task.courseName}</b></span>
          <input type="date" class="task-input-date" data-index="${index}" value="${task.dueDate}">
        </div>
      `;

      taskList.appendChild(taskItem);
    });

    scrapedSection.style.display = "flex";

    // Bind edit inputs and delete actions
    document.querySelectorAll(".task-input-title").forEach(input => {
      input.addEventListener("input", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        activeScrapedTasks[index].title = e.target.value;
      });
    });

    document.querySelectorAll(".task-input-date").forEach(input => {
      input.addEventListener("change", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        activeScrapedTasks[index].dueDate = e.target.value;
      });
    });

    document.querySelectorAll(".task-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.closest("button").getAttribute("data-index"));
        activeScrapedTasks.splice(index, 1);
        renderTasks(activeScrapedTasks);
      });
    });
  }

  // Handle Send Data to AcademiFlow Web
  btnSend.addEventListener("click", () => {
    if (activeScrapedTasks.length === 0) {
      alert("Tidak ada tugas untuk disinkronkan.");
      return;
    }

    // Save tasks to chrome.storage.local
    chrome.storage.local.set({ pendingTasks: activeScrapedTasks }, () => {
      statusMessage.textContent = "Data siap dikirim! Membuka halaman AcademiFlow...";
      
      // Redirect or focus AcademiFlow Tab
      chrome.tabs.query({ url: "*://academiflow-ilham.web.app/*" }, (tabs) => {
        if (tabs && tabs.length > 0) {
          // Focus existing tab and reload to trigger content script check
          chrome.tabs.update(tabs[0].id, { active: true }, (tab) => {
            chrome.tabs.reload(tab.id);
          });
        } else {
          // Fallback check localhost
          chrome.tabs.query({ url: "*://localhost/*" }, (localTabs) => {
            if (localTabs && localTabs.length > 0) {
              chrome.tabs.update(localTabs[0].id, { active: true }, (tab) => {
                chrome.tabs.reload(tab.id);
              });
            } else {
              // Open a new tab pointing to the production web app
              chrome.tabs.create({ url: "https://academiflow-ilham.web.app/" });
            }
          });
        }
      });
    });
  });

  // Handle opening application directly
  btnOpenApp.addEventListener("click", () => {
    chrome.tabs.query({ url: "*://academiflow-ilham.web.app/*" }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        chrome.tabs.create({ url: "https://academiflow-ilham.web.app/" });
      }
    });
  });
});

/**
 * ==========================================================================
 * SMART HEURISTIC SCRAPER FUNCTION
 * Injected and runs directly inside the active University LMS tab context!
 * Analyzes the DOM, parses text, forms, tables, calendars, and returns tasks.
 * ==========================================================================
 */
function smartHeuristicLmsScraper() {
  const today = new Date();
  const pastThreshold = new Date();
  pastThreshold.setDate(pastThreshold.getDate() - 7); // Allow up to 7 days in the past to avoid strict timezone cutoff

  
  // Format Date to YYYY-MM-DD
  function formatDateString(date) {
    return date.toISOString().split('T')[0];
  }

  // Parses month names to standard month numbers (0-11)
  function parseMonthName(monthStr) {
    const months = {
      jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, maret: 2, apr: 3, april: 3,
      mei: 4, jun: 5, juni: 5, jul: 6, juli: 6, agt: 7, agustus: 7, sep: 8, september: 8,
      okt: 9, oktober: 9, nov: 10, november: 10, des: 11, desember: 11
    };
    const cleanStr = monthStr.toLowerCase().trim();
    return months[cleanStr] !== undefined ? months[cleanStr] : null;
  }

  // Clean title strings from clutter
  function cleanTitle(titleText) {
    if (!titleText) return "";
    return titleText
      .replace(/[\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/klik di sini/gi, '')
      .replace(/submission/gi, '')
      .trim();
  }

  // Helper to extract due dates from raw string using robust Regex rules
  function extractDueDate(text) {
    if (!text) return null;
    
    // Pattern 1: DD/MM/YYYY or DD-MM-YYYY (e.g. 24-05-2026 or 24/05/2026)
    const regexNumDate = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/;
    let match = text.match(regexNumDate);
    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }

    // Pattern 2: DD MonthName YYYY (e.g. 24 Mei 2026, 5 Juni 2026)
    const regexTextDate = /(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/;
    match = text.match(regexTextDate);
    if (match) {
      const day = parseInt(match[1]);
      const monthIndex = parseMonthName(match[2]);
      const year = parseInt(match[3]);
      if (monthIndex !== null) {
        const date = new Date(year, monthIndex, day);
        if (!isNaN(date.getTime())) return date;
      }
    }

    // Pattern 3: YYYY-MM-DD
    const regexIso = /(\d{4})\-(\d{2})\-(\d{2})/;
    match = text.match(regexIso);
    if (match) {
      const date = new Date(match[1], parseInt(match[2]) - 1, parseInt(match[3]));
      if (!isNaN(date.getTime())) return date;
    }

    // Heuristics: relative keywords "Besok", "Hari ini", "Lusa"
    const lowerText = text.toLowerCase();
    if (lowerText.includes("hari ini")) {
      return new Date();
    } else if (lowerText.includes("besok")) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    } else if (lowerText.includes("lusa")) {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return d;
    }

    return null;
  }

  // Scraper Action: Search in Tables (Common structure in campus portals)
  const rows = document.querySelectorAll("tr");
  rows.forEach(row => {
    const text = row.innerText || "";
    // Check if row has signs of a deadline/task and a date
    const hasTaskKeyword = /(tugas|kuis|quiz|assignment|praktikum|proyek|project|uts|uas|deadlines)/i.test(text);
    if (hasTaskKeyword) {
      const tds = Array.from(row.querySelectorAll("td"));
      if (tds.length >= 2) {
        // Try to identify which cell contains the date and which contains the task
        let titleCell = null;
        let dateValue = null;
        let courseName = "LMS Kampus";

        tds.forEach(td => {
          const cellText = td.innerText || "";
          const parsedDate = extractDueDate(cellText);
          if (parsedDate && !dateValue) {
            dateValue = parsedDate;
          } else if (cellText.trim().length > 5 && !titleCell) {
            // Keep cells with significant length as candidate title
            titleCell = cellText;
          }
        });

        // Also check if we can grab a Course Name from surrounding text or table columns
        tds.forEach(td => {
          const cellText = td.innerText || "";
          const matchCourse = cellText.match(/(Rekayasa Perangkat Lunak|Basis Data|Pemrograman|Algoritma|Kecerdasan|Kewirausahaan|Matematika|Jaringan|Sistem Informasi)/i);
          if (matchCourse) {
            courseName = matchCourse[0];
          }
        });

        if (titleCell && dateValue && dateValue >= pastThreshold) {
          extracted.push({
            title: cleanTitle(titleCell),
            dueDate: formatDateString(dateValue),
            courseName: courseName,
            notes: "Di-scrape otomatis dari portal kampus: " + window.location.href
          });
        }
      }
    }
  });

  // Scraper Action: Search calendar elements / events if any
  const calEvents = document.querySelectorAll(".event, .calendar-event, .day-assignment, .assignment-link");
  calEvents.forEach(el => {
    const text = el.innerText || "";
    const parentText = el.parentElement ? el.parentElement.innerText : "";
    const combinedText = text + " " + parentText;
    const parsedDate = extractDueDate(combinedText);
    
    if (text.length > 3 && parsedDate && parsedDate >= pastThreshold) {
      extracted.push({
        title: cleanTitle(text),
        dueDate: formatDateString(parsedDate),
        courseName: "LMS Kalender",
        notes: "Di-scrape otomatis dari kalender kampus."
      });
    }
  });

  // Scraper Action: Search in cards / list elements (Moodle / Google Classroom generic patterns)
  const cards = document.querySelectorAll(".card, .course-module, .assignment, .submissionstatustable");
  cards.forEach(card => {
    const text = card.innerText || "";
    if (/(tugas|deadline|due|tenggat|submit)/i.test(text)) {
      const parsedDate = extractDueDate(text);
      let title = "Tugas Kuliah";
      
      const anchor = card.querySelector("a");
      if (anchor && anchor.innerText.trim().length > 3) {
        title = anchor.innerText;
      } else {
        const header = card.querySelector("h3, h4, h5, .title");
        if (header) title = header.innerText;
      }

      if (parsedDate && parsedDate >= pastThreshold && title !== "Tugas Kuliah") {
        extracted.push({
          title: cleanTitle(title),
          dueDate: formatDateString(parsedDate),
          courseName: "Portal LMS",
          notes: "Di-scrape dari card LMS."
        });
      }
    }
  });

  // Scraper Action: Fallback to Page-wide text sentence scanner if nothing found
  if (extracted.length === 0) {
    const textBlocks = document.querySelectorAll("h1, h2, h3, h4, p, li, .post, .message, .content, [class*='content'], [class*='body']");
    textBlocks.forEach(block => {
      const text = block.innerText || "";
      if (text.length > 8 && text.length < 250) {
        const hasTaskKeyword = /(tugas|kuis|quiz|assignment|praktikum|proyek|project|diskusi|forum|tenggat|deadline)/i.test(text);
        if (hasTaskKeyword) {
          const parsedDate = extractDueDate(text);
          if (parsedDate && parsedDate >= pastThreshold) {
            let courseName = "Portal LMS";
            const titleEl = document.querySelector("h1, h2, .course-header, [class*='course-title']");
            if (titleEl && titleEl.innerText.trim().length > 3) {
              courseName = titleEl.innerText.split("-")[0].trim();
            }
            
            // Extract a neat clean title from the first sentence or first few words
            let cleanTitleText = cleanTitle(text.split(/[.:\n]/)[0]);
            if (cleanTitleText.length > 80) {
              cleanTitleText = cleanTitleText.substring(0, 80) + "...";
            }
            
            extracted.push({
              title: cleanTitleText,
              dueDate: formatDateString(parsedDate),
              courseName: courseName,
              notes: "Diekstrak otomatis dari teks halaman forum/portal."
            });
          }
        }
      }
    });
  }

  // De-duplicate results by title and date to prevent spamming
  const uniqueTasks = [];
  const seenKeys = new Set();
  
  extracted.forEach(task => {
    const key = `${task.title.toLowerCase().trim()}_${task.dueDate}`;
    if (!seenKeys.has(key) && task.title.length > 3) {
      seenKeys.add(key);
      uniqueTasks.push(task);
    }
  });

  return uniqueTasks.slice(0, 15); // Return top 15 most relevant tasks
}
