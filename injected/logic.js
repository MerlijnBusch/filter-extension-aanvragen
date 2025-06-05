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

window.requestBearerToken = function () {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Token request timed out"));
    }, 2000); // timeout in case no response

    function handleTokenResponse(event) {
      if (event.source !== window || event.data?.type !== "tokenResponse") return;
      window.removeEventListener("message", handleTokenResponse);
      clearTimeout(timeout);
      resolve(event.data.token);
    }

    window.addEventListener("message", handleTokenResponse);

    window.postMessage({ type: "getToken" }, "*");
  });
};


//window.fetchAndRenderDemands = function () {
//  console.log("test")
//  const division = document.getElementById("division").value;
//  const minGrade = document.getElementById("minGrade").value;
//  const maxGrade = document.getElementById("maxGrade").value;
//  const url = window.buildDemandUrl(division, minGrade, maxGrade, 1, 200);
//
//  console.log("test")
//  for (let i = 0; i < localStorage.length; i++) {
//    const key = localStorage.key(i);
//    console.log(key, localStorage.getItem(key));
//  }
//
//  fetch(url, {credentials: "include"})
//    .then(res => res.json())
//    .then(data => {
//      console.log(data)
//      window.allDemands = data.demands || [];
//      window.currentPage = 1;
//      window.renderFilteredTable();
//    })
//    .catch(error => {
//      document.getElementById("output").textContent = `Error: ${error.message}`;
//    });
//};

window.fetchAndRenderDemands = function () {
  const division = document.getElementById("division").value;
  const minGrade = document.getElementById("minGrade").value;
  const maxGrade = document.getElementById("maxGrade").value;
  const url = window.buildDemandUrl(division, minGrade, maxGrade, 1, 200);

  window.requestBearerToken()
    .then(token => {
      if (!token) throw new Error("No token available");

      return fetch(url, {
        headers: {
          Authorization: token,
          Accept: "application/json"
        }
      });
    })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Data received:", data);
      window.allDemands = data.demands || [];
      window.currentPage = 1;
      window.renderFilteredTable();
    })
    .catch(error => {
      console.error("❌ Error:", error);
      document.getElementById("output").textContent = `Error: ${error.message}`;
    });
};
