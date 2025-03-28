// Enhanced SIP Calculator Functionality
window.sipCalculatorInitialized = true;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize SIP Calculator components
  initSIPCalculator();
});

function initSIPCalculator() {
  // Get reference to the SIP calculator button
  const sipCalculatorBtn = document.getElementById("sip-calculator-btn");
  if (!sipCalculatorBtn) return;

  // Add click event listener to show the SIP calculator modal
  sipCalculatorBtn.addEventListener("click", showSIPCalculatorModal);

  // Initialize modal functionality
  initializeModalControls();

  // Initialize tab switching
  initializeTabs();

  // Initialize advanced options toggle
  initializeAdvancedOptions();

  // Initialize calculation buttons
  initializeCalculationButtons();

  // Initialize action buttons
  initializeActionButtons();
}

function showSIPCalculatorModal() {
  const modal = document.getElementById("sip-calculator-modal");
  if (!modal) return;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function initializeModalControls() {
  const modal = document.getElementById("sip-calculator-modal");
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
}

function initializeTabs() {
  const tabBtns = document.querySelectorAll(".calculator-tabs .tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs
      tabBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked tab
      btn.classList.add("active");

      // Hide all tab content
      const tabContents = document.querySelectorAll(".calculator-tab-content");
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show the corresponding tab content
      const tabId = btn.getAttribute("data-tab");
      const activeContent = document.getElementById(tabId);
      if (activeContent) {
        activeContent.classList.add("active");
      }

      // Hide results when switching tabs
      document.getElementById("sip-results").classList.add("hidden");
    });
  });
}

function initializeAdvancedOptions() {
  const advancedToggles = document.querySelectorAll(".advanced-toggle");

  advancedToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const advancedFields = this.nextElementSibling;
      advancedFields.classList.toggle("hidden");

      // Change icon based on open/close state
      const icon = this.querySelector(".fa-chevron-down, .fa-chevron-up");
      if (icon) {
        if (advancedFields.classList.contains("hidden")) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        } else {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      }
    });
  });
}

function initializeCalculationButtons() {
  // Basic SIP calculation
  const calculateBtn = document.getElementById("calculate-sip");
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateBasicSIP);
  }

  // Goal-based SIP calculation
  const calculateGoalBtn = document.getElementById("calculate-goal-sip");
  if (calculateGoalBtn) {
    calculateGoalBtn.addEventListener("click", calculateGoalBasedSIP);
  }
}

function initializeActionButtons() {
  // Save calculation
  const saveBtn = document.getElementById("save-calculation");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveSIPCalculation);
  }

  // Print calculation
  const printBtn = document.getElementById("print-calculation");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Share calculation
  const shareBtn = document.getElementById("share-calculation");
  if (shareBtn) {
    shareBtn.addEventListener("click", shareSIPCalculation);
  }

  // Show fund recommendations
  const recommendBtn = document.getElementById("show-recommendations");
  if (recommendBtn) {
    recommendBtn.addEventListener("click", showFundRecommendations);
  }
}

// Basic SIP Calculator Functions
function calculateBasicSIP() {
  // Get input values
  const monthlyInvestment = parseFloat(
    document.getElementById("monthly-investment").value
  );
  const expectedReturn = parseFloat(
    document.getElementById("expected-return").value
  );
  const investmentPeriod = parseFloat(
    document.getElementById("investment-period").value
  );

  // Get advanced options values
  const annualStepUp =
    parseFloat(document.getElementById("annual-step-up").value) || 0;
  const inflationRate =
    parseFloat(document.getElementById("inflation-rate").value) || 0;
  const taxRate = parseFloat(document.getElementById("tax-rate").value) || 0;

  // Validate inputs
  if (!validateSIPInputs(monthlyInvestment, expectedReturn, investmentPeriod)) {
    return;
  }

  // Calculate SIP with step-up
  const results = calculateSIPWithStepUp(
    monthlyInvestment,
    expectedReturn,
    investmentPeriod,
    annualStepUp
  );
  if (!results) {
    alert("Error calculating SIP. Please try again.");
    return;
  }

  // Calculate additional metrics if advanced options are used
  let additionalResults = {};
  if (annualStepUp > 0 || inflationRate > 0 || taxRate > 0) {
    additionalResults = calculateAdditionalMetrics(
      results,
      inflationRate,
      taxRate,
      monthlyInvestment,
      annualStepUp,
      investmentPeriod
    );
    document.getElementById("additional-results").classList.remove("hidden");
  } else {
    document.getElementById("additional-results").classList.add("hidden");
  }

  // Update results in UI
  updateSIPResults(results, additionalResults);

  // Show results section
  document.getElementById("sip-results").classList.remove("hidden");

  // Draw chart
  drawSIPChart(
    monthlyInvestment,
    expectedReturn,
    investmentPeriod,
    annualStepUp,
    inflationRate
  );
}

