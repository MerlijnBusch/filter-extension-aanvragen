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
      <select id="profileSelect" class="full-width"></select>
      <div class="flex-row">
        <button id="saveProfile" class="flex-1">Save</button>
        <button id="loadProfile" class="flex-1">Load</button>
        <button id="deleteProfile" class="flex-1">Delete</button>
      </div>
    </div>
    <div class="form-group form-block">
      <label>Division</label>
      <select id="division" class="full-width">
        <option>Cloud & Development</option>
        <option>Data & Integration Services</option>
        <option>Digital Manufacturing</option>
        <option>Diversen</option>
        <option>Online Sales Support</option>
        <option>Quality Engineering & Testing</option>
        <option>Security & Technology Transformation</option>
        <option>Staf/Management</option>
      </select>
      <div class="flex-row">
        <select id="minGrade" class="flex-1">
          <option value="" disabled selected> Min Grade</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
        <select id="maxGrade" class="flex-1">
          <option value="" disabled selected> Max Grade</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
      </div>
    </div>
  </div>
  <details closed>
    <summary class="bold-1-1em">Filters</summary>
    <div class="form-grid">
      <div class="form-group form-block">
        <label>Customer</label>
        <input type="text" id="filterCustomer" placeholder="e.g. Rabobank" class="full-width">
        <label>Role</label>
        <input type="text" id="filterRole" placeholder="e.g. DevOps" class="full-width">
      </div>
      <div class="form-group form-block">
        <label>Working Location</label>
        <input type="text" id="filterLocation" placeholder="e.g. Utrecht" class="full-width">
        <label>Skills</label>
        <input type="text" id="filterSkills" placeholder="e.g. Python" class="full-width">
      </div>

      <div class="form-group form-block">
        <label for="offerStatus">Offer Status</label>
        <select id="filterOfferStatus" class="flex-1">
          <option value="">-- Geen filter --</option>
          <option value="0">Onbekend</option>
          <option value="1">Niet aangeboden</option>
          <option value="2">Afgewezen</option>
          <option value="3">Elders ingezet</option>
          <option value="4">Aangeboden aan sales</option>
          <option value="5">Aangeboden aan klant</option>
          <option value="6">Exclusief gereserveerd</option>
          <option value="7">Gereserveerd</option>
          <option value="8">Intake gepland</option>
          <option value="9">Ingezet</option>
          <option value="10">Vervallen</option>
        </select>

        <label for="filterMab">MAB</label>
        <select id="filterMab" class="flex-1">
          <option value="">--</option>
          <option value="true">Ja</option>
          <option value="false">Nee</option>
        </select>
      </div>

    </div>
  </details>
  <div class="form-grid">
    <div class="form-group form-block">
      <label>&nbsp;</label>
      <button id="sendRequest" class="full-width">Load Demands</button>
    </div>
    <div class="form-group form-block">
      <label>&nbsp;</label>
      <button id="clearFilters" class="full-width mt-8">Clear Filters</button>
    </div>
  </div>
  <div class="pagination-bar-container">
    <div class="pagination-bar">
      <button id="prevPage" class="wide-btn">← Previous</button>
      <span id="pageIndicator" class="centered">Page 1 of X</span>
      <button id="nextPage" class="wide-btn">Next →</button>
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
