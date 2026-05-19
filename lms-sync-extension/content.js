/**
 * content.js
 * Runs on AcademiFlow webpage tabs (both local and live production).
 * Retrieves scraped tasks from chrome.storage.local and passes them to the web app.
 */

function checkAndSyncTasks() {
  chrome.storage.local.get("pendingTasks", (result) => {
    if (result.pendingTasks && result.pendingTasks.length > 0) {
      console.log("[AcademiFlow Ext] Terdeteksi tugas baru dari LMS!", result.pendingTasks);
      
      // Dispatch custom event to let app.js intercept and import
      const syncEvent = new CustomEvent("AcademiFlowLMSSync", {
        detail: result.pendingTasks
      });
      window.dispatchEvent(syncEvent);

      // Clean up the storage so it doesn't sync repeatedly
      chrome.storage.local.remove("pendingTasks", () => {
        console.log("[AcademiFlow Ext] Buffer penyimpanan sementara dibersihkan.");
      });
    }
  });
}

// Execute immediately when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkAndSyncTasks);
} else {
  checkAndSyncTasks();
}