function calculateGoalBasedSIP() {
  // Get input values
  const goalAmount = parseFloat(
    document.getElementById("financial-goal").value
  );
  const goalPeriod = parseFloat(document.getElementById("goal-period").value);
  const expectedReturn = parseFloat(
    document.getElementById("goal-return-rate").value
  );

  // Get advanced options values
  const annualStepUp =
    parseFloat(document.getElementById("goal-step-up").value) || 0;
  const inflationRate =
    parseFloat(document.getElementById("goal-inflation-rate").value) || 0;

  // Validate inputs
  if (!validateGoalInputs(goalAmount, goalPeriod, expectedReturn)) {
    return;
  }

  // Adjust goal amount for inflation if specified
  const inflationAdjustedGoal =
    inflationRate > 0
      ? goalAmount * Math.pow(1 + inflationRate / 100, goalPeriod)
      : goalAmount;

  // Calculate required monthly SIP to reach the goal
  const monthlyInvestment = calculateRequiredSIP(
    inflationAdjustedGoal,
    expectedReturn,
    goalPeriod,
    annualStepUp
  );

  // Calculate full SIP details based on the required monthly investment
  const results = calculateSIPWithStepUp(
    monthlyInvestment,
    expectedReturn,
    goalPeriod,
    annualStepUp
  );
  if (!results) {
    alert("Error calculating SIP. Please try again.");
    return;
  }

  // Calculate additional metrics
  const additionalResults = calculateAdditionalMetrics(
    results,
    inflationRate,
    0,
    monthlyInvestment,
    annualStepUp,
    goalPeriod
  );
  if (inflationRate > 0) {
    document.getElementById("additional-results").classList.remove("hidden");
  } else {
    document.getElementById("additional-results").classList.add("hidden");
  }

  // Update UI with the calculated values
  document.getElementById("monthly-investment").value =
    Math.round(monthlyInvestment);
  document.getElementById("expected-return").value = expectedReturn;
  document.getElementById("investment-period").value = goalPeriod;

  // Update results in UI
  updateSIPResults(results, additionalResults);

  // Show results section
  document.getElementById("sip-results").classList.remove("hidden");

  // Draw chart
  drawSIPChart(
    monthlyInvestment,
    expectedReturn,
    goalPeriod,
    annualStepUp,
    inflationRate
  );

  // Switch to the basic SIP tab to show results
  document.querySelector('[data-tab="basic-sip"]').click();
}

function validateSIPInputs(
  monthlyInvestment,
  expectedReturn,
  investmentPeriod
) {
  if (isNaN(monthlyInvestment) || monthlyInvestment < 500) {
    alert("Please enter a valid monthly investment amount (minimum ₹500)");
    return false;
  }

  if (isNaN(expectedReturn) || expectedReturn < 1 || expectedReturn > 30) {
    alert("Please enter a valid expected return rate (between 1% and 30%)");
    return false;
  }

  if (
    isNaN(investmentPeriod) ||
    investmentPeriod < 1 ||
    investmentPeriod > 40
  ) {
    alert("Please enter a valid investment period (between 1 and 40 years)");
    return false;
  }

  return true;
}

