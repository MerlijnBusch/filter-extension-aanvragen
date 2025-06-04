function formatDate(obj) {
  if (!obj) return "";
  const pad = n => String(n).padStart(2, "0");
  return `${obj.year}-${pad(obj.month)}-${pad(obj.day)}`;
}

function generateTable(data) {
  const headers = ["Demand", "Customer", "Role", "Grade", "Start Date", "Location", "Community", "Skills"];
  let html = "<table><thead><tr>";
  headers.forEach(h => {
      headerClass = h.toLowerCase().replace(" ", "_");
      html += `<th class="${headerClass}">${h}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach(d => {
    html += `<tr class="clickable-row" data-id="${d.id}">`;
    html += `<td class="demand">${d.demandNumber}</td>`;
    html += `<td class="customer">${d.customer}</td>`;
    html += `<td class="role">${d.role}</td>`;
    html += `<td class="grade">${d.grade}</td>`;
    html += `<td class="start_date">${formatDate(d.startDate)}</td>`;
    html += `<td class="location">${d.workingLocation}</td>`;
    html += `<td class="community">${d.community}</td>`;
    html += `<td class="skills">${(d.requestedSkills || []).join(", ")}</td>`;
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
      window.open(detailUrl, "_blank");
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
