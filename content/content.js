window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    const msg = event.data;
    if (!msg || !msg.type || !msg.fromInjectedScript) return;

    switch (msg.type) {
        case "GET_PROFILES": {
            const { profiles = {}, activeProfile = null } = await chrome.storage.local.get(["profiles", "activeProfile"]);
            window.postMessage({
                type: "PROFILES_RESULT",
                fromContentScript: true,
                profiles,
                activeProfile,
                forLoadingProfile: msg.forLoadingProfile || false
            }, "*");
            break;
        }

        case "SAVE_PROFILE": {
            const { name, filters } = msg;
            const { profiles = {} } = await chrome.storage.local.get("profiles");
            profiles[name] = filters;
            await chrome.storage.local.set({ profiles, activeProfile: name });
            window.postMessage({ type: "PROFILE_SAVED", fromContentScript: true }, "*");
            break;
        }

        case "DELETE_PROFILE": {
            const { name } = msg;
            const { profiles = {} } = await chrome.storage.local.get("profiles");
            delete profiles[name];
            const newActive = Object.keys(profiles)[0] || null;
            await chrome.storage.local.set({ profiles, activeProfile: newActive });
            window.postMessage({ type: "PROFILE_DELETED", fromContentScript: true }, "*");
            break;
        }

        case "SET_ACTIVE_PROFILE": {
            await chrome.storage.local.set({ activeProfile: msg.name });
            window.postMessage({ type: "ACTIVE_PROFILE_SET", fromContentScript: true }, "*");
            break;
        }
    }
});

window.addEventListener("message", (event) => {
    if (event.source !== window || event.data?.type !== "getToken") return;

    chrome.storage.local.get(['bearerToken'], ({ bearerToken }) => {
        window.postMessage({
            type: "tokenResponse",
            token: bearerToken || null
        }, "*");
    });
});

chrome.storage.sync.get("pluginDisabled", ({ pluginDisabled }) => {
    if (!pluginDisabled) {
        chrome.runtime.sendMessage({ type: "INJECT_SCRIPT" });
    }
});