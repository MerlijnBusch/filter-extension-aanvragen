function formatDate(obj) {
  if (!obj) return "";
  const pad = n => String(n).padStart(2, "0");
  return `${obj.year}-${pad(obj.month)}-${pad(obj.day)}`;
}

function generateTable(data) {
  const headers = [
    "Demand", "Customer", "Role", "Grade",
    "Start Date", "Location", "Community", "Skills"
  ];

  const createHeaderRow = () => {
    return headers.map(header => {
      const headerClass = header.toLowerCase().replace(/\s+/g, "_");
      return `<th class="${headerClass}">${header}</th>`;
    }).join("");
  };

  const createDataRow = (d) => {
    const skills = (d.requestedSkills || []).join(", ");
    return `
      <tr class="clickable-row" data-id="${d.id}">
        <td class="demand">${d.demandNumber}</td>
        <td class="customer">${d.customer}</td>
        <td class="role">${d.role}</td>
        <td class="grade">${d.grade}</td>
        <td class="start_date">${formatDate(d.startDate)}</td>
        <td class="location">${d.workingLocation}</td>
        <td class="community">${d.community}</td>
        <td class="skills">${skills}</td>
      </tr>
    `;
  };

  const tableHTML = `
    <table>
      <tbody>
        <tr>${createHeaderRow()}</tr>
        ${data.map(createDataRow).join("")}
      </tbody>
    </table>
  `;

  return tableHTML.trim();
}

function attachRowClickHandlers() {
  const rows = document.querySelectorAll(".clickable-row");

  rows.forEach(row => {
    row.addEventListener("click", () => {
      const id = row.dataset.id;
      if (!id) return;

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
