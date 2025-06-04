(async function () {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("injected/style.css");
  document.head.appendChild(style);

  document.body.innerHTML = `
    <h2>Demands Viewer (Injected)</h2>

    <div style="margin-top: 10px;">
      <label>Profile</label>
      <select id="profileSelect" style="width: 200px;"></select>
      <button id="saveProfile">Save</button>
      <button id="loadProfile">Load</button>
      <button id="deleteProfile">Delete</button>
    </div>

    <div style="display: flex; gap: 10px;">
      <div style="width: 300px;">
        <label>Division</label>
        <select id="division">
          <option>Cloud & Development</option>
          <option>Data & Integration Services</option>
          <option>Digital Manufacturing</option>
          <option>Diversen</option>
          <option>Online Sales Support</option>
          <option>Quality Engineering & Testing</option>
          <option>Security & Technology Transformation</option>
          <option>Staf/Management</option>
        </select>
      </div>
      <div style="width: 60px;">
        <label>Min</label>
        <select id="minGrade">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
      </div>
      <div style="width: 60px;">
        <label>Max</label>
        <select id="maxGrade">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
      </div>
    </div>

    <div style="margin-top: 10px; width: 300px;">
      <label>Role</label>
      <input type="text" id="filterRole" placeholder="e.g. DevOps">
      <label>Customer</label>
      <input type="text" id="filterCustomer" placeholder="e.g. Rabobank">
      <label>Working Location</label>
      <input type="text" id="filterLocation" placeholder="e.g. Utrecht">
      <label>Requested Skills</label>
      <input type="text" id="filterSkills" placeholder="e.g. Python">
    </div>

    <div style="margin-top: 10px;">
      <button id="prevPage">← Previous</button>
      <span id="pageIndicator">Page 1</span>
      <button id="nextPage">Next →</button>
    </div>

    <button id="sendRequest">Load Demands</button>
    <button id="clearFilters">Clear Filters</button>
    <button id="saveJson">Save JSON</button>
    <button id="saveCsv">Save CSV</button>

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