function validateGoalInputs(goalAmount, goalPeriod, expectedReturn) {
  if (isNaN(goalAmount) || goalAmount < 10000) {
    alert("Please enter a valid goal amount (minimum ₹10,000)");
    return false;
  }

  if (isNaN(goalPeriod) || goalPeriod < 1 || goalPeriod > 40) {
    alert("Please enter a valid time to goal (between 1 and 40 years)");
    return false;
  }

  if (isNaN(expectedReturn) || expectedReturn < 1 || expectedReturn > 30) {
    alert("Please enter a valid expected return rate (between 1% and 30%)");
    return false;
  }

  return true;
}

function calculateSIPWithStepUp(
  monthlyInvestment,
  expectedReturn,
  timePeriod,
  annualStepUp = 0
) {
  try {
    // Convert percentage to decimal
    const ratePerMonth = expectedReturn / 100 / 12;
    const months = timePeriod * 12;
    const stepUpFactor = 1 + annualStepUp / 100;

    let totalInvestment = 0;
    let futureValue = 0;

    if (annualStepUp === 0) {
      // Standard SIP calculation without step-up
      totalInvestment = monthlyInvestment * months;
      futureValue =
        monthlyInvestment *
        ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) *
        (1 + ratePerMonth);
    } else {
      // Step-up SIP calculation
      let currentMonthlyInvestment = monthlyInvestment;

      for (let year = 0; year < timePeriod; year++) {
        // Calculate future value for this year's investments
        for (let month = 0; month < 12; month++) {
          const monthsRemaining = months - year * 12 - month;
          totalInvestment += currentMonthlyInvestment;
          futureValue +=
            currentMonthlyInvestment *
            Math.pow(1 + ratePerMonth, monthsRemaining);
        }

        // Increase the monthly investment for the next year
        if (year < timePeriod - 1) {
          currentMonthlyInvestment *= stepUpFactor;
        }
      }
    }

    // Calculate wealth gained
    const wealthGained = futureValue - totalInvestment;

    // Calculate final SIP amount after step-ups
    const finalMonthlySIP =
      monthlyInvestment * Math.pow(stepUpFactor, timePeriod - 1);

    return {
      totalInvestment: Math.round(totalInvestment),
      futureValue: Math.round(futureValue),
      wealthGained: Math.round(wealthGained),
      expectedReturnRate: expectedReturn,
      finalMonthlySIP: Math.round(finalMonthlySIP),
    };
  } catch (error) {
    console.error("Error calculating SIP:", error);
    return null;
  }
}

function calculateAdditionalMetrics(
  results,
  inflationRate,
  taxRate,
  initialMonthlyInvestment,
  annualStepUp,
  investmentPeriod
) {
  const inflationFactor = 1 - inflationRate / 100;
  const taxFactor = 1 - taxRate / 100;

  // Calculate inflation-adjusted future value
  const inflationAdjustedValue =
    results.futureValue * Math.pow(inflationFactor, investmentPeriod);

  // Calculate after-tax returns
  const principalAmount = results.totalInvestment;
  const capitalGains = results.wealthGained;
  const taxOnGains = taxRate > 0 ? capitalGains * (taxRate / 100) : 0;
  const afterTaxReturns = results.futureValue - taxOnGains;

  // Calculate real returns (inflation-adjusted)
  const nominalReturns = results.futureValue / results.totalInvestment - 1;
  const realReturns = inflationAdjustedValue / results.totalInvestment - 1;
  const annualRealReturn = Math.pow(1 + realReturns, 1 / investmentPeriod) - 1;

  return {
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    afterTaxReturns: Math.round(afterTaxReturns),
    realReturns: (annualRealReturn * 100).toFixed(2),
  };
}

