/**
 * AssetVault Framework Core Control Engine
 * Processes multi-tiered array lookups, calculates state aggregations, and manages data caching persistence loops.
 */

// 1. Initialize State Architecture (Inject mock data strings if storage database returns blank)
let assetLedger = JSON.parse(localStorage.getItem('vault_assets_data')) || [
    { id: 1, name: "AN/PRC-117G Radio System", serial: "SN-RADIO-8841", category: "Communications", status: "Deployed" },
    { id: 2, name: "Secure Database Server Bl. 4", serial: "SN-SVR-0024", category: "Hardware", status: "In Storage" },
    { id: 3, name: "Enterprise QuickBooks Core Asset License", serial: "LIC-INTUIT-77X", category: "Software", status: "Deployed" },
    { id: 4, name: "Tactical Navigation Terminal", serial: "SN-NAV-9912", category: "Communications", status: "Maintenance" }
];

// 2. Map Interface Input and Display Target Node Handles
const form = document.getElementById('asset-form');
const nameInput = document.getElementById('asset-name');
const serialInput = document.getElementById('asset-serial');
const catInput = document.getElementById('asset-category');
const statusInput = document.getElementById('asset-status');

const searchInput = document.getElementById('filter-search');
const filterCatSelect = document.getElementById('filter-category-select');
const tableBody = document.getElementById('vault-table-body');

const totalCount = document.getElementById('count-total');
const deployedCount = document.getElementById('count-deployed');
const storageCount = document.getElementById('count-storage');
const maintenanceCount = document.getElementById('count-maintenance');

// 3. Mathematical Analytical Counts Aggregator Engine
function calculateMetrics() {
    totalCount.textContent = assetLedger.length;
    deployedCount.textContent = assetLedger.filter(a => a.status === 'Deployed').length;
    storageCount.textContent = assetLedger.filter(a => a.status === 'In Storage').length;
    maintenanceCount.textContent = assetLedger.filter(a => a.status === 'Maintenance').length;
}

// 4. Data Filter & DOM Injection Architecture Matrix
function renderLedger() {
    tableBody.innerHTML = '';
    
    // Extract evaluation criteria properties from current dynamic filters input states
    const query = searchInput.value.toLowerCase().trim();
    const activeCategory = filterCatSelect.value;

    // Filter array vectors sequentially matching multiple user parameters in parallel
    const filteredAssets = assetLedger.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(query) || asset.serial.toLowerCase().includes(query);
        const matchesCategory = (activeCategory === 'ALL' || asset.category === activeCategory);
        return matchesSearch && matchesCategory;
    });

    // Loop filtered vector set to construct element objects dynamically
    filteredAssets.forEach(asset => {
        const row = document.createElement('tr');

        // Formulate type-specific visual badge overrides
        let tagClass = 'tag-deployed';
        if (asset.status === 'In Storage') tagClass = 'tag-storage';
        if (asset.status === 'Maintenance') tagClass = 'tag-maintenance';

        row.innerHTML = `
            <td style="font-weight: 600;">${asset.name}</td>
            <td style="font-family: monospace; color: var(--text-subtle);">${asset.serial}</td>
            <td>${asset.category}</td>
            <td><span class="status-tag ${tagClass}">${asset.status}</span></td>
            <td class="text-center"><button class="btn-purge" data-id="${asset.id}">De-Authorize</button></td>
        `;

        // Bind unique removal handlers directly to action buttons
        row.querySelector('.btn-purge').addEventListener('click', (e) => {
            purgeAsset(parseInt(e.target.getAttribute('data-id')));
        });

        tableBody.appendChild(row);
    });
}

// 5. Commit Additions Event Interceptor Handle Loop
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newAsset = {
        id: Date.now(),
        name: nameInput.value.trim(),
        serial: serialInput.value.trim().toUpperCase(),
        category: catInput.value,
        status: statusInput.value
    };

    assetLedger.push(newAsset);
    syncState();
    form.reset();
    nameInput.focus();
});

// 6. Delete/Purge Asset Routine Hook
function purgeAsset(assetId) {
    if (confirm("Are you sure you want to de-authorize this security asset from tracking vectors?")) {
        assetLedger = assetLedger.filter(a => a.id !== assetId);
        syncState();
    }
}

// 7. Global Persistence Synchronizer Hub
function syncState() {
    localStorage.setItem('vault_assets_data', JSON.stringify(assetLedger));
    calculateMetrics();
    renderLedger();
}

// 8. Dynamic Reactive Input Change Event Subscriptions
searchInput.addEventListener('input', renderLedger);
filterCatSelect.addEventListener('change', renderLedger);

// 9. Root Framework Bootstrap Call Run Trigger
calculateMetrics();
renderLedger();
