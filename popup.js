document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("overwritePage")) {
    document.getElementById("overwritePage").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.runtime.sendMessage({
          action: "injectOverwriteScript",
          tabId: tab.id
        });
      });
    });
  }

  setupFilterEvents();
  fetchAndRenderDemands();
});