function calculateRequiredSIP(
  goalAmount,
  expectedReturn,
  timePeriod,
  annualStepUp = 0
) {
  // Convert percentage to decimal
  const ratePerMonth = expectedReturn / 100 / 12;
  const months = timePeriod * 12;

  if (annualStepUp === 0) {
    // Standard calculation for required monthly SIP
    // Formula: P = A / (((1 + r)^n - 1) / r) * (1 + r)
    // Where: P = Monthly SIP, A = Goal Amount, r = Monthly Rate, n = Number of Months
    const monthlyInvestment =
      goalAmount /
      (((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) *
        (1 + ratePerMonth));
    return monthlyInvestment;
  } else {
    // For step-up SIP, use an approximation method
    // Start with an estimated SIP amount and adjust iteratively
    let estimatedSIP = goalAmount / (months * 1.5); // Initial guess
    const stepUpFactor = 1 + annualStepUp / 100;
    const tolerance = 100; // Acceptable difference in goal amount

    let iteration = 0;
    const maxIterations = 20;

    while (iteration < maxIterations) {
      const result = calculateSIPWithStepUp(
        estimatedSIP,
        expectedReturn,
        timePeriod,
        annualStepUp
      );
      const difference = result.futureValue - goalAmount;

      if (Math.abs(difference) < tolerance) {
        return estimatedSIP;
      }

      // Adjust the estimate based on the difference
      estimatedSIP = estimatedSIP * (goalAmount / result.futureValue);
      iteration++;
    }

    return estimatedSIP;
  }
}

function updateSIPResults(results, additionalResults = {}) {
  // Update basic results
  document.getElementById("total-investment").textContent = formatCurrency(
    results.totalInvestment
  );
  document.getElementById("future-value").textContent = formatCurrency(
    results.futureValue
  );
  document.getElementById("wealth-gained").textContent = formatCurrency(
    results.wealthGained
  );
  document.getElementById(
    "return-rate"
  ).textContent = `${results.expectedReturnRate}%`;

  // Update additional results if available
  if (Object.keys(additionalResults).length > 0) {
    document.getElementById("inflation-adjusted-value").textContent =
      formatCurrency(additionalResults.inflationAdjustedValue || 0);
    document.getElementById("after-tax-returns").textContent = formatCurrency(
      additionalResults.afterTaxReturns || 0
    );
    document.getElementById("final-monthly-sip").textContent = formatCurrency(
      results.finalMonthlySIP || 0
    );
    document.getElementById("real-returns").textContent = `${
      additionalResults.realReturns || 0
    }%`;
  }
}

function drawSIPChart(
  monthlyInvestment,
  expectedReturn,
  investmentPeriod,
  annualStepUp = 0,
  inflationRate = 0
) {
  const canvas = document.getElementById("sip-chart");
  const ctx = canvas.getContext("2d");

  // Clear previous chart
  if (window.sipChart) {
    window.sipChart.destroy();
  }

  // Generate data points
  const labels = [];
  const investedAmount = [];
  const expectedAmount = [];
  const inflationAdjustedAmount = [];

  let totalInvested = 0;
  let currentMonthlyInvestment = monthlyInvestment;
  const stepUpFactor = 1 + annualStepUp / 100;

  for (let year = 0; year <= investmentPeriod; year++) {
    labels.push(`Year ${year}`);

    // Calculate invested amount with step-up
    if (year > 0) {
      totalInvested += currentMonthlyInvestment * 12;
      if (year < investmentPeriod) {
        currentMonthlyInvestment *= stepUpFactor;
      }
    }

    investedAmount.push(totalInvested);

    // Calculate expected amount
    const result = calculateSIPWithStepUp(
      monthlyInvestment,
      expectedReturn,
      year,
      annualStepUp
    );
    expectedAmount.push(result ? result.futureValue : 0);

    // Calculate inflation-adjusted amount
    if (inflationRate > 0) {
      const inflationFactor = Math.pow(1 - inflationRate / 100, year);
      inflationAdjustedAmount.push(
        result ? result.futureValue * inflationFactor : 0
      );
    }
  }

  // Create datasets
  const datasets = [
    {
      label: "Amount Invested",
      data: investedAmount,
      borderColor: "#718096",
      backgroundColor: "rgba(113, 128, 150, 0.1)",
      fill: true,
    },
    {
      label: "Expected Value",
      data: expectedAmount,
      borderColor: "#667eea",
      backgroundColor: "rgba(102, 126, 234, 0.1)",
      fill: true,
    },
  ];

  // Add inflation-adjusted dataset if applicable
  if (inflationRate > 0) {
    datasets.push({
      label: "Inflation-Adjusted Value",
      data: inflationAdjustedAmount,
      borderColor: "#e53e3e",
      backgroundColor: "rgba(229, 62, 62, 0.1)",
      fill: true,
      borderDash: [5, 5],
    });
  }

  // Create new chart
  window.sipChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "SIP Growth Projection",
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return (
                context.dataset.label + ": " + formatCurrency(context.parsed.y)
              );
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
    },
  });
}

