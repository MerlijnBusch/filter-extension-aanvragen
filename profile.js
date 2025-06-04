function getCurrentFilters() {
  return {
    division: document.getElementById("division").value,
    minGrade: document.getElementById("minGrade").value,
    maxGrade: document.getElementById("maxGrade").value,
    role: document.getElementById("filterRole").value,
    customer: document.getElementById("filterCustomer").value,
    location: document.getElementById("filterLocation").value,
    skills: document.getElementById("filterSkills").value,
  };
}

function applyFilters(filters) {
  document.getElementById("division").value = filters.division || "";
  document.getElementById("minGrade").value = filters.minGrade || "A";
  document.getElementById("maxGrade").value = filters.maxGrade || "D";
  document.getElementById("filterRole").value = filters.role || "";
  document.getElementById("filterCustomer").value = filters.customer || "";
  document.getElementById("filterLocation").value = filters.location || "";
  document.getElementById("filterSkills").value = filters.skills || "";
}

function loadProfilesToDropdown(profiles, activeProfile) {
  const select = document.getElementById("profileSelect");
  select.innerHTML = '';

  Object.keys(profiles).forEach(profile => {
    const opt = document.createElement("option");
    opt.value = profile;
    opt.textContent = profile;
    if (profile === activeProfile) opt.selected = true;
    select.appendChild(opt);
  });
}

// Always-on message handler
window.addEventListener("message", (event) => {
  const msg = event.data;
  if (!msg || !msg.fromContentScript) return;

  switch (msg.type) {
    case "PROFILES_RESULT":
      if (msg.forLoadingProfile) {
        const selectedName = document.getElementById("profileSelect").value;
        const filters = msg.profiles[selectedName];
        if (filters) {
          applyFilters(filters);
          window.dispatchEvent(new Event("loadDemands"));
          window.postMessage({
            type: "SET_ACTIVE_PROFILE",
            fromInjectedScript: true,
            name: selectedName
          }, "*");
        }
      } else {
        loadProfilesToDropdown(msg.profiles, msg.activeProfile);
      }
      break;

    case "PROFILE_SAVED":
    case "PROFILE_DELETED":
    case "ACTIVE_PROFILE_SET":
      window.postMessage({ type: "GET_PROFILES", fromInjectedScript: true }, "*");
      break;
  }
});

// Initial profile load on script start
window.postMessage({ type: "GET_PROFILES", fromInjectedScript: true }, "*");

// Button handlers
document.getElementById("saveProfile").addEventListener("click", () => {
  const name = prompt("Enter a profile name:");
  if (!name) return;
  const filters = getCurrentFilters();
  window.postMessage({ type: "SAVE_PROFILE", fromInjectedScript: true, name, filters }, "*");
});

document.getElementById("loadProfile").addEventListener("click", () => {
  window.postMessage({
    type: "GET_PROFILES",
    fromInjectedScript: true,
    forLoadingProfile: true
  }, "*");
});

document.getElementById("deleteProfile").addEventListener("click", () => {
  const name = document.getElementById("profileSelect").value;
  if (confirm(`Delete profile "${name}"?`)) {
    window.postMessage({ type: "DELETE_PROFILE", fromInjectedScript: true, name }, "*");
  }
});
