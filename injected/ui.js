function formatDate(obj) {
    if (!obj) return "";
    const pad = n => String(n).padStart(2, "0");
    return `${obj.year}-${pad(obj.month)}-${pad(obj.day)}`;
}

const OFFER_STATUS_LABELS = [
    "Onbekend",                 // 0 (None)
    "Niet aangeboden",          // 1 (NotOffered)
    "Afgewezen",                // 2 (Rejected)
    "Elders ingezet",           // 3 (DeployedElsewhere)
    "Aangeboden aan sales",     // 4 (OfferedToSales)
    "Aangeboden aan klant",     // 5 (OfferedToCustomer)
    "Exclusief gereserveerd",   // 6 (ExclusiefRegisterd)
    "Gereserveerd",             // 7 (ReservedForDeployment)
    "Intake gepland",           // 8 (IntakePlannend)
    "Ingezet",                  // 9 (Deployed)
    "Vervallen"                 // 10 (Cancelled)
];

function generateTable(data) {
    const headers = [
        "Status",
        "MAB",
        "Community",
        "Customer",
        "Role",
        "Grade",
        "Location",
        "Start Date",
        "Skills",
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
        <td class="status">${OFFER_STATUS_LABELS[d.offerStatus] ?? "Onbekend"}</td>
        <td class="mab">${d.mabSent}</td>
        <td class="community">${d.community}</td>
        <td class="customer">${d.customer}</td>
        <td class="role">${d.role}</td>
        <td class="grade">${d.grade}</td>
        <td class="location">${d.workingLocation}</td>
        <td class="start_date">${formatDate(d.startDate)}</td>
        <td class="skills">${skills}</td>
      </tr>
    `;
    };

    console.log(data)
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
        console.log(d)
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
