// ── Config ────────────────────────────────────────────────────────────────────
let API_BASE = "http://127.0.0.1:8002";

// ── DOM References ────────────────────────────────────────────────────────────
const navToggle         = document.getElementById("navToggle");
const navMenu           = document.getElementById("navMenu");

const form              = document.getElementById("predictionForm");
const predictBtn        = document.getElementById("predictBtn");
const btnText           = document.getElementById("btnText");
const btnSpinner        = document.getElementById("btnSpinner");
const fillDemoBtn       = document.getElementById("fillDemoBtn");
const resetBtn          = document.getElementById("resetBtn");

const resultEmptyState  = document.getElementById("resultEmptyState");
const resultCard        = document.getElementById("resultCard");
const riskLevel         = document.getElementById("riskLevel");
const riskIcon          = document.getElementById("riskIcon");
const probBarFill       = document.getElementById("probBarFill");
const probValue         = document.getElementById("probValue");
const resultExpl        = document.getElementById("resultExplanation");
const predictedClassBadge = document.getElementById("predictedClassBadge");

const specDecisionThreshold = document.getElementById("specDecisionThreshold");
const specLowThreshold     = document.getElementById("specLowThreshold");
const specHighThreshold    = document.getElementById("specHighThreshold");
const specFeaturesComputed = document.getElementById("specFeaturesComputed");

const errorMsg          = document.getElementById("errorMsg");
const statusDot         = document.getElementById("statusDot");
const statusText        = document.getElementById("statusText");

// ── Theme Switcher (Dark / Light Mode) ────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");
const themeText   = document.getElementById("themeText");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
  }
  if (themeText) {
    themeText.textContent = theme === "light" ? "Light" : "Dark";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("dark");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
}

initTheme();

// ── Client-side Hash Router ───────────────────────────────────────────────────
// Only two actual "pages": page-home (with scroll sections) and page-predict.
// Navbar links for About/Features/HowItWorks scroll to anchors inside page-home.

const scrollSections = ["section-about", "section-features", "section-howitworks"];

function handleRoute() {
  const hash = window.location.hash || "#/home";

  // If hash is a scroll-section anchor (e.g. #section-about), show home & scroll
  const anchorId = hash.replace("#", "");
  if (scrollSections.includes(anchorId)) {
    // Make sure home page is visible
    document.querySelectorAll(".page-view").forEach(p => p.classList.add("hidden"));
    const homePage = document.getElementById("page-home");
    if (homePage) homePage.classList.remove("hidden");

    // Smooth scroll to the section (offset for sticky navbar)
    const target = document.getElementById(anchorId);
    if (target) {
      setTimeout(() => {
        const navHeight = document.querySelector(".navbar")?.offsetHeight || 70;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 50);
    }

    // Highlight the correct nav link
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
    if (navMenu) navMenu.classList.remove("open");
    return;
  }

  // Standard page routing (home or predict)
  const validRoutes = ["#/home", "#/predict"];
  const activeRoute = validRoutes.includes(hash) ? hash : "#/home";

  document.querySelectorAll(".page-view").forEach(page => page.classList.add("hidden"));
  const targetId = "page-" + activeRoute.replace("#/", "");
  const targetPage = document.getElementById(targetId);
  if (targetPage) targetPage.classList.remove("hidden");

  // Highlight nav links
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (activeRoute === "#/home") {
      // Home is active; also none of the scroll-links should be active
      link.classList.toggle("active", href === "#/home");
    } else {
      link.classList.toggle("active", href === activeRoute);
    }
  });

  if (navMenu) navMenu.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Scroll-spy: highlight About/Features/HowItWorks links when user scrolls past them
function updateScrollSpy() {
  // Only run on home page
  const homePage = document.getElementById("page-home");
  if (!homePage || homePage.classList.contains("hidden")) return;

  const navHeight = document.querySelector(".navbar")?.offsetHeight || 70;
  let activeSection = null;

  for (const id of scrollSections) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= navHeight + 80) {
        activeSection = id;
      }
    }
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (activeSection) {
      link.classList.toggle("active", href === "#" + activeSection);
    } else {
      // At the top of home page — highlight Home
      link.classList.toggle("active", href === "#/home");
    }
  });
}

window.addEventListener("scroll", updateScrollSpy, { passive: true });
window.addEventListener("hashchange", handleRoute);
window.addEventListener("DOMContentLoaded", handleRoute);


// Mobile Hamburger Toggle
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// ── Backend Health Check ──────────────────────────────────────────────────────
async function checkHealth() {
  const ports = ["8002", "8001", "8000"];
  for (const port of ports) {
    try {
      const url = `http://127.0.0.1:${port}/health`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        API_BASE = `http://127.0.0.1:${port}`;
        statusDot.className = "badge-dot online";
        statusText.textContent = `API Online (${port})`;
        return;
      }
    } catch {
      // check next port
    }
  }
  statusDot.className = "badge-dot offline";
  statusText.textContent = "API Offline";
}
checkHealth();
setInterval(checkHealth, 10000);

