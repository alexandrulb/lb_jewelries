import Swiper from 'swiper';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

function initHero() {
  document.querySelectorAll('.wpgcb-hero__slider').forEach((el) => {
    if (el.dataset.initialized === 'true') return;
    new Swiper(el, {
      modules: [EffectFade, Autoplay],
      effect: 'fade',
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 4000 },
      fadeEffect: { crossFade: true },
    });
    el.dataset.initialized = 'true';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero);
} else {
  initHero();
}
