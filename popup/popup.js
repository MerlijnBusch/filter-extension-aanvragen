document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggle-btn");

    chrome.storage.sync.get("pluginDisabled", ({ pluginDisabled }) => {
        if (pluginDisabled === undefined) {
            chrome.storage.sync.set({ pluginDisabled: false }, () => {
                btn.textContent = "Disable 2.0";
            });
        } else {
            btn.textContent = pluginDisabled ? "Enable 2.0" : "Disable 2.0";
        }
    });

    btn.addEventListener("click", () => {
        chrome.storage.sync.get("pluginDisabled", ({ pluginDisabled }) => {
            const newState = !pluginDisabled;
            chrome.storage.sync.set({ pluginDisabled: newState }, () => {
                btn.textContent = newState ? "Enable 2.0" : "Disable 2.0";
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            });
        });
    });
});