// ── Form Validation Helper ────────────────────────────────────────────────────
function clearInlineErrors() {
  document.querySelectorAll(".error-inline").forEach(el => {
    el.textContent = "";
    el.classList.remove("active");
  });
  document.querySelectorAll(".form-input, .form-select").forEach(input => {
    input.classList.remove("invalid");
  });
}

function showInlineError(fieldId, message) {
  const inputEl = document.getElementById(fieldId);
  const errEl = document.getElementById(`err_${fieldId}`);
  if (inputEl) inputEl.classList.add("invalid");
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add("active");
  }
}

function validateForm() {
  clearInlineErrors();
  let isValid = true;

  const rawPurchase = document.getElementById("purchase_datetime")?.value;
  const rawEst = document.getElementById("estimated_delivery_date")?.value;

  if (!rawPurchase) {
    showInlineError("purchase_datetime", "Purchase date and time is required");
    isValid = false;
  }

  if (!rawEst) {
    showInlineError("estimated_delivery_date", "Estimated delivery date is required");
    isValid = false;
  }

  // Date comparison: Estimated delivery date must be AFTER purchase date
  if (rawPurchase && rawEst) {
    const purchaseDate = new Date(rawPurchase);
    const estDate = new Date(`${rawEst}T23:59:59`);
    if (estDate <= purchaseDate) {
      showInlineError("estimated_delivery_date", "Estimated delivery date must be after purchase date");
      isValid = false;
    }
  }

  const custZip = parseInt(document.getElementById("customer_zip_prefix")?.value, 10);
  if (isNaN(custZip) || custZip < 1 || custZip > 99999) {
    showInlineError("customer_zip_prefix", "Valid 1 to 5 digit ZIP code required");
    isValid = false;
  }

  const sellerZip = parseInt(document.getElementById("seller_zip_prefix")?.value, 10);
  if (isNaN(sellerZip) || sellerZip < 1 || sellerZip > 99999) {
    showInlineError("seller_zip_prefix", "Valid 1 to 5 digit ZIP code required");
    isValid = false;
  }

  const category = document.getElementById("product_category")?.value;
  if (!category) {
    showInlineError("product_category", "Please select a product category");
    isValid = false;
  }

  const price = parseFloat(document.getElementById("price")?.value);
  if (isNaN(price) || price <= 0) {
    showInlineError("price", "Price must be greater than 0");
    isValid = false;
  }

  const freight = parseFloat(document.getElementById("freight_value")?.value);
  if (isNaN(freight) || freight < 0) {
    showInlineError("freight_value", "Freight value must be 0 or greater");
    isValid = false;
  }

  const weight = parseFloat(document.getElementById("weight_g")?.value);
  if (isNaN(weight) || weight <= 0) {
    showInlineError("weight_g", "Weight must be greater than 0");
    isValid = false;
  }

  ["length_cm", "height_cm", "width_cm"].forEach(dim => {
    const val = parseFloat(document.getElementById(dim)?.value);
    if (isNaN(val) || val <= 0) {
      showInlineError(dim, "Dimension must be greater than 0");
      isValid = false;
    }
  });

  return isValid;
}

// ── Read Raw Form Values into API Payload ────────────────────────────────────
function readFormPayload() {
  const rawPurchase = document.getElementById("purchase_datetime").value.trim();
  let purchase_datetime = rawPurchase.replace("T", " ");
  if (purchase_datetime.length === 16) {
    purchase_datetime += ":00";
  }

  const rawEst = document.getElementById("estimated_delivery_date").value.trim();

  const getInt = (id, def = 0) => {
    const val = parseInt(document.getElementById(id)?.value, 10);
    return isNaN(val) ? def : val;
  };
  const getFloat = (id, def = 0.0) => {
    const val = parseFloat(document.getElementById(id)?.value);
    return isNaN(val) ? def : val;
  };

  const payload = {
    purchase_datetime: purchase_datetime,
    estimated_delivery_date: rawEst,
    customer_zip_prefix: getInt("customer_zip_prefix", 1001),
    seller_zip_prefix: getInt("seller_zip_prefix", 4101),
    product_category: document.getElementById("product_category").value || "bed_bath_table",
    price: getFloat("price", 100.0),
    freight_value: getFloat("freight_value", 20.0),
    weight_g: getFloat("weight_g", 1000.0),
    length_cm: getFloat("length_cm", 20.0),
    height_cm: getFloat("height_cm", 10.0),
    width_cm: getFloat("width_cm", 15.0),
    payment_type: document.getElementById("payment_type").value || "credit_card",
    installments: getInt("installments", 1),
  };

  const item_val = document.getElementById("item_count")?.value.trim();
  if (item_val) payload.item_count = parseInt(item_val, 10);

  const seller_val = document.getElementById("seller_count")?.value.trim();
  if (seller_val) payload.seller_count = parseInt(seller_val, 10);

  const lag_val = document.getElementById("approval_lag_hours")?.value.trim();
  if (lag_val) payload.approval_lag_hours = parseFloat(lag_val);

  return payload;
}

