import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Robust brand extractor for Woo Store API payloads
function getBrand(product) {
  if (!product) return '';

  const b1 = product.brands?.[0]?.name || product.brands?.[0]?.slug;
  if (b1) return b1;

  const preferredSlugs = ['lux_g_brand', 'lux_qb_brand', 'brand', 'lux_g_signatures'];
  const attrs = Array.isArray(product.attributes) ? product.attributes : [];

  for (const slug of preferredSlugs) {
    const a = attrs.find(x => x?.slug?.toLowerCase?.() === slug);
    const t = a?.terms?.[0];
    if (t?.name || t?.slug) return t.name || t.slug;
  }

  const fromLabel = attrs.find(x => x?.name?.toLowerCase?.() === 'brand');
  if (fromLabel?.terms?.[0]) return fromLabel.terms[0].name || fromLabel.terms[0].slug;

  for (const a of attrs) {
    const s = a?.slug?.toLowerCase?.() || '';
    const n = a?.name?.toLowerCase?.() || '';
    if (s.includes('brand') || n.includes('brand')) {
      const t = a?.terms?.[0];
      if (t?.name || t?.slug) return t.name || t.slug;
    }
  }

  return '';
}

// Send debug logs to server
function log(message) {
  try {
    fetch('/wp-json/lb-jewelry/v1/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (e) {
    // fail silently
  }
}

async function fetchStoreJSON(url) {
  log(`[fetch] ${url}`);
  const res = await fetch(url, { credentials: 'same-origin' });
  const ct = res.headers.get('content-type') || '';
  const body = await res.text();
  log(`[fetch] status=${res.status} ct=${ct} body[0..120]=${body.slice(0,120)}`);

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  if (!ct.includes('application/json')) throw new Error('Non-JSON response');

  try { return JSON.parse(body); }
  catch (e) { throw new Error(`JSON parse error: ${e?.message || e}`); }
}

function buildLatestUrl({ perPage = 10 } = {}) {
  const u = new URL('/wp-json/wc/store/v1/products', window.location.origin);
  u.searchParams.set('per_page', String(perPage));
  u.searchParams.set('orderby', 'date');
  u.searchParams.set('order', 'desc');
  return u.toString();
}

function buildAttributeUrl({ perPage = 10 } = {}) {
  const u = new URL('/wp-json/wc/store/v1/products', window.location.origin);
  u.searchParams.set('per_page', String(perPage));
  u.searchParams.set('attributes[0][attribute]', 'pa_product_type');
  u.searchParams.set('attributes[0][slug]', 'jewelry');
  return u.toString();
}

function initCarousels() {
  document.querySelectorAll('.wpgcb-carousel').forEach((el, index) => {
    if (el.dataset.initialized === 'true') return;
    log(`Carousel ${index}: start initialization`);

    const autoplay = el.dataset.autoplay === 'true';
    const loop = el.dataset.loop === 'true';
    const mode = el.dataset.mode || 'latest';
    log(`Carousel ${index}: mode=${mode}`);

    const swiperEl = el.classList.contains('swiper') ? el : el.querySelector('.swiper');
    const wrapper  = el.querySelector('.swiper-wrapper');
    const hasSlides = wrapper && wrapper.children.length > 0;
    log(`Carousel ${index}: hasSlides=${hasSlides}`);

    // Guards to prevent bad init
    if (!(swiperEl instanceof Element) || !(wrapper instanceof Element)) {
      el.dataset.initialized = 'true';
      return;
    }
    if (!hasSlides && mode !== 'latest') {
      el.dataset.initialized = 'true';
      return;
    }

    // Unique selectors for nav/pagination
    const nextClass = `swiper-button-next-${index}`;
    const prevClass = `swiper-button-prev-${index}`;
    const pagClass  = `swiper-pagination-${index}`;
    const nextEl    = el.querySelector('.swiper-button-next');
    const prevEl    = el.querySelector('.swiper-button-prev');
    const pagEl     = el.querySelector('.swiper-pagination');
    if (nextEl) nextEl.classList.add(nextClass);
    if (prevEl) prevEl.classList.add(prevClass);
    if (pagEl) pagEl.classList.add(pagClass);

    // inside initCarousels(), after reading `mode`:
    const spaceBetween = mode === 'custom' ? 16 : 0;

    const initSwiper = () =>
      new Swiper(swiperEl, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        breakpoints: {
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        },
        spaceBetween, // ✅ add this line
        navigation: (nextEl && prevEl)
          ? { nextEl: `.${nextClass}`, prevEl: `.${prevClass}` }
          : undefined,
        pagination: pagEl
          ? { el: `.${pagClass}`, clickable: true }
          : undefined,
        autoplay: autoplay ? { delay: 3000 } : false,
        loop,
      });

    // Latest mode loads products dynamically
    if (mode === 'latest' && !hasSlides) {
      const load = async () => {
        try {
          const products = await fetchStoreJSON(buildAttributeUrl({ perPage: 10 }));
          renderSlides(products);
          initSwiper();
          log(`Carousel ${index}: swiper initialized after attribute fetch`);
          return;
        } catch (e) {
          log(`Carousel ${index}: attribute fetch failed -> ${e.message}`);
        }
        try {
          const products = await fetchStoreJSON(buildLatestUrl({ perPage: 10 }));
          renderSlides(products);
          initSwiper();
          log(`Carousel ${index}: swiper initialized after latest fallback`);
        } catch (e) {
          log(`Carousel ${index}: latest fallback failed -> ${e.message}`);
        }
      };
      load();
    } else if (hasSlides) {
      initSwiper();
      log(`Carousel ${index}: swiper initialized with existing slides`);
    }

    function renderSlides(products) {
      if (!Array.isArray(products) || !(wrapper instanceof Element)) return;
      wrapper.innerHTML = '';
      products.forEach((product) => {
        const imgSrc = product.images?.[0]?.src;
        if (!imgSrc) return;
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = product.name || '';
        slide.appendChild(img);
        const brand = getBrand(product);
        if (brand) {
          const brandEl = document.createElement('div');
          brandEl.className = 'product-brand';
          brandEl.textContent = brand;
          slide.appendChild(brandEl);
        }
        const titleEl = document.createElement('div');
        titleEl.className = 'product-title';
        titleEl.textContent = product.name || '';
        slide.appendChild(titleEl);
        wrapper.appendChild(slide);
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}