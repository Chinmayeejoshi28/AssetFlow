// Fund Screener Functionality
window.fundScreenerInitialized = true;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Fund Screener components
  initFundScreener();
});

function initFundScreener() {
  // Get reference to the Fund Screener button
  const fundScreenerBtn = document.getElementById("fund-screener-btn");
  if (!fundScreenerBtn) return;

  // Add click event listener to show the fund screener modal
  fundScreenerBtn.addEventListener("click", showFundScreenerModal);

  // Initialize screener modal controls
  initializeScreenerModalControls();

  // Initialize filter events
  initializeFundFilters();

  // Initialize table sorting
  initializeTableSorting();
}

function showFundScreenerModal() {
  const modal = document.getElementById("fund-screener-modal");
  if (!modal) return;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function initializeScreenerModalControls() {
  const modal = document.getElementById("fund-screener-modal");
  if (!modal) return;

  // Close button functionality
  const closeBtn = modal.querySelector(".close-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Apply filters button
  const applyFiltersBtn = document.getElementById("apply-filters");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFundFilters);
  }

  // Export results button
  const exportResultsBtn = document.getElementById("export-results");
  if (exportResultsBtn) {
    exportResultsBtn.addEventListener("click", exportFundResults);
  }

  // Save screener button
  const saveScreenerBtn = document.getElementById("save-screener");
  if (saveScreenerBtn) {
    saveScreenerBtn.addEventListener("click", saveScreenerSettings);
  }

  // Load saved screener button
  const loadSavedScreenerBtn = document.getElementById("load-saved-screener");
  if (loadSavedScreenerBtn) {
    loadSavedScreenerBtn.addEventListener("click", loadSavedScreenerSettings);
  }

  // Show comparison button
  const showComparisonBtn = document.getElementById("show-comparison");
  if (showComparisonBtn) {
    showComparisonBtn.addEventListener("click", showFundComparison);
  }
}

function initializeFundFilters() {
  // Initialize multiple select dropdowns with Select2 if available
  if (typeof $.fn.select2 !== "undefined") {
    $("#fund-category").select2({
      placeholder: "Select fund categories",
      allowClear: true,
    });

    $("#risk-level").select2({
      placeholder: "Select risk levels",
      allowClear: true,
    });
  }

  // Initialize range inputs with noUiSlider if available
  // Or simple event handlers if not
  const returnInputs = document.querySelectorAll(
    "#return-1y, #return-3y, #return-5y"
  );
  returnInputs.forEach((input) => {
    input.addEventListener("input", function () {
      validateNumberInput(this, -100, 100);
    });
  });

  const aumInput = document.getElementById("min-aum");
  if (aumInput) {
    aumInput.addEventListener("input", function () {
      validateNumberInput(this, 0, 1000000);
    });
  }
}

function validateNumberInput(input, min, max) {
  let value = parseFloat(input.value);
  if (isNaN(value)) {
    input.value = "";
  } else {
    value = Math.max(min, Math.min(max, value));
    input.value = value;
  }
}

function initializeTableSorting() {
  const table = document.getElementById("screener-table");
  if (!table) return;

  const headers = table.querySelectorAll("thead th");
  headers.forEach((header) => {
    header.addEventListener("click", function () {
      sortTable(table, Array.from(headers).indexOf(this));
    });
  });
}