// ── Risk Recommendations Config ───────────────────────────────────────────────
const RISK_CONFIG = {
  Low: {
    icon: "🟢",
    cls: "low",
    explanation: "This order exhibits a <strong>low probability</strong> of delay. Standard processing schedule applies — no intervention required.",
  },
  Medium: {
    icon: "🟡",
    cls: "med",
    explanation: "This order has a <strong>moderate risk</strong> of late delivery. Consider monitoring dispatch status and verifying seller shipping lead times.",
  },
  High: {
    icon: "🔴",
    cls: "high",
    explanation: "This order has a <strong>high probability</strong> of arriving late. Immediate operational intervention is recommended — contact the seller or escalate priority.",
  },
};

// ── Display Prediction Result ─────────────────────────────────────────────────
function displayResult(data) {
  const cfg = RISK_CONFIG[data.risk_label] || RISK_CONFIG["Medium"];
  const pct = (data.probability * 100).toFixed(1);

  // Hide empty state, show result card
  resultEmptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");

  // Update card risk class
  resultCard.className = `result-card ${cfg.cls}`;
  riskIcon.textContent = cfg.icon;
  riskLevel.textContent = data.risk_label;
  predictedClassBadge.textContent = data.predicted_class === 1 ? "Class: Late (1)" : "Class: On-Time (0)";

  // Update probability bar
  probValue.textContent = `${pct}%`;
  probBarFill.style.width = `${pct}%`;

  // Update recommendation text
  resultExpl.innerHTML = cfg.explanation;

  // Update specs details
  if (data.thresholds_used) {
    specDecisionThreshold.textContent = `${(data.thresholds_used.decision_threshold * 100).toFixed(1)}%`;
    specLowThreshold.textContent = `< ${(data.thresholds_used.low_threshold * 100).toFixed(0)}.0%`;
    specHighThreshold.textContent = `> ${(data.thresholds_used.high_threshold * 100).toFixed(0)}.0%`;
  }
  specFeaturesComputed.textContent = `${data.features_computed || 44} engineered`;

  // Smooth scroll to top of the page so the prediction result is immediately visible
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Error Messaging ───────────────────────────────────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
}

function setLoading(loading) {
  predictBtn.disabled = loading;
  btnText.textContent = loading ? "Computing ML Features…" : "Predict Delivery Risk";
  btnSpinner.classList.toggle("hidden", !loading);
}

function parseErrorMessage(errData) {
  if (!errData) return "Unknown error occurred";
  if (typeof errData === "string") return errData;
  if (errData.detail) {
    if (typeof errData.detail === "string") return errData.detail;
    if (Array.isArray(errData.detail)) {
      return errData.detail
        .map(item => `${item.loc ? item.loc.slice(1).join(".") : "field"}: ${item.msg}`)
        .join(" | ");
    }
    return JSON.stringify(errData.detail);
  }
  return JSON.stringify(errData);
}

// ── Form Submit Listener ──────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const payload = readFormPayload();

    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ detail: `HTTP ${res.status} error` }));
      throw new Error(parseErrorMessage(errJson));
    }

    const data = await res.json();
    displayResult(data);

  } catch (err) {
    showError(`❌ Prediction failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
});

// ── Load Sample Order Demo Values ─────────────────────────────────────────────
const DEMO_ORDER = {
  purchase_datetime: "2018-07-15T14:30",
  estimated_delivery_date: "2018-08-10",
  customer_zip_prefix: 1001,
  seller_zip_prefix: 4101,
  product_category: "bed_bath_table",
  price: 120.0,
  freight_value: 25.0,
  weight_g: 1500,
  length_cm: 30,
  height_cm: 15,
  width_cm: 20,
  payment_type: "credit_card",
  installments: 3,
  item_count: 1,
  seller_count: 1,
  approval_lag_hours: "",
};

fillDemoBtn.addEventListener("click", () => {
  // Expand all collapsible sections
  document.querySelectorAll(".collapsible-section").forEach(sec => sec.open = true);

  Object.entries(DEMO_ORDER).forEach(([id, val]) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = val;
    }
  });

  clearInlineErrors();
  hideError();
});

// ── Reset Form Listener ───────────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  form.reset();
  clearInlineErrors();
  hideError();

  // Reset result panel state
  resultCard.classList.add("hidden");
  resultEmptyState.classList.remove("hidden");
});
