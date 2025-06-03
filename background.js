chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchData") {
      fetch(message.url, {
        method: "GET",
        credentials: "include", // ⬅️ Send session cookies
      })
        .then(res => res.json())
        .then(data => sendResponse({ data }))
        .catch(err => sendResponse({ error: err.message }));
      return true; // ⬅️ keep message channel open for async
    }
  });


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "injectOverwriteScript") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      files: ["inject.js"]
    });
  }
});