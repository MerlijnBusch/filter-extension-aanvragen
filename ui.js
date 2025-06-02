function formatDate(obj) {
  if (!obj) return "";
  const pad = n => String(n).padStart(2, "0");
  return `${obj.year}-${pad(obj.month)}-${pad(obj.day)}`;
}

function generateTable(data) {
  const headers = ["Demand #", "Customer", "Role", "Grade", "Start Date", "Location", "Community", "Skills"];
  let html = "<table><thead><tr>";
  headers.forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach(d => {
    html += `<tr class="clickable-row" data-id="${d.id}">`;
    html += `<td>${d.demandNumber}</td>`;
    html += `<td>${d.customer}</td>`;
    html += `<td>${d.role}</td>`;
    html += `<td>${d.grade}</td>`;
    html += `<td>${formatDate(d.startDate)}</td>`;
    html += `<td>${d.workingLocation}</td>`;
    html += `<td>${d.community}</td>`;
    html += `<td>${(d.requestedSkills || []).join(", ")}</td>`;
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

function attachRowClickHandlers() {
  document.querySelectorAll(".clickable-row").forEach(row => {
    row.addEventListener("click", () => {
      const id = row.getAttribute("data-id");
      const detailUrl = `${CONFIG.DETAIL_URL_BASE}${id}`;
      chrome.tabs.create({ url: detailUrl });
    });
  });
}

function renderFilteredTable() {
  const roleFilter = document.getElementById("filterRole").value.toLowerCase();
  const customerFilter = document.getElementById("filterCustomer").value.toLowerCase();
  const locationFilter = document.getElementById("filterLocation").value.toLowerCase();
  const skillsFilter = document.getElementById("filterSkills").value.toLowerCase();

  const filtered = allDemands.filter(d => {
    const roleMatch = d.role?.toLowerCase().includes(roleFilter);
    const customerMatch = d.customer?.toLowerCase().includes(customerFilter);
    const locationMatch = d.workingLocation?.toLowerCase().includes(locationFilter);
    const skillsMatch = d.requestedSkills?.join(" ").toLowerCase().includes(skillsFilter);
    return roleMatch && customerMatch && locationMatch && skillsMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);

  const output = document.getElementById("output");
  output.innerHTML = generateTable(pageItems);
  attachRowClickHandlers();

  document.getElementById("pageIndicator").textContent = `Page ${currentPage} of ${totalPages}`;
}
