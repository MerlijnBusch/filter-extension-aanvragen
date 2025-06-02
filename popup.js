let allDemands = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
  loadFilters();

  document.getElementById("sendRequest").addEventListener("click", () => {
    saveFilters();
    fetchAndRenderDemands();
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    renderFilteredTable();
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderFilteredTable();
    }
  });

  // Save and re-filter when any input changes
  document.querySelectorAll('#filterRole, #filterCustomer, #filterLocation, #filterSkills, #division, #minGrade, #maxGrade')
    .forEach(input => input.addEventListener("input", () => {
      currentPage = 1;
      saveFilters();
      renderFilteredTable();
    }));

  // Clear filters
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("filterRole").value = "";
    document.getElementById("filterCustomer").value = "";
    document.getElementById("filterLocation").value = "";
    document.getElementById("filterSkills").value = "";
    currentPage = 1;
    saveFilters();
    renderFilteredTable();
  });

  // Save/download filtered data
  document.getElementById("saveJson").addEventListener("click", () => {
    downloadFilteredData("json");
  });

  document.getElementById("saveCsv").addEventListener("click", () => {
    downloadFilteredData("csv");
  });

  fetchAndRenderDemands();
});

function fetchAndRenderDemands() {
  const division = document.getElementById("division").value;
  const minGrade = document.getElementById("minGrade").value;
  const maxGrade = document.getElementById("maxGrade").value;

  const url = buildDemandUrl(division, minGrade, maxGrade, 1, 200);

  chrome.runtime.sendMessage({ action: "fetchData", url }, response => {
    if (response.error) {
      document.getElementById("output").textContent = `Error: ${response.error}`;
      return;
    }

    allDemands = response.data.demands || [];
    currentPage = 1;
    renderFilteredTable();
  });
}

function saveFilters() {
  const filters = {
    role: document.getElementById("filterRole").value,
    customer: document.getElementById("filterCustomer").value,
    location: document.getElementById("filterLocation").value,
    skills: document.getElementById("filterSkills").value,
    division: document.getElementById("division").value,
    minGrade: document.getElementById("minGrade").value,
    maxGrade: document.getElementById("maxGrade").value
  };
  chrome.storage.local.set({ savedFilters: filters });
}

function loadFilters() {
  chrome.storage.local.get("savedFilters", data => {
    if (!data.savedFilters) return;

    const f = data.savedFilters;
    document.getElementById("filterRole").value = f.role || "";
    document.getElementById("filterCustomer").value = f.customer || "";
    document.getElementById("filterLocation").value = f.location || "";
    document.getElementById("filterSkills").value = f.skills || "";
    document.getElementById("division").value = f.division || "Cloud & Development";
    document.getElementById("minGrade").value = f.minGrade || "A";
    document.getElementById("maxGrade").value = f.maxGrade || "D";
  });
}
