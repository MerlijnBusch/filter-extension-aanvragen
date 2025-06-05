chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "injectOverwriteScript") {
        chrome.scripting.executeScript({
            target: {tabId: msg.tabId},
            files: ["injected/inject.js"]
        });
    }
});

let latestToken = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {

        const authHeader = details.requestHeaders.find(h => h.name.toLowerCase() === 'authorization');
        if (authHeader) {
            if (authHeader.value.startsWith('Bearer')) {
                latestToken = authHeader.value;
                chrome.storage.local.set({ bearerToken: latestToken });
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://nldcasognlt3p.corp.capgemini.com/*"] },
    ["requestHeaders", "extraHeaders"]
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "INJECT_SCRIPT" && sender.tab) {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ["injected/inject.js"]
        });
    }
});