function sortTable(table, columnIndex) {
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // Determine sort direction
  const currentSortDir = table.getAttribute("data-sort-dir") || "asc";
  const newSortDir = currentSortDir === "asc" ? "desc" : "asc";

  // Sort the rows
  rows.sort((a, b) => {
    const aValue = a.querySelectorAll("td")[columnIndex].textContent.trim();
    const bValue = b.querySelectorAll("td")[columnIndex].textContent.trim();

    // Check if values are numbers
    const aNum = parseFloat(aValue.replace(/[₹,%]/g, ""));
    const bNum = parseFloat(bValue.replace(/[₹,%]/g, ""));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return newSortDir === "asc" ? aNum - bNum : bNum - aNum;
    }

    // Otherwise do a string comparison
    return newSortDir === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Update the DOM
  rows.forEach((row) => tbody.appendChild(row));

  // Update the sort direction
  table.setAttribute("data-sort-dir", newSortDir);

  // Update header styling
  const headers = table.querySelectorAll("thead th");
  headers.forEach((header, index) => {
    header.classList.remove("sort-asc", "sort-desc");
    if (index === columnIndex) {
      header.classList.add(newSortDir === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}

// Sample fund data - in a real application, this would come from a database or API
const sampleFunds = [
  {
    name: "ICICI Prudential Bluechip Fund",
    category: "Large Cap",
    rating: 5,
    aum: 33256,
    return1y: 17.28,
    return3y: 15.93,
    return5y: 14.25,
    riskLevel: "Moderate",
    nav: 78.56,
    expenseRatio: 1.67,
    minInvestment: 1000,
    exitLoad: "1% if redeemed within 1 year",
  },
  {
    name: "UTI Nifty Index Fund",
    category: "Index Fund",
    rating: 4,
    aum: 8945,
    return1y: 15.62,
    return3y: 14.89,
    return5y: 13.76,
    riskLevel: "Moderate",
    nav: 123.78,
    expenseRatio: 0.18,
    minInvestment: 5000,
    exitLoad: "0.25% if redeemed within 7 days",
  },
  {
    name: "Aditya Birla Liquid Fund",
    category: "Liquid Fund",
    rating: 5,
    aum: 42178,
    return1y: 6.12,
    return3y: 5.87,
    return5y: 6.01,
    riskLevel: "Low",
    nav: 345.84,
    expenseRatio: 0.47,
    minInvestment: 500,
    exitLoad: "0.1% if redeemed within 1 day",
  },
  {
    name: "HDFC Balanced Advantage Fund",
    category: "Hybrid",
    rating: 4,
    aum: 56732,
    return1y: 12.45,
    return3y: 11.92,
    return5y: 10.84,
    riskLevel: "Moderate",
    nav: 289.75,
    expenseRatio: 1.74,
    minInvestment: 5000,
    exitLoad: "1% if redeemed within 1 year",
  },
  {
    name: "Mirae Asset Tax Saver Fund",
    category: "ELSS",
    rating: 5,
    aum: 12378,
    return1y: 19.75,
    return3y: 18.32,
    return5y: 16.45,
    riskLevel: "High",
    nav: 32.45,
    expenseRatio: 1.83,
    minInvestment: 500,
    exitLoad: "N/A (Lock-in: 3 years)",
  },
  {
    name: "Franklin India Feeder US Opportunities Fund",
    category: "International",
    rating: 4,
    aum: 3782,
    return1y: 16.38,
    return3y: 14.27,
    return5y: 15.12,
    riskLevel: "High",
    nav: 45.67,
    expenseRatio: 2.15,
    minInvestment: 5000,
    exitLoad: "1% if redeemed within 1 year",
  },
  {
    name: "Axis Midcap Fund",
    category: "Mid Cap",
    rating: 5,
    aum: 18950,
    return1y: 21.36,
    return3y: 19.87,
    return5y: 17.56,
    riskLevel: "High",
    nav: 67.89,
    expenseRatio: 1.92,
    minInvestment: 1000,
    exitLoad: "1% if redeemed within 1 year",
  },
  {
    name: "SBI Small Cap Fund",
    category: "Small Cap",
    rating: 4,
    aum: 15678,
    return1y: 23.45,
    return3y: 20.12,
    return5y: 18.73,
    riskLevel: "Very High",
    nav: 89.45,
    expenseRatio: 2.05,
    minInvestment: 5000,
    exitLoad: "1% if redeemed within 1 year",
  },
  {
    name: "DSP Government Securities Fund",
    category: "Debt",
    rating: 4,
    aum: 2345,
    return1y: 5.67,
    return3y: 6.24,
    return5y: 7.12,
    riskLevel: "Low",
    nav: 56.78,
    expenseRatio: 1.23,
    minInvestment: 1000,
    exitLoad: "0.5% if redeemed within 3 months",
  },
  {
    name: "ICICI Prudential Technology Fund",
    category: "Sectoral",
    rating: 4,
    aum: 4567,
    return1y: 25.67,
    return3y: 22.45,
    return5y: 19.34,
    riskLevel: "Very High",
    nav: 125.67,
    expenseRatio: 2.34,
    minInvestment: 5000,
    exitLoad: "1% if redeemed within 1 year",
  },
];

// Set of funds selected for comparison
let selectedFundsForComparison = new Set();

function applyFundFilters() {
  // Get filter values
  const categories = getMultiSelectValues("fund-category");
  const minRating = parseInt(document.getElementById("min-rating").value) || 1;
  const minAum = parseInt(document.getElementById("min-aum").value) || 0;
  const minReturn1y =
    parseFloat(document.getElementById("return-1y").value) || -100;
  const minReturn3y =
    parseFloat(document.getElementById("return-3y").value) || -100;
  const minReturn5y =
    parseFloat(document.getElementById("return-5y").value) || -100;
  const riskLevels = getMultiSelectValues("risk-level");

  // Filter the funds
  const filteredFunds = sampleFunds.filter((fund) => {
    // Category filter
    if (
      categories.length > 0 &&
      !categories.includes(fund.category.toLowerCase().replace(" ", "-"))
    ) {
      return false;
    }

    // Rating filter
    if (fund.rating < minRating) {
      return false;
    }

    // AUM filter
    if (fund.aum < minAum) {
      return false;
    }

    // Returns filters
    if (
      fund.return1y < minReturn1y ||
      fund.return3y < minReturn3y ||
      fund.return5y < minReturn5y
    ) {
      return false;
    }

    // Risk level filter
    if (riskLevels.length > 0) {
      const fundRiskLower = fund.riskLevel.toLowerCase().replace(" ", "-");
      if (!riskLevels.includes(fundRiskLower)) {
        return false;
      }
    }

    return true;
  });

  // Display results
  displayFundResults(filteredFunds);
}

function getMultiSelectValues(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return [];

  // If using Select2
  if (typeof $.fn.select2 !== "undefined" && $(select).data("select2")) {
    return $(select).val() || [];
  }

  // Standard multi-select
  return Array.from(select.selectedOptions).map((option) => option.value);
}

function displayFundResults(funds) {
  const resultsSection = document.getElementById("screener-results");
  const resultsBody = document.getElementById("screener-results-body");

  if (!resultsSection || !resultsBody) return;

  // Show results section
  resultsSection.classList.remove("hidden");

  // Clear previous results
  resultsBody.innerHTML = "";

  // Add fund rows
  funds.forEach((fund) => {
    const row = document.createElement("tr");

    const isSelected = selectedFundsForComparison.has(fund.name);
    const rowClass = isSelected ? "selected-for-comparison" : "";
    row.className = rowClass;

    row.innerHTML = `
            <td>${fund.name}</td>
            <td>${fund.category}</td>
            <td>${"★".repeat(fund.rating)}</td>
            <td>₹${fund.aum} Cr</td>
            <td class="${getReturnClass(
              fund.return1y
            )}">${fund.return1y.toFixed(2)}%</td>
            <td class="${getReturnClass(
              fund.return3y
            )}">${fund.return3y.toFixed(2)}%</td>
            <td class="${getReturnClass(
              fund.return5y
            )}">${fund.return5y.toFixed(2)}%</td>
            <td>${fund.riskLevel}</td>
            <td>
                <button class="action-icon view-fund" title="View Fund Details"><i class="fas fa-eye"></i></button>
                <button class="action-icon compare-fund ${
                  isSelected ? "active" : ""
                }" title="Add to Compare"><i class="fas fa-balance-scale"></i></button>
                <button class="action-icon buy-fund" title="Invest Now"><i class="fas fa-shopping-cart"></i></button>
            </td>
        `;

    resultsBody.appendChild(row);

    // Add event listeners for action buttons
    const viewBtn = row.querySelector(".view-fund");
    const compareBtn = row.querySelector(".compare-fund");
    const buyBtn = row.querySelector(".buy-fund");

    viewBtn.addEventListener("click", () => viewFundDetails(fund));
    compareBtn.addEventListener("click", () =>
      toggleFundComparison(fund, compareBtn)
    );
    buyBtn.addEventListener("click", () => investInFund(fund));
  });

  // Update compare button state
  updateCompareButtonState();
}

function getReturnClass(returnValue) {
  if (returnValue > 0) return "positive";
  if (returnValue < 0) return "negative";
  return "";
}

function viewFundDetails(fund) {
  // In a real app, this would open a modal with detailed fund information
  alert(`Viewing details for ${fund.name}`);
}

function toggleFundComparison(fund, button) {
  if (selectedFundsForComparison.has(fund.name)) {
    selectedFundsForComparison.delete(fund.name);
    button.classList.remove("active");
  } else {
    if (selectedFundsForComparison.size >= 4) {
      alert("You can compare up to 4 funds at a time");
      return;
    }
    selectedFundsForComparison.add(fund.name);
    button.classList.add("active");
  }

  // Update parent row styling
  const row = button.closest("tr");
  if (selectedFundsForComparison.has(fund.name)) {
    row.classList.add("selected-for-comparison");
  } else {
    row.classList.remove("selected-for-comparison");
  }

  // Update compare button state
  updateCompareButtonState();
}

function updateCompareButtonState() {
  const compareButton = document.getElementById("show-comparison");
  if (!compareButton) return;

  if (selectedFundsForComparison.size >= 2) {
    compareButton.removeAttribute("disabled");
  } else {
    compareButton.setAttribute("disabled", "disabled");
  }
}

function investInFund(fund) {
  // In a real app, this would redirect to the investment page or open a modal
  alert(`Investing in ${fund.name}`);
}

function showFundComparison() {
  if (selectedFundsForComparison.size < 2) {
    alert("Please select at least 2 funds to compare");
    return;
  }

  // Get the selected funds data
  const selectedFunds = sampleFunds.filter((fund) =>
    selectedFundsForComparison.has(fund.name)
  );

  // Populate the comparison modal
  populateComparisonModal(selectedFunds);

  // Show the comparison modal
  const modal = document.getElementById("fund-comparison-modal");
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function populateComparisonModal(funds) {
  // Check if the modal elements exist
  const notification = document.getElementById("comparison-notification");
  const tableContainer = document.getElementById(
    "funds-comparison-table-container"
  );
  const tableHeader = document.querySelector(
    "#funds-comparison-table thead tr"
  );
  const tableBody = document.querySelector("#funds-comparison-table tbody");
  const selectedFundsList = document.getElementById("selected-funds-list");

  if (
    !notification ||
    !tableContainer ||
    !tableHeader ||
    !tableBody ||
    !selectedFundsList
  )
    return;

  // Hide notification if we have funds to compare
  if (funds.length >= 2) {
    notification.style.display = "none";
    tableContainer.style.display = "block";
  } else {
    notification.style.display = "block";
    tableContainer.style.display = "none";
    return;
  }

  // Update the selected funds list
  selectedFundsList.innerHTML = "";
  funds.forEach((fund) => {
    const fundItem = document.createElement("div");
    fundItem.className = "selected-fund-item";
    fundItem.innerHTML = `
            <span>${fund.name}</span>
            <button class="remove-fund" data-fund="${fund.name}"><i class="fas fa-times"></i></button>
        `;
    selectedFundsList.appendChild(fundItem);

    // Add event listener for remove button
    const removeBtn = fundItem.querySelector(".remove-fund");
    removeBtn.addEventListener("click", function () {
      const fundName = this.getAttribute("data-fund");
      removeFundFromComparison(fundName);
    });
  });

  // Update table header
  tableHeader.innerHTML = "<th>Features</th>";
  funds.forEach((fund) => {
    tableHeader.innerHTML += `<th>${fund.name}</th>`;
  });

  // Update table rows
  const rows = tableBody.querySelectorAll("tr");

  // Category row
  rows[0].innerHTML = "<td>Category</td>";
  funds.forEach((fund) => {
    rows[0].innerHTML += `<td>${fund.category}</td>`;
  });

  // Fund Type row
  rows[1].innerHTML = "<td>Fund Type</td>";
  funds.forEach((fund) => {
    const type = getFundType(fund.category);
    rows[1].innerHTML += `<td>${type}</td>`;
  });

  // Rating row
  rows[2].innerHTML = "<td>Rating</td>";
  funds.forEach((fund) => {
    rows[2].innerHTML += `<td>${"★".repeat(fund.rating)}</td>`;
  });

  // NAV row
  rows[3].innerHTML = "<td>NAV</td>";
  funds.forEach((fund) => {
    rows[3].innerHTML += `<td>₹${fund.nav.toFixed(2)}</td>`;
  });

  // AUM row
  rows[4].innerHTML = "<td>AUM</td>";
  funds.forEach((fund) => {
    rows[4].innerHTML += `<td>₹${fund.aum} Cr</td>`;
  });

  // Expense Ratio row
  rows[5].innerHTML = "<td>Expense Ratio</td>";
  funds.forEach((fund) => {
    rows[5].innerHTML += `<td>${fund.expenseRatio.toFixed(2)}%</td>`;
  });

  // 1Y Return row
  rows[6].innerHTML = "<td>1Y Return</td>";
  funds.forEach((fund) => {
    rows[6].innerHTML += `<td class="${getReturnClass(
      fund.return1y
    )}">${fund.return1y.toFixed(2)}%</td>`;
  });

  // 3Y Return row
  rows[7].innerHTML = "<td>3Y Return</td>";
  funds.forEach((fund) => {
    rows[7].innerHTML += `<td class="${getReturnClass(
      fund.return3y
    )}">${fund.return3y.toFixed(2)}%</td>`;
  });

  // 5Y Return row
  rows[8].innerHTML = "<td>5Y Return</td>";
  funds.forEach((fund) => {
    rows[8].innerHTML += `<td class="${getReturnClass(
      fund.return5y
    )}">${fund.return5y.toFixed(2)}%</td>`;
  });

  // Risk Level row
  rows[9].innerHTML = "<td>Risk Level</td>";
  funds.forEach((fund) => {
    rows[9].innerHTML += `<td>${fund.riskLevel}</td>`;
  });

  // Min. Investment row
  rows[10].innerHTML = "<td>Min. Investment</td>";
  funds.forEach((fund) => {
    rows[10].innerHTML += `<td>₹${fund.minInvestment}</td>`;
  });

  // Exit Load row
  rows[11].innerHTML = "<td>Exit Load</td>";
  funds.forEach((fund) => {
    rows[11].innerHTML += `<td>${fund.exitLoad}</td>`;
  });

  // Generate comparison chart
  generateComparisonChart(funds);
}

function getFundType(category) {
  // Determine fund type based on category
  if (
    [
      "Large Cap",
      "Mid Cap",
      "Small Cap",
      "Multi Cap",
      "ELSS",
      "Sectoral",
    ].includes(category)
  ) {
    return "Equity";
  } else if (
    [
      "Liquid Fund",
      "Ultra Short",
      "Short Duration",
      "Medium Duration",
      "Long Duration",
      "Debt",
    ].includes(category)
  ) {
    return "Debt";
  } else if (
    ["Hybrid", "Balanced Advantage", "Aggressive Hybrid"].includes(category)
  ) {
    return "Hybrid";
  } else if (category === "Index Fund") {
    return "Passive Equity";
  } else if (category === "International") {
    return "International Equity";
  } else {
    return "Other";
  }
}

function removeFundFromComparison(fundName) {
  // Remove from selectedFundsForComparison set
  selectedFundsForComparison.delete(fundName);

  // Update table in screener
  const compareButtons = document.querySelectorAll(".compare-fund");
  compareButtons.forEach((button) => {
    const row = button.closest("tr");
    const fundNameElement = row.querySelector("td:first-child");

    if (fundNameElement && fundNameElement.textContent === fundName) {
      button.classList.remove("active");
      row.classList.remove("selected-for-comparison");
    }
  });

  // Update compare button state
  updateCompareButtonState();

  // Update comparison modal
  const selectedFunds = sampleFunds.filter((fund) =>
    selectedFundsForComparison.has(fund.name)
  );
  populateComparisonModal(selectedFunds);

  // If no funds left to compare, close the modal
  if (selectedFunds.length < 2) {
    const modal = document.getElementById("fund-comparison-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
}

function generateComparisonChart(funds) {
  const chartContainer = document.getElementById("comparison-chart");
  if (!chartContainer) return;

  // Clear any existing chart
  chartContainer.innerHTML = "";

  // Create canvas element
  const canvas = document.createElement("canvas");
  canvas.id = "returns-chart";
  chartContainer.appendChild(canvas);

  // If Chart.js is available, create the chart
  if (typeof Chart !== "undefined") {
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["1Y Return", "3Y Return", "5Y Return"],
        datasets: funds.map((fund, index) => ({
          label: fund.name,
          data: [fund.return1y, fund.return3y, fund.return5y],
          backgroundColor: getChartColor(index),
          borderColor: getChartColor(index),
          borderWidth: 1,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Return (%)",
            },
          },
        },
      },
    });
  } else {
    // Simple fallback if Chart.js is not available
    const fallbackChart = document.createElement("div");
    fallbackChart.className = "fallback-chart";

    let chartHTML =
      '<table class="returns-table"><thead><tr><th>Fund</th><th>1Y Return</th><th>3Y Return</th><th>5Y Return</th></tr></thead><tbody>';

    funds.forEach((fund) => {
      chartHTML += `
                <tr>
                    <td>${fund.name}</td>
                    <td class="${getReturnClass(
                      fund.return1y
                    )}">${fund.return1y.toFixed(2)}%</td>
                    <td class="${getReturnClass(
                      fund.return3y
                    )}">${fund.return3y.toFixed(2)}%</td>
                    <td class="${getReturnClass(
                      fund.return5y
                    )}">${fund.return5y.toFixed(2)}%</td>
                </tr>
            `;
    });

    chartHTML += "</tbody></table>";
    fallbackChart.innerHTML = chartHTML;
    chartContainer.appendChild(fallbackChart);
  }
}

function getChartColor(index) {
  const colors = [
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(255, 99, 132, 0.7)",
  ];
  return colors[index % colors.length];
}

function exportFundResults() {
  // In a real app, this would generate a CSV or Excel file
  alert("Exporting results to CSV...");
}

function saveScreenerSettings() {
  // In a real app, this would save the current filter settings to user profile
  alert("Screener settings saved successfully");
}

function loadSavedScreenerSettings() {
  // In a real app, this would load saved filter settings from user profile
  alert("Loading saved screener settings...");
}

// Add event listener for the print comparison button
document.addEventListener("DOMContentLoaded", function () {
  const printComparisonBtn = document.getElementById("print-fund-comparison");
  if (printComparisonBtn) {
    printComparisonBtn.addEventListener("click", printFundComparison);
  }

  const emailComparisonBtn = document.getElementById("email-fund-comparison");
  if (emailComparisonBtn) {
    emailComparisonBtn.addEventListener("click", emailFundComparison);
  }

  const saveComparisonBtn = document.getElementById("save-fund-comparison");
  if (saveComparisonBtn) {
    saveComparisonBtn.addEventListener("click", saveFundComparison);
  }

  // Update comparison button event
  const updateComparisonBtn = document.getElementById("update-comparison");
  if (updateComparisonBtn) {
    updateComparisonBtn.addEventListener("click", updateFundComparison);
  }

  // Clear comparison button event
  const clearComparisonBtn = document.getElementById("clear-comparison");
  if (clearComparisonBtn) {
    clearComparisonBtn.addEventListener("click", clearFundComparison);
  }
});

function printFundComparison() {
  window.print();
}

function emailFundComparison() {
  // In a real app, this would open an email dialog or send via API
  alert("Email feature would be implemented here");
}

function saveFundComparison() {
  // In a real app, this would generate a PDF and download it
  alert("Saving comparison as PDF...");
}

function updateFundComparison() {
  // Get investor profile values
  const age = parseInt(document.getElementById("investor-age").value) || 30;
  const horizon =
    parseInt(document.getElementById("investment-horizon").value) || 10;
  const riskPreference =
    document.getElementById("risk-preference").value || "moderate";

  // Get the selected funds data
  const selectedFunds = sampleFunds.filter((fund) =>
    selectedFundsForComparison.has(fund.name)
  );

  // Update comparison with investor profile
  populateComparisonModal(selectedFunds);

  // Additional analysis could be added here based on investor profile
  alert(
    `Comparison updated with your investor profile: Age ${age}, ${horizon} year horizon, ${riskPreference} risk preference`
  );
}

function clearFundComparison() {
  // Clear selected funds
  selectedFundsForComparison.clear();

  // Update UI in screener table
  const compareButtons = document.querySelectorAll(".compare-fund");
  compareButtons.forEach((button) => {
    button.classList.remove("active");
    const row = button.closest("tr");
    if (row) {
      row.classList.remove("selected-for-comparison");
    }
  });

  // Update compare button state
  updateCompareButtonState();

  // Close comparison modal
  const modal = document.getElementById("fund-comparison-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}
