import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Robust brand extractor for Woo Store API payloads
function getBrand(product) {
  if (!product) return '';

  // 1) First-class Brands taxonomy (if present)
  const b1 = product.brands?.[0]?.name || product.brands?.[0]?.slug;
  if (b1) return b1;

  // 2) Common attribute slugs used in your catalog
  const preferredSlugs = ['lux_g_brand', 'lux_qb_brand', 'brand', 'lux_g_signatures'];
  const attrs = Array.isArray(product.attributes) ? product.attributes : [];

  // 2a) exact slug match (preferred order)
  for (const slug of preferredSlugs) {
    const a = attrs.find(x => x?.slug?.toLowerCase?.() === slug);
    const t = a?.terms?.[0];
    if (t?.name || t?.slug) return t.name || t.slug;
  }

  // 2b) name/label exactly "brand"
  const fromLabel = attrs.find(x => x?.name?.toLowerCase?.() === 'brand');
  if (fromLabel?.terms?.[0]) return fromLabel.terms[0].name || fromLabel.terms[0].slug;

  // 2c) any attribute whose slug/label contains "brand"
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

function initCarousels() {
  document.querySelectorAll('.wpgcb-carousel').forEach((el) => {
    // Avoid initializing the same carousel multiple times
    if (el.classList.contains('swiper-initialized')) {
      return;
    }

    const autoplay = el.dataset.autoplay === 'true';
    const loop = el.dataset.loop === 'true';
    const mode = el.dataset.mode || 'latest';
    const wrapper = el.querySelector('.swiper-wrapper');

    const initSwiper = () => {
      new Swiper(el, {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        breakpoints: {
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        },
        navigation: {
          nextEl: el.querySelector('.swiper-button-next'),
          prevEl: el.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: el.querySelector('.swiper-pagination'),
          clickable: true,
        },
        autoplay: autoplay ? { delay: 3000 } : false,
        loop,
      });
    };

    // Fetch latest products only if we are in "latest" mode and no slides exist yet
    if (mode === 'latest' && wrapper && wrapper.children.length === 0) {
      const url =
        '/wp-json/wc/store/v1/products' +
        '?attributes[0][attribute]=pa_product_type' +
        '&attributes[0][slug]=jewelry' +
        '&per_page=10';

      fetch(url)
        .then((res) => res.json())
        .then((products) => {
          if (!Array.isArray(products)) return;
          // Clear any existing slides to avoid duplicates
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

          initSwiper();
        })
        .catch(() => {
          // Optional: handle error state
        });
    } else {
      initSwiper();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}
