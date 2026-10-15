document.addEventListener('DOMContentLoaded', () => {
  // Application State Model Array
  let assetLedger = [];

  // DOM Component Elements Selectors
  const assetForm = document.getElementById('asset-form');
  const tableBody = document.getElementById('vault-table-body');
  
  // Metric Target Counter Selectors
  const countTotal = document.getElementById('count-total');
  const countDeployed = document.getElementById('count-deployed');
  const countStorage = document.getElementById('count-storage');
  const countMaintenance = document.getElementById('count-maintenance');

  // Query Control Filter Inputs Selectors
  const searchInput = document.getElementById('filter-search');
  const categorySelect = document.getElementById('filter-category-select');

  /* -------------------------------------------------------------
     1. Form Entry Submit Event Listener
  ------------------------------------------------------------- */
  if (assetForm) {
    assetForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('asset-name').value.trim();
      const serial = document.getElementById('asset-serial').value.trim();
      const category = document.getElementById('asset-category').value;
      const status = document.getElementById('asset-status').value;

      // Instantiate new data record object
      const newAsset = {
        id: 'ASSET-' + Date.now(),
        name,
        serial,
        category,
        status
      };

      // Push record array entry, reset form inputs, and synchronize calculations
      assetLedger.push(newAsset);
      assetForm.reset();
      updateApplicationPipeline();
    });
  }

  /* -------------------------------------------------------------
     2. Metrics Processing Calculations & Core Rendering Engine
  ------------------------------------------------------------- */
  function updateApplicationPipeline() {
    renderLedgerTable();
    calculateSummaryCounters();
  }

  function renderLedgerTable() {
    tableBody.innerHTML = '';

    const query = searchInput.value.toLowerCase().trim();
    const filterCategory = categorySelect.value;

    // Filter array pipeline matching constraints
    const filteredRecords = assetLedger.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(query) || asset.serial.toLowerCase().includes(query);
      const matchesCategory = (filterCategory === 'ALL' || asset.category === filterCategory);
      return matchesSearch && matchesCategory;
    });

    if (filteredRecords.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted); padding: 32px;">No matching assets committed to the ledger matrix.</td></tr>`;
      return;
    }

    // Build row layout markup fragments natively
    filteredRecords.forEach(asset => {
      const row = document.createElement('tr');
      
      // Determine corresponding badge status class variant
      let badgeClass = 'badge-storage';
      if (asset.status === 'Deployed') badgeClass = 'badge-deployed';
      if (asset.status === 'Maintenance') badgeClass = 'badge-maintenance';

      row.innerHTML = `
        <td><strong>${escapeHTML(asset.name)}</strong></td>
        <td style="font-family: monospace; letter-spacing: 0.5px;">${escapeHTML(asset.serial)}</td>
        <td>${asset.category}</td>
        <td><span class="badge ${badgeClass}">${asset.status}</span></td>
        <td class="text-center">
          <button class="btn-purge" data-id="${asset.id}" aria-label="Purge tracking record for ${escapeHTML(asset.name)}">Purge</button>
        </td>
      `;

      // Attach runtime event trigger to the dynamic list row removal action target button
      row.querySelector('.btn-purge').addEventListener('click', (e) => {
        const targetID = e.target.getAttribute('data-id');
        assetLedger = assetLedger.filter(item => item.id !== targetID);
        updateApplicationPipeline();
      });

      tableBody.appendChild(row);
    });
  }

  function calculateSummaryCounters() {
    let total = assetLedger.length;
    let deployed = assetLedger.filter(a => a.status === 'Deployed').length;
    let storage = assetLedger.filter(a => a.status === 'In Storage').length;
    let maintenance = assetLedger.filter(a => a.status === 'Maintenance').length;

    // Render calculations updates safely down to individual summary panels
    countTotal.textContent = total;
    countDeployed.textContent = deployed;
    countStorage.textContent = storage;
    countMaintenance.textContent = maintenance;
  }

  /* -------------------------------------------------------------
     3. Search Filter Logic Pipeline Hooks
  ------------------------------------------------------------- */
  if (searchInput) searchInput.addEventListener('input', renderLedgerTable);
  if (categorySelect) categorySelect.addEventListener('change', renderLedgerTable);

  /* Helper function protecting input fields against cross-site scripting strings */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
