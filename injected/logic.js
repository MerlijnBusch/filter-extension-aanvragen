window.allDemands = [];
window.currentPage = 1;
window.itemsPerPage = 10;

console.log("Initializing filter events");

window.addEventListener("loadDemands", () => {
  window.fetchAndRenderDemands()
});

window.addEventListener("nextPage", () => {
  const totalPages = Math.ceil(window.allDemands.length / window.itemsPerPage);
  if (window.currentPage < totalPages) {
    window.currentPage++;
    window.renderFilteredTable();
  }
});

window.addEventListener("prevPage", () => {
  if (window.currentPage > 1) {
    window.currentPage--;
    window.renderFilteredTable();
  }
});

window.addEventListener("clearFilters", () => {
  document.getElementById("filterRole").value = "";
  document.getElementById("filterCustomer").value = "";
  document.getElementById("filterLocation").value = "";
  document.getElementById("filterSkills").value = "";
  window.currentPage = 1;
  window.renderFilteredTable();
});

document.querySelectorAll(
  '#filterRole, #filterCustomer, #filterLocation, #filterSkills, #division, #minGrade, #maxGrade'
).forEach(input => {
  input.addEventListener("input", () => {
    window.currentPage = 1;
    window.renderFilteredTable();
  });
});
//};

window.fetchAndRenderDemands = function () {
  console.log("test")
  const division = document.getElementById("division").value;
  const minGrade = document.getElementById("minGrade").value;
  const maxGrade = document.getElementById("maxGrade").value;
  const url = window.buildDemandUrl(division, minGrade, maxGrade, 1, 200);

  fetch(url, {credentials: "include"})
    .then(res => res.json())
    .then(data => {
      window.allDemands = data.demands || [];
      window.currentPage = 1;
      window.renderFilteredTable();
    })
    .catch(error => {
      document.getElementById("output").textContent = `Error: ${error.message}`;
    });
};