function saveSIPCalculation() {
  let calculationData = {
    date: new Date().toISOString(),
    type: document
      .querySelector(".calculator-tabs .tab-btn.active")
      .getAttribute("data-tab"),
    inputs: {},
  };

  // Get basic inputs
  calculationData.inputs.monthlyInvestment =
    document.getElementById("monthly-investment").value;
  calculationData.inputs.expectedReturn =
    document.getElementById("expected-return").value;
  calculationData.inputs.investmentPeriod =
    document.getElementById("investment-period").value;

  // Get advanced inputs if they exist
  if (
    !document
      .querySelector("#basic-sip .advanced-fields")
      .classList.contains("hidden")
  ) {
    calculationData.inputs.annualStepUp =
      document.getElementById("annual-step-up").value;
    calculationData.inputs.inflationRate =
      document.getElementById("inflation-rate").value;
    calculationData.inputs.taxRate = document.getElementById("tax-rate").value;
  }

  // Get goal-based inputs if they exist
  if (calculationData.type === "goal-based-sip") {
    calculationData.inputs.financialGoal =
      document.getElementById("financial-goal").value;
    calculationData.inputs.goalPeriod =
      document.getElementById("goal-period").value;
    calculationData.inputs.goalReturnRate =
      document.getElementById("goal-return-rate").value;

    if (
      !document
        .querySelector("#goal-based-sip .advanced-fields")
        .classList.contains("hidden")
    ) {
      calculationData.inputs.goalStepUp =
        document.getElementById("goal-step-up").value;
      calculationData.inputs.goalInflationRate = document.getElementById(
        "goal-inflation-rate"
      ).value;
    }
  }

  // Get results
  calculationData.results = {
    totalInvestment: document.getElementById("total-investment").textContent,
    futureValue: document.getElementById("future-value").textContent,
    wealthGained: document.getElementById("wealth-gained").textContent,
    returnRate: document.getElementById("return-rate").textContent,
  };

  // Get additional results if they exist
  if (
    !document.getElementById("additional-results").classList.contains("hidden")
  ) {
    calculationData.additionalResults = {
      inflationAdjustedValue: document.getElementById(
        "inflation-adjusted-value"
      ).textContent,
      afterTaxReturns: document.getElementById("after-tax-returns").textContent,
      finalMonthlySIP: document.getElementById("final-monthly-sip").textContent,
      realReturns: document.getElementById("real-returns").textContent,
    };
  }

  // Save to localStorage
  const savedCalculations = JSON.parse(
    localStorage.getItem("sipCalculations") || "[]"
  );
  savedCalculations.push(calculationData);
  localStorage.setItem("sipCalculations", JSON.stringify(savedCalculations));

  alert("Calculation saved successfully!");
}

