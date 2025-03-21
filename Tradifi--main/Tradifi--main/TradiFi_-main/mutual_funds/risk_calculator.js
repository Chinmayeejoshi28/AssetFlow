// Fund Risk Calculator Functionality
window.riskCalculatorInitialized = true;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Risk Calculator components
  initRiskCalculator();
});

function initRiskCalculator() {
  // Get reference to the Fund Risk Calculator button
  const riskCalculatorBtn = document.getElementById("fund-risk-calculator-btn");
  if (!riskCalculatorBtn) return;

  // Add click event listener to show the risk calculator modal
  riskCalculatorBtn.addEventListener("click", showRiskCalculatorModal);

  // Initialize modal functionality
  initializeRiskModalControls();

  // Initialize calculation button
  initializeRiskCalculationButton();
}

function showRiskCalculatorModal() {
  const modal = document.getElementById("fund-risk-calculator-modal");
  if (!modal) return;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function initializeRiskModalControls() {
  const modal = document.getElementById("fund-risk-calculator-modal");
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

function initializeRiskCalculationButton() {
  // Risk calculation button
  const calculateRiskBtn = document.getElementById("calculate-fund-risk");
  if (calculateRiskBtn) {
    calculateRiskBtn.addEventListener("click", calculateRiskProfile);
  }
}

function calculateRiskProfile() {
  // Get input values
  const age = parseInt(document.getElementById("fund-age").value);
  const investmentHorizon = parseInt(
    document.getElementById("investment-horizon").value
  );
  const investmentAmount = parseFloat(
    document.getElementById("fund-investment-amount").value
  );

  // Validate inputs
  if (!validateRiskInputs(age, investmentHorizon, investmentAmount)) {
    return;
  }

  // Calculate risk score
  const riskScore = calculateFundRiskScore(
    age,
    investmentHorizon,
    investmentAmount
  );

  // Update UI with risk profile
  updateFundRiskProfile(riskScore);

  // Show results section
  document.getElementById("fund-risk-results").classList.remove("hidden");
}

function validateRiskInputs(age, investmentHorizon, investmentAmount) {
  if (isNaN(age) || age < 18 || age > 100) {
    alert("Please enter a valid age between 18 and 100.");
    return false;
  }

  if (
    isNaN(investmentHorizon) ||
    investmentHorizon < 1 ||
    investmentHorizon > 40
  ) {
    alert("Please enter a valid investment horizon between 1 and 40 years.");
    return false;
  }

  if (isNaN(investmentAmount) || investmentAmount < 1000) {
    alert("Please enter a valid investment amount (minimum ₹1,000).");
    return false;
  }

  return true;
}

function calculateFundRiskScore(age, investmentHorizon, investmentAmount) {
  // Base score starts at 50 (neutral)
  let riskScore = 50;

  // Age factor: Younger investors can take more risk
  // Age range: 18-100, Score adjustment: +20 to -20
  const ageScore = Math.max(0, Math.min(20, 50 - age * 0.5));
  riskScore += ageScore;

  // Investment horizon factor: Longer horizon allows for more risk
  // Horizon range: 1-40 years, Score adjustment: -15 to +30
  const horizonScore = Math.max(
    -15,
    Math.min(30, (investmentHorizon - 5) * 1.5)
  );
  riskScore += horizonScore;

  // Investment amount factor: Higher amounts might lead to more conservative approach
  // This is subjective, but we'll implement a gentle curve
  // Amount range: ₹1,000+ with diminishing effect after ₹10,00,000
  // Score adjustment: +10 to -10
  const amountFactor =
    Math.log10(Math.min(1000000, investmentAmount) / 1000) * 5;
  const amountScore = Math.max(-10, Math.min(10, amountFactor - 5));
  riskScore += amountScore;

  // Normalize score between 0 and 100
  return Math.max(0, Math.min(100, riskScore));
}

function updateFundRiskProfile(riskScore) {
  // Update risk score display
  document.getElementById("fund-risk-score-value").textContent =
    riskScore.toFixed(0);

  // Position the risk indicator
  const riskIndicator = document.querySelector(
    "#fund-risk-results .risk-indicator"
  );
  riskIndicator.style.left = `${riskScore}%`;

  // Determine allocation based on risk score
  let equityAllocation, hybridAllocation, debtAllocation;

  if (riskScore < 33) {
    // Conservative portfolio
    debtAllocation = 60 + (33 - riskScore);
    hybridAllocation = 30 - (33 - riskScore) / 2;
    equityAllocation = 10 - (33 - riskScore) / 2;
  } else if (riskScore < 67) {
    // Moderate portfolio
    const scoreOffset = riskScore - 33;
    debtAllocation = 60 - scoreOffset;
    hybridAllocation = 30;
    equityAllocation = 10 + scoreOffset;
  } else {
    // Aggressive portfolio
    const scoreOffset = riskScore - 67;
    debtAllocation = 27 - scoreOffset / 3;
    hybridAllocation = 30 - scoreOffset / 3;
    equityAllocation = 43 + (2 * scoreOffset) / 3;
  }

  // Ensure minimum allocations and proper sum
  equityAllocation = Math.max(5, Math.round(equityAllocation));
  hybridAllocation = Math.max(5, Math.round(hybridAllocation));
  debtAllocation = Math.max(5, Math.round(debtAllocation));

  // Normalize to 100%
  const total = equityAllocation + hybridAllocation + debtAllocation;
  if (total !== 100) {
    const adjustment = (100 - total) / 3;
    equityAllocation = Math.round(equityAllocation + adjustment);
    hybridAllocation = Math.round(hybridAllocation + adjustment);
    debtAllocation = 100 - equityAllocation - hybridAllocation;
  }

  // Update allocation bars
  document.querySelector(
    "#debt-funds .allocation-value"
  ).textContent = `${debtAllocation}%`;
  document.querySelector(
    "#hybrid-funds .allocation-value"
  ).textContent = `${hybridAllocation}%`;
  document.querySelector(
    "#equity-funds .allocation-value"
  ).textContent = `${equityAllocation}%`;

  // Adjust allocation bar widths
  document.querySelector("#debt-funds").style.width = `${debtAllocation}%`;
  document.querySelector("#hybrid-funds").style.width = `${hybridAllocation}%`;
  document.querySelector("#equity-funds").style.width = `${equityAllocation}%`;

  // Update fund recommendations based on risk profile
  updateFundRecommendations(
    riskScore,
    equityAllocation,
    hybridAllocation,
    debtAllocation
  );
}

function updateFundRecommendations(
  riskScore,
  equityAllocation,
  hybridAllocation,
  debtAllocation
) {
  const recommendationsList = document.getElementById(
    "fund-recommendations-list"
  );
  recommendationsList.innerHTML = "";

  // Define fund recommendations based on risk profile
  let recommendations = [];

  if (riskScore < 33) {
    // Conservative recommendations
    recommendations = [
      "Liquid Funds: Short duration with high liquidity and low risk",
      "Ultra Short Duration Funds: Slightly higher returns than liquid funds with minimal risk",
      "Arbitrage Funds: Tax-efficient option for conservative investors",
      "Banking & PSU Debt Funds: High quality debt from public sector and banking entities",
    ];

    if (equityAllocation > 10) {
      recommendations.push(
        "Large Cap Funds: Stable equity exposure with blue-chip companies"
      );
    }
  } else if (riskScore < 67) {
    // Moderate recommendations
    recommendations = [
      "Short to Medium Duration Debt Funds: Balance between returns and safety",
      "Balanced Advantage Funds: Dynamic allocation between debt and equity",
      "Multi-Cap Funds: Diversified equity exposure across market capitalizations",
      "Value Funds: Focus on undervalued companies with strong fundamentals",
    ];

    if (debtAllocation > 30) {
      recommendations.push(
        "Corporate Bond Funds: Higher yields through quality corporate debt"
      );
    } else {
      recommendations.push(
        "Large & Mid Cap Funds: Growth potential with stability"
      );
    }
  } else {
    // Aggressive recommendations
    recommendations = [
      "Mid Cap Funds: Higher growth potential with moderate volatility",
      "Small Cap Funds: Maximum growth potential with higher risk",
      "Sectoral/Thematic Funds: Concentrated exposure to high-growth sectors",
      "Focused Equity Funds: Concentrated portfolio of high-conviction stocks",
    ];

    if (debtAllocation > 15) {
      recommendations.push(
        "Credit Risk Funds: Higher yields through lower-rated debt"
      );
    } else {
      recommendations.push(
        "International Funds: Geographical diversification with growth focus"
      );
    }
  }

  // Add recommendations to the list
  recommendations.forEach((recommendation) => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-check-circle"></i> ${recommendation}`;
    recommendationsList.appendChild(li);
  });
}
