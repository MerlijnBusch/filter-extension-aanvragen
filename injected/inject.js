(async function () {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = chrome.runtime.getURL("injected/style.css");
    document.head.appendChild(style);

    document.body.innerHTML = `
    <h1>Mijn Aanvragen 2.0</h1>

<div class="form-grid">
  <div class="form-group form-block">
    <label>Profile</label>
    <select id="profileSelect" style="width: 100%;"></select>
    <div style="display: flex; gap: 8px; margin-top: 8px; width: 100%;">
      <button id="saveProfile" style="flex: 1;">Save</button>
      <button id="loadProfile" style="flex: 1;">Load</button>
      <button id="deleteProfile" style="flex: 1;">Delete</button>
    </div>
  </div>

  <div class="form-group form-block">
    <label>Division</label>
    <select id="division" style="width: 100%;">
      <option>Cloud & Development</option>
      <option>Data & Integration Services</option>
      <option>Digital Manufacturing</option>
      <option>Diversen</option>
      <option>Online Sales Support</option>
      <option>Quality Engineering & Testing</option>
      <option>Security & Technology Transformation</option>
      <option>Staf/Management</option>
    </select>
    <div style="display: flex; gap: 8px; margin-top: 8px; width: 100%;">
      <select id="minGrade" style="flex: 1;">
        <option value="" disabled selected> Min Grade</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
      <select id="maxGrade" style="flex: 1;">
        <option value="" disabled selected> Max Grade</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
    </div>
  </div>
</div>

<div class="form-grid">
  <div class="form-group form-block">
    <label>Customer</label>
    <input type="text" id="filterCustomer" placeholder="e.g. Rabobank" style="width: 100%;">
    <label>Role</label>
    <input type="text" id="filterRole" placeholder="e.g. DevOps" style="width: 100%;">
  </div>

  <div class="form-group form-block">
    <label>Working Location</label>
    <input type="text" id="filterLocation" placeholder="e.g. Utrecht" style="width: 100%;">
    <label>Skills</label>
    <input type="text" id="filterSkills" placeholder="e.g. Python" style="width: 100%;">
  </div>
</div>

<div class="form-grid">
  <div class="form-group form-block">
    <label>&nbsp;</label>
    <button id="sendRequest" style="width: 100%;">Load Demands</button>
  </div>

  <div class="form-group form-block">
    <label>&nbsp;</label>
    <button id="clearFilters" style="width: 100%; margin-top: 8px;">Clear Filters</button>
  </div>
</div>

<div class="pagination-bar-container">
  <div class="pagination-bar">
    <button id="prevPage" style="width: 200px;">← Previous</button>
    <span id="pageIndicator" style="margin: 0 auto;">Page 1 of X</span>
    <button id="nextPage" style="width: 200px;">Next →</button>
  </div>
</div>

<div id="output" class="table-container"></div>
  `;

    const scripts = [
        "config.js",
        "injected/api.js",
        "injected/ui.js",
        "injected/logic.js",
        "injected/profile.js"
    ];

    for (const src of scripts) {
        await new Promise(resolve => {
            const s = document.createElement("script");
            s.src = chrome.runtime.getURL(src);
            s.onload = resolve;
            document.body.appendChild(s);
        })
    }

    document.getElementById("sendRequest").addEventListener("click", () => {
        window.dispatchEvent(new Event("loadDemands"));
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        window.dispatchEvent(new Event("nextPage"));
    });

    document.getElementById("prevPage").addEventListener("click", () => {
        window.dispatchEvent(new Event("prevPage"));
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
        window.dispatchEvent(new Event("clearFilters"));
    });

    window.dispatchEvent(new Event("loadDemands"));
})();