function shareSIPCalculation() {
  // Gather all visible results
  let resultText = `SIP Calculator Results:\n\n`;

  // Basic inputs
  resultText += `Monthly Investment: ${
    document.getElementById("monthly-investment").value
  }\n`;
  resultText += `Expected Return: ${
    document.getElementById("expected-return").value
  }%\n`;
  resultText += `Investment Period: ${
    document.getElementById("investment-period").value
  } years\n\n`;

  // Advanced inputs if they exist
  if (
    !document
      .querySelector("#basic-sip .advanced-fields")
      .classList.contains("hidden")
  ) {
    resultText += `Annual Step-up: ${
      document.getElementById("annual-step-up").value
    }%\n`;
    resultText += `Inflation Rate: ${
      document.getElementById("inflation-rate").value
    }%\n`;
    resultText += `Tax Rate: ${document.getElementById("tax-rate").value}%\n\n`;
  }

  // Basic results
  resultText += `Total Investment: ${
    document.getElementById("total-investment").textContent
  }\n`;
  resultText += `Expected Future Value: ${
    document.getElementById("future-value").textContent
  }\n`;
  resultText += `Wealth Gained: ${
    document.getElementById("wealth-gained").textContent
  }\n`;
  resultText += `Return Rate: ${
    document.getElementById("return-rate").textContent
  }\n\n`;

  // Additional results if visible
  if (
    !document.getElementById("additional-results").classList.contains("hidden")
  ) {
    resultText += `Inflation-Adjusted Value: ${
      document.getElementById("inflation-adjusted-value").textContent
    }\n`;
    resultText += `After-Tax Returns: ${
      document.getElementById("after-tax-returns").textContent
    }\n`;
    resultText += `Final Monthly SIP: ${
      document.getElementById("final-monthly-sip").textContent
    }\n`;
    resultText += `Real Returns: ${
      document.getElementById("real-returns").textContent
    }\n`;
  }

  // Try to use Web Share API
  if (navigator.share) {
    navigator
      .share({
        title: "SIP Calculator Results",
        text: resultText,
      })
      .catch(console.error);
  } else {
    // Fallback for browsers that don't support Web Share API
    const textArea = document.createElement("textarea");
    textArea.value = resultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Results copied to clipboard!");
  }
}

function showFundRecommendations() {
  const monthlyInvestment = parseFloat(
    document.getElementById("monthly-investment").value
  );
  const investmentPeriod = parseFloat(
    document.getElementById("investment-period").value
  );
  const riskProfile = determineRiskProfile(monthlyInvestment, investmentPeriod);

  // Generate fund recommendations based on SIP amount and investment horizon
  const recommendations = generateFundRecommendations(
    monthlyInvestment,
    investmentPeriod,
    riskProfile
  );

  // Display the recommendations
  const recommendationsContainer = document.querySelector(
    ".recommendations-container"
  );
  recommendationsContainer.innerHTML = "";

  recommendations.forEach((fund) => {
    const fundElement = document.createElement("div");
    fundElement.className = "fund-recommendation";
    fundElement.innerHTML = `
            <h4>${fund.name}</h4>
            <p><strong>Category:</strong> ${fund.category}</p>
            <p><strong>Rating:</strong> ${fund.rating} ★</p>
            <p><strong>Returns:</strong> ${fund.returns}% (${fund.returnPeriod}Y)</p>
            <p><strong>Risk Level:</strong> ${fund.riskLevel}</p>
            <p class="match-reason">${fund.matchReason}</p>
            <div class="fund-actions">
                <button class="view-fund-details" data-fund="${fund.name}">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="add-to-compare-btn" data-fund="${fund.name}">
                    <i class="fas fa-balance-scale"></i> Compare
                </button>
            </div>
        `;
    recommendationsContainer.appendChild(fundElement);
  });

  // Show the recommendations section
  document.getElementById("fund-recommendations").classList.remove("hidden");

  // Add event listeners to the buttons
  const detailButtons = document.querySelectorAll(".view-fund-details");
  detailButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const fundName = e.currentTarget.getAttribute("data-fund");
      viewFundDetails(fundName);
    });
  });

  const compareButtons = document.querySelectorAll(".add-to-compare-btn");
  compareButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const fundName = e.currentTarget.getAttribute("data-fund");
      addFundToCompare(fundName);
    });
  });
}

function determineRiskProfile(monthlyInvestment, investmentPeriod) {
  // Determine risk profile based on investment amount and period
  if (investmentPeriod >= 15) {
    return "Aggressive";
  } else if (investmentPeriod >= 7) {
    return "Moderate";
  } else {
    return "Conservative";
  }
}

