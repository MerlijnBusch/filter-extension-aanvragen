(async function () {
  document.body.innerHTML = `
    <style>
      body { font-family: Arial; padding: 16px; background: #f8f9fa; }
      label { font-weight: bold; display: block; margin-top: 10px; }
      input, select {
        width: 100%;
        padding: 6px 8px;
        margin-top: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      button {
        padding: 6px 12px;
        margin-top: 10px;
        margin-right: 6px;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
      }
      .table-container {
        margin-top: 20px;
        max-height: 500px;
        overflow-y: auto;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #e9ecef;
      }
    </style>

    <h2>Demands Viewer (Injected)</h2>

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
          <option>A</option><option>B</option><option>C</option><option>D</option>
        </select>
      </div>
      <div style="width: 60px;">
        <label>Max</label>
        <select id="maxGrade">
          <option>A</option><option>B</option><option>C</option><option>D</option>
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

  // Dynamically load script files
  const scripts = ["config.js", "api.js", "ui.js", "logic.js"];
  for (const src of scripts) {
    await new Promise(resolve => {
      const s = document.createElement("script");
      s.src = chrome.runtime.getURL(src);
      s.onload = resolve;
      document.body.appendChild(s);
    })
  }

  // Dispatch custom events instead of direct logic calls
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

  // Initial auto-load
  window.dispatchEvent(new Event("loadDemands"));

  console.log(window.window.fetchAndRenderDemands())
//  setInterval(() => {
//    if (typeof window.setupFilterEvents === "function") {
//      window.setupFilterEvents();
//      window.fetchAndRenderDemands();
//    }
//  }, 100);
})();
