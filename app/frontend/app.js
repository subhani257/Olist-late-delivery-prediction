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
    document.getElementById('estimated_delivery_date').value = '2018-05-18 00:00:00';
    document.getElementById('seller_zip_prefix').value = '1000';
    document.getElementById('customer_zip_prefix').value = '69000'; // Manaus AM
    document.getElementById('weight_g').value = '12500';
    document.getElementById('length_cm').value = '90';
    document.getElementById('height_cm').value = '45';
    document.getElementById('width_cm').value = '60';
    document.getElementById('product_category').value = 'moveis_decoracao';
    document.getElementById('price').value = '320.00';
    document.getElementById('freight_value').value = '85.00';
    document.getElementById('payment_type').value = 'boleto';
    document.getElementById('installments').value = '1';
    document.getElementById('approval_lag_hours').value = '28.0';
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

// 7. Form Submission Handler
async function handlePredictSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('btn-submit-predict');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Executing Inference...</span>`;
  }

  const payload = {
    purchase_datetime: document.getElementById('purchase_datetime').value,
    estimated_delivery_date: document.getElementById('estimated_delivery_date').value,
    seller_zip_prefix: Number(document.getElementById('seller_zip_prefix').value),
    customer_zip_prefix: Number(document.getElementById('customer_zip_prefix').value),
    weight_g: Number(document.getElementById('weight_g').value),
    length_cm: Number(document.getElementById('length_cm').value),
    height_cm: Number(document.getElementById('height_cm').value),
    width_cm: Number(document.getElementById('width_cm').value),
    product_category: document.getElementById('product_category').value,
    price: Number(document.getElementById('price').value),
    freight_value: Number(document.getElementById('freight_value').value),
    payment_type: document.getElementById('payment_type').value,
    installments: Number(document.getElementById('installments').value),
    approval_lag_hours: Number(document.getElementById('approval_lag_hours').value),
    item_count: Number(document.getElementById('item_count').value),
    seller_count: Number(document.getElementById('seller_count').value),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Prediction failed`);
    }

    const data = await res.json();
    renderPredictionResult(data);
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

// 8. Render Prediction Result & Scroll Top
function renderPredictionResult(data) {
  const container = document.getElementById('result-container');
  const badge = document.getElementById('res-risk-badge');
  const probVal = document.getElementById('res-prob-val');
  const recommendation = document.getElementById('res-recommendation');

  if (container) container.style.display = 'block';

  const riskText = data.risk_label || data.risk_level || (data.probability > 0.55 ? 'High' : data.probability > 0.3 ? 'Medium' : 'Low');
  const probPct = (data.probability * 100).toFixed(1);

  if (probVal) probVal.innerText = `${probPct}%`;
  
  if (recommendation) {
    if (data.recommendation) {
      recommendation.innerText = data.recommendation;
    } else if (riskText === 'High') {
      recommendation.innerText = 'Order exhibits high delay risk due to extended shipping distance and freight ratio. Reassign to express priority carrier and accelerate warehouse dispatch.';
    } else if (riskText === 'Medium') {
      recommendation.innerText = 'Moderate delay risk identified. Flag for priority processing and monitor carrier pickup times closely.';
    } else {
      recommendation.innerText = 'Low delay risk. Standard automated fulfillment pipeline approved.';
    }
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
