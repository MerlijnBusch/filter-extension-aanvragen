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
        console.log('📡 Intercepted request to:', details.url);

        // Log all request headers
        console.log('🧾 Headers:', details.requestHeaders);

        const authHeader = details.requestHeaders.find(h => h.name.toLowerCase() === 'authorization');

        if (authHeader) {
            console.log('🔎 Authorization header found:', authHeader.value);

            if (authHeader.value.startsWith('Bearer')) {
                latestToken = authHeader.value;
                chrome.storage.local.set({ bearerToken: latestToken }, () => {
                    console.log('💾 Token stored:', latestToken);
                });
            } else {
                console.warn('⚠️ Authorization header does not start with "Bearer ":', authHeader.value);
            }
        } else {
            console.warn('❌ No Authorization header found in request to:', details.url);
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