function generateFundRecommendations(
  monthlyInvestment,
  investmentPeriod,
  riskProfile
) {
  // Sample fund data - in a real app, this would come from an API or database
  const fundDatabase = [
    {
      name: "ICICI Prudential Bluechip Fund",
      category: "Large Cap",
      rating: 5,
      returns: 17.28,
      returnPeriod: 1,
      riskLevel: "Moderate",
      suitableFor: ["Moderate", "Aggressive"],
      minInvestment: 1000,
    },
    {
      name: "UTI Nifty Index Fund",
      category: "Index Fund",
      rating: 4,
      returns: 15.62,
      returnPeriod: 1,
      riskLevel: "Moderate",
      suitableFor: ["Conservative", "Moderate", "Aggressive"],
      minInvestment: 5000,
    },
    {
      name: "Aditya Birla Liquid Fund",
      category: "Liquid Fund",
      rating: 5,
      returns: 6.12,
      returnPeriod: 1,
      riskLevel: "Low",
      suitableFor: ["Conservative"],
      minInvestment: 500,
    },
    {
      name: "HDFC Balanced Advantage Fund",
      category: "Hybrid",
      rating: 4,
      returns: 12.45,
      returnPeriod: 1,
      riskLevel: "Moderate",
      suitableFor: ["Conservative", "Moderate"],
      minInvestment: 5000,
    },
    {
      name: "Mirae Asset Tax Saver Fund",
      category: "ELSS",
      rating: 5,
      returns: 19.75,
      returnPeriod: 1,
      riskLevel: "High",
      suitableFor: ["Moderate", "Aggressive"],
      minInvestment: 500,
    },
    {
      name: "Franklin India Feeder US Opportunities Fund",
      category: "International",
      rating: 4,
      returns: 16.38,
      returnPeriod: 1,
      riskLevel: "High",
      suitableFor: ["Aggressive"],
      minInvestment: 5000,
    },
    {
      name: "SBI Small Cap Fund",
      category: "Small Cap",
      rating: 4,
      returns: 20.5,
      returnPeriod: 3,
      riskLevel: "High",
      suitableFor: ["Aggressive"],
      minInvestment: 5000,
    },
    {
      name: "Axis Mid Cap Fund",
      category: "Mid Cap",
      rating: 5,
      returns: 18.3,
      returnPeriod: 3,
      riskLevel: "High",
      suitableFor: ["Moderate", "Aggressive"],
      minInvestment: 1000,
    },
  ];

  // Filter funds based on risk profile
  const matchingFunds = fundDatabase.filter(
    (fund) =>
      fund.suitableFor.includes(riskProfile) &&
      fund.minInvestment <= monthlyInvestment
  );

  // Sort by rating and returns
  matchingFunds.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.returns - a.returns;
  });

  // Generate reason for each fund
  const recommendations = matchingFunds.slice(0, 4).map((fund) => {
    let matchReason = "";

    if (fund.riskLevel === "Low" && riskProfile === "Conservative") {
      matchReason =
        "Recommended for your conservative profile with stable returns and low volatility.";
    } else if (fund.riskLevel === "Moderate" && riskProfile === "Moderate") {
      matchReason =
        "Balanced risk-return profile ideal for your moderate risk appetite.";
    } else if (fund.riskLevel === "High" && riskProfile === "Aggressive") {
      matchReason =
        "High growth potential suitable for your aggressive risk profile.";
    } else if (fund.category === "ELSS") {
      matchReason =
        "Tax-saving benefit under Section 80C with growth potential.";
    } else if (fund.category === "Liquid Fund") {
      matchReason =
        "High liquidity with stable returns, ideal for emergency funds.";
    } else if (fund.category === "Index Fund") {
      matchReason = "Lower expense ratio with market-matching returns.";
    } else if (fund.category === "International") {
      matchReason = "Geographical diversification to reduce portfolio risk.";
    } else {
      matchReason = `Strong historical performance with ${fund.returns}% returns.`;
    }

    return {
      ...fund,
      matchReason,
    };
  });

  return recommendations;
}

// Helper function to format currency
function formatCurrency(amount) {
  if (amount >= 10000000) {
    // Convert to Crores
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    // Convert to Lakhs
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

// These functions are placeholders that should be defined elsewhere in your application
function viewFundDetails(fundName) {
  console.log(`Viewing details for: ${fundName}`);
  // This would open the fund details modal
}

function addFundToCompare(fundName) {
  console.log(`Adding to comparison: ${fundName}`);
  // This would add the fund to the comparison list
}
