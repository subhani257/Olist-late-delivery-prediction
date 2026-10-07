// Olist Risk Predictor - Frontend JavaScript Application

const API_BASE_URL = 'http://127.0.0.1:8002';

// 1. Theme Toggle Management
function toggleTheme() {
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle-btn');
  
  if (htmlEl.classList.contains('dark')) {
    htmlEl.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      `;
    }
  } else {
    htmlEl.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      `;
    }
  }
}

// 2. Health Check Polling
async function checkHealth() {
  const statusPill = document.getElementById('api-status-pill');
  const statusText = document.getElementById('api-status-text');
  const offlineBanner = document.getElementById('offline-banner');

  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      if (statusPill) {
        statusPill.className = 'status-pill online';
      }
      if (statusText) statusText.innerText = 'API Online: 8002';
      if (offlineBanner) offlineBanner.style.display = 'none';
    } else {
      throw new Error('API degraded');
    }
  } catch (err) {
    if (statusPill) {
      statusPill.className = 'status-pill offline';
    }
    if (statusText) statusText.innerText = 'API Offline';
    if (offlineBanner) offlineBanner.style.display = 'flex';
  }
}

// 3. Navigation & Separate View Routing
function navigateTo(sectionId) {
  const landingView = document.getElementById('view-landing');
  const predictView = document.getElementById('view-predict');

  // Update active nav button
  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${sectionId}`);
  if (activeBtn) activeBtn.classList.add('active');

  if (sectionId === 'predict') {
    // Show dedicated Predict Risk view
    if (landingView) landingView.style.display = 'none';
    if (predictView) predictView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Show Landing view & scroll to target section
    if (predictView) predictView.style.display = 'none';
    if (landingView) landingView.style.display = 'block';

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }

  setupScrollReveal();
}

// 4. Hero Simulator Slider
function updateHeroSim(distanceKm) {
  const distText = document.getElementById('hero-distance-text');
  const sliderVal = document.getElementById('slider-dist-val');
  const riskPct = document.getElementById('hero-risk-pct');
  const riskLabel = document.getElementById('hero-risk-label');
  const circle = document.getElementById('hero-gauge-circle');

  const dist = Number(distanceKm);
  if (distText) distText.innerText = `${dist.toLocaleString()} km`;
  if (sliderVal) sliderVal.innerText = `${dist.toLocaleString()} km`;

  // Calculate dynamic risk %
  const risk = Math.min(96, Math.max(12, Math.round((dist / 2800) * 85 + 10)));
  if (riskPct) riskPct.innerText = `${risk}%`;

  // Update SVG Arc Gauge Dashoffset (circumference 251.2)
  if (circle) {
    const offset = 251.2 * (1 - risk / 100);
    circle.style.strokeDashoffset = offset;

    if (risk > 55) {
      circle.style.stroke = 'var(--risk-high)';
      if (riskLabel) {
        riskLabel.innerText = 'HIGH RISK';
        riskLabel.style.color = 'var(--risk-high)';
        riskLabel.style.background = 'var(--risk-high-bg)';
      }
    } else if (risk > 30) {
      circle.style.stroke = 'var(--risk-med)';
      if (riskLabel) {
        riskLabel.innerText = 'MEDIUM RISK';
        riskLabel.style.color = 'var(--risk-med)';
        riskLabel.style.background = 'var(--risk-med-bg)';
      }
    } else {
      circle.style.stroke = 'var(--risk-low)';
      if (riskLabel) {
        riskLabel.innerText = 'LOW RISK';
        riskLabel.style.color = 'var(--risk-low)';
        riskLabel.style.background = 'var(--risk-low-bg)';
      }
    }
  }
}

// 5. Bento Category Filter
function filterBento(category, btnEl) {
  document.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const cards = document.querySelectorAll('#bento-container .saas-card');
  cards.forEach((card) => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'All' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}

// 6. Presets Fill Function
function fillPreset(type) {
  if (type === 'high') {
    document.getElementById('purchase_datetime').value = '2018-05-10 10:00:00';
    document.getElementById('estimated_delivery_date').value = '2018-05-13 00:00:00';
    document.getElementById('seller_zip_prefix').value = '1000';
    document.getElementById('customer_zip_prefix').value = '69000'; // Manaus AM
    document.getElementById('weight_g').value = '15000';
    document.getElementById('length_cm').value = '80';
    document.getElementById('height_cm').value = '40';
    document.getElementById('width_cm').value = '50';
    document.getElementById('product_category').value = 'moveis_decoracao';
    document.getElementById('price').value = '50.00';
    document.getElementById('freight_value').value = '120.00';
    document.getElementById('payment_type').value = 'boleto';
    document.getElementById('installments').value = '1';
    document.getElementById('approval_lag_hours').value = '48.0';
    document.getElementById('item_count').value = '2';
  } else {
    document.getElementById('purchase_datetime').value = '2018-05-15 14:30:00';
    document.getElementById('estimated_delivery_date').value = '2018-05-28 00:00:00';
    document.getElementById('seller_zip_prefix').value = '1000';
    document.getElementById('customer_zip_prefix').value = '20000'; // Rio de Janeiro
    document.getElementById('weight_g').value = '1500';
    document.getElementById('length_cm').value = '32';
    document.getElementById('height_cm').value = '18';
    document.getElementById('width_cm').value = '22';
    document.getElementById('product_category').value = 'cama_mesa_banho';
    document.getElementById('price').value = '149.90';
    document.getElementById('freight_value').value = '24.50';
    document.getElementById('payment_type').value = 'credit_card';
    document.getElementById('installments').value = '3';
    document.getElementById('approval_lag_hours').value = '2.5';
    document.getElementById('item_count').value = '1';
  }
}
window.fillPreset = fillPreset;

// 6b. Clear Form Function
function clearForm() {
  const form = document.getElementById('predict-form');
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.value = '';
      input.setAttribute('value', '');
      if (input.tagName.toLowerCase() === 'select') {
        input.selectedIndex = 0;
      }
    });
  }

  const fields = [
    'purchase_datetime',
    'estimated_delivery_date',
    'seller_zip_prefix',
    'customer_zip_prefix',
    'weight_g',
    'length_cm',
    'height_cm',
    'width_cm',
    'product_category',
    'price',
    'freight_value',
    'installments',
    'approval_lag_hours',
    'item_count'
  ];

  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.setAttribute('value', '');
    }
  });

  const paymentSelect = document.getElementById('payment_type');
  if (paymentSelect) paymentSelect.selectedIndex = 0;

  const resultContainer = document.getElementById('result-container');
  if (resultContainer) {
    resultContainer.style.display = 'none';
  }
}

window.clearForm = clearForm;

document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('btn-reset-form');
  if (resetBtn) {
    resetBtn.addEventListener('click', clearForm);
  }
});

// 7. Form Submission Handler
async function handlePredictSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-predict');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Executing Inference...</span>`;
  }

  const getItemVal = (id, defaultVal) => {
    const el = document.getElementById(id);
    if (!el || el.value === '' || el.value === null || el.value === undefined) return defaultVal;
    return el.value;
  };

  const getNumVal = (id, defaultVal, minVal = null) => {
    const val = getItemVal(id, defaultVal);
    const num = Number(val);
    if (isNaN(num)) return defaultVal;
    if (minVal !== null && num < minVal) return minVal;
    return num;
  };

  const payload = {
    purchase_datetime: String(getItemVal('purchase_datetime', '2018-05-15 14:30:00')).trim() || '2018-05-15 14:30:00',
    estimated_delivery_date: String(getItemVal('estimated_delivery_date', '2018-05-28 00:00:00')).trim() || '2018-05-28 00:00:00',
    seller_zip_prefix: Math.min(Math.max(getNumVal('seller_zip_prefix', 1000, 1), 1), 99999),
    customer_zip_prefix: Math.min(Math.max(getNumVal('customer_zip_prefix', 20000, 1), 1), 99999),
    weight_g: getNumVal('weight_g', 1500, 0),
    length_cm: getNumVal('length_cm', 32, 0.1),
    height_cm: getNumVal('height_cm', 18, 0.1),
    width_cm: getNumVal('width_cm', 22, 0.1),
    product_category: String(getItemVal('product_category', 'cama_mesa_banho')).trim() || 'cama_mesa_banho',
    price: getNumVal('price', 149.90, 0.01),
    freight_value: getNumVal('freight_value', 24.50, 0),
    payment_type: String(getItemVal('payment_type', 'credit_card')).toLowerCase(),
    installments: Math.min(Math.max(getNumVal('installments', 3, 0), 0), 24),
    approval_lag_hours: getNumVal('approval_lag_hours', 2.5, 0),
    item_count: getNumVal('item_count', 1, 1),
    seller_count: getNumVal('seller_count', 1, 1),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const detailMsg = errorJson.detail ? JSON.stringify(errorJson.detail) : `HTTP ${res.status}`;
      throw new Error(`Validation Error (${detailMsg})`);
    }

    const data = await res.json();
    renderPredictionResult(data, payload);
  } catch (err) {
    alert(`Prediction Error: ${err.message}. Ensure backend is running at http://127.0.0.1:8002`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="send" style="width: 16px; height: 16px;"></i><span>Predict Delay Risk</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// 7b. Dynamic Recommendation Generator
function generateDynamicRecommendation(data, payload) {
  if (data.recommendation && data.recommendation_custom) return data.recommendation;

  const riskText = data.risk_label || (data.probability > 0.55 ? 'High' : data.probability > 0.3 ? 'Medium' : 'Low');

  if (riskText === 'Low') {
    return `
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <div style="font-weight: 800; color: var(--risk-low, #10b981); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.1rem;">🟢</span> LOW RISK — STANDARD PROCESS
        </div>
        <div style="background: var(--risk-low-bg, rgba(16, 185, 129, 0.12)); padding: 0.9rem 1.1rem; border-radius: 10px; border-left: 4px solid var(--risk-low, #10b981); font-size: 0.9rem; color: var(--text-main, #f8fafc); line-height: 1.6; border: 1px solid rgba(16, 185, 129, 0.3);">
          Standard economic fulfillment pipeline approved (Prob: ${(data.probability * 100).toFixed(1)}%). Zero extra intervention costs required.
        </div>
      </div>
    `;
  }

  // Calculate turnaround days promised
  let promisedDays = 14;
  if (payload && payload.purchase_datetime && payload.estimated_delivery_date) {
    const pDt = new Date(payload.purchase_datetime);
    const eDt = new Date(payload.estimated_delivery_date);
    const diffTime = eDt - pDt;
    if (!isNaN(diffTime)) {
      promisedDays = diffTime / (1000 * 60 * 60 * 24);
    }
  }

  const custZip = payload ? Number(payload.customer_zip_prefix || 0) : 0;
  const sellZip = payload ? Number(payload.seller_zip_prefix || 0) : 0;
  const approvalLag = payload ? Number(payload.approval_lag_hours || 0) : 0;
  const weightKg = payload ? Number(payload.weight_g || 0) / 1000 : 0;
  const price = payload ? Number(payload.price || 1) : 1;
  const freight = payload ? Number(payload.freight_value || 0) : 0;
  const freightRatio = freight / Math.max(price, 1);

  // Identify primary risk factors
  const isFarNorthOrNortheast = (custZip >= 59000 && custZip <= 69999) || (custZip >= 60000 && custZip <= 65999) || (custZip >= 76000 && custZip <= 79999);
  const isCrossStateZip = Math.abs(custZip - sellZip) > 10000;
  const isTightSLA = promisedDays > 0 && promisedDays <= 7;
  const isHighLag = approvalLag >= 24;
  const isHeavyOrFreightRatio = weightKg >= 10 || freightRatio >= 0.5;

  if (riskText === 'High') {
    const factors = [];
    const actions = [];

    if (isTightSLA) {
      factors.push(`Unrealistic <strong style="color: var(--accent-secondary, #06b6d4);">${promisedDays.toFixed(0)}-day promised SLA window</strong> set at checkout`);
      actions.push('Adjust checkout delivery promise date to a realistic timeframe');
    }
    if (isFarNorthOrNortheast || isCrossStateZip) {
      factors.push(`Extended long-haul distance to ZIP prefix <strong style="color: var(--accent-secondary, #06b6d4);">${custZip}</strong>`);
      actions.push('Reassign parcel to express air-freight carrier lane');
    }
    if (isHighLag) {
      factors.push(`High seller approval lag (<strong style="color: var(--accent-secondary, #06b6d4);">${approvalLag}h delay</strong> prior to warehouse release)`);
      actions.push('Flag seller support team to expedite warehouse dispatch within 4 hours');
    }
    if (isHeavyOrFreightRatio) {
      factors.push(`Heavy package weight (<strong style="color: var(--accent-secondary, #06b6d4);">${weightKg.toFixed(1)} kg</strong>) and high freight ratio`);
      actions.push('Partner with specialized heavy-cargo logistics handler');
    }

    if (factors.length === 0) {
      factors.push('Combined geographic distance and logistics turnaround complexity');
      actions.push('Reassign to express priority carrier and accelerate warehouse dispatch');
    }

    actions.push('Send proactive SMS delay alert to customer prior to shipping');

    const factorsHtml = factors.map((f) => `<li style="margin-bottom: 0.4rem; color: var(--text-main, #f8fafc);">${f}</li>`).join('');
    const actionsHtml = actions.map((a) => `<li style="margin-bottom: 0.4rem; color: var(--text-main, #f8fafc);">${a}</li>`).join('');

    return `
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="font-weight: 800; color: var(--risk-high, #ef4444); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.1rem;">🔴</span> HIGH RISK ALERT — IMMEDIATE ACTION REQUIRED
        </div>
        
        <div style="background: var(--bg-muted, rgba(15, 23, 42, 0.6)); padding: 0.9rem 1.15rem; border-radius: 10px; border-left: 4px solid var(--risk-high, #ef4444); border: 1px solid var(--border-color, rgba(255,255,255,0.08));">
          <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            🔍 Primary Delay Drivers:
          </div>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
            ${factorsHtml}
          </ul>
        </div>

        <div style="background: var(--risk-high-bg, rgba(239, 68, 68, 0.12)); padding: 0.9rem 1.15rem; border-radius: 10px; border-left: 4px solid var(--risk-high, #ef4444); border: 1px solid var(--risk-high-border, rgba(239, 68, 68, 0.3));">
          <div style="font-weight: 800; font-size: 0.82rem; color: var(--risk-high, #ef4444); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            ⚡ Required Operational Actions:
          </div>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
            ${actionsHtml}
          </ul>
        </div>
      </div>
    `;
  }

  if (riskText === 'Medium') {
    const factors = [];
    const actions = [];

    if (isTightSLA) {
      factors.push(`Tight <strong style="color: var(--accent-secondary, #06b6d4);">${promisedDays.toFixed(0)}-day turnaround window</strong>`);
      actions.push('Flag in warehouse dispatch queue for priority 24-hour packing');
    }
    if (isCrossStateZip || isFarNorthOrNortheast) {
      factors.push(`Interstate shipping route to ZIP prefix <strong style="color: var(--accent-secondary, #06b6d4);">${custZip}</strong>`);
      actions.push('Monitor carrier pickup status closely within 12 hours');
    }
    if (isHighLag) {
      factors.push(`Seller packing lag (<strong style="color: var(--accent-secondary, #06b6d4);">${approvalLag}h delay</strong>)`);
      actions.push('Issue alert to seller to confirm warehouse dispatch');
    }

    if (factors.length === 0) {
      factors.push('Moderate logistics routing complexity');
      actions.push('Monitor carrier pickup times and verify warehouse dispatch queue');
    }

    const factorsHtml = factors.map((f) => `<li style="margin-bottom: 0.4rem; color: var(--text-main, #f8fafc);">${f}</li>`).join('');
    const actionsHtml = actions.map((a) => `<li style="margin-bottom: 0.4rem; color: var(--text-main, #f8fafc);">${a}</li>`).join('');

    return `
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="font-weight: 800; color: var(--risk-med, #f59e0b); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.1rem;">🟡</span> MEDIUM RISK WARNING — WATCHLIST MONITORING
        </div>
        
        <div style="background: var(--bg-muted, rgba(15, 23, 42, 0.6)); padding: 0.9rem 1.15rem; border-radius: 10px; border-left: 4px solid var(--risk-med, #f59e0b); border: 1px solid var(--border-color, rgba(255,255,255,0.08));">
          <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            🔍 Moderate Risk Factors:
          </div>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
            ${factorsHtml}
          </ul>
        </div>

        <div style="background: var(--risk-med-bg, rgba(245, 158, 11, 0.12)); padding: 0.9rem 1.15rem; border-radius: 10px; border-left: 4px solid var(--risk-med, #f59e0b); border: 1px solid var(--risk-med-border, rgba(245, 158, 11, 0.3));">
          <div style="font-weight: 800; font-size: 0.82rem; color: var(--risk-med, #f59e0b); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            📋 Mandated Operational Actions:
          </div>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
            ${actionsHtml}
          </ul>
        </div>
      </div>
    `;
  }

  return 'Standard automated fulfillment pipeline approved.';
}

// 8. Render Prediction Result & Scroll Top
function renderPredictionResult(data, payload) {
  const container = document.getElementById('result-container');
  const badge = document.getElementById('res-risk-badge');
  const probVal = document.getElementById('res-prob-val');
  const recommendation = document.getElementById('res-recommendation');

  if (container) container.style.display = 'block';

  const riskText = data.risk_label || data.risk_level || (data.probability > 0.55 ? 'High' : data.probability > 0.3 ? 'Medium' : 'Low');
  const probPct = (data.probability * 100).toFixed(1);

  if (probVal) probVal.innerText = `${probPct}%`;
  
  if (recommendation) {
    recommendation.innerHTML = generateDynamicRecommendation(data, payload);

    if (riskText === 'High') {
      recommendation.style.background = 'rgba(239, 68, 68, 0.06)';
      recommendation.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    } else if (riskText === 'Medium') {
      recommendation.style.background = 'rgba(245, 158, 11, 0.06)';
      recommendation.style.border = '1px solid rgba(245, 158, 11, 0.3)';
    } else {
      recommendation.style.background = 'rgba(16, 185, 129, 0.06)';
      recommendation.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    }
    recommendation.style.padding = '1.25rem';
    recommendation.style.borderRadius = '14px';
  }

  if (badge) {
    badge.innerText = `${riskText.toUpperCase()} RISK (${probPct}%)`;
    badge.className = `result-badge ${riskText}`;
  }

  // Smooth scroll to top of result container
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 9. Scroll Reveal Observer
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
}

// 10. Navbar Scroll Spy
function setupScrollSpy() {
  const sections = ['hero', 'about', 'features', 'how-it-works'];
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }

    const predictView = document.getElementById('view-predict');
    if (predictView && predictView.style.display !== 'none') {
      document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
      const predictBtn = document.getElementById('nav-predict');
      if (predictBtn) predictBtn.classList.add('active');
      return;
    }

    let current = 'hero';
    sections.forEach((secId) => {
      const sec = document.getElementById(secId);
      if (sec && sec.offsetWidth > 0) {
        const top = sec.offsetTop - 140;
        if (window.scrollY >= top) {
          current = secId;
        }
      }
    });

    document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${current}`);
    if (activeBtn) activeBtn.classList.add('active');
  });
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Sync saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  }

  checkHealth();
  setInterval(checkHealth, 10000);
  setupScrollReveal();
  setupScrollSpy();
});
