import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wpgcb-carousel').forEach((block) => {
    const autoplayDelay = parseInt(block.dataset.autoplay, 10);
    const loop = block.dataset.loop === 'true';
    const pagination = block.dataset.pagination === 'true';
    const navigation = block.dataset.navigation === 'true';
    const swiperEl = block.querySelector('.swiper');
    if (!swiperEl) return;

    new Swiper(swiperEl, {
      modules: [Navigation, Pagination, Autoplay],
      loop,
      autoplay: autoplayDelay ? { delay: autoplayDelay } : false,
      pagination: pagination ? { el: block.querySelector('.swiper-pagination'), clickable: true } : false,
      navigation: navigation ? {
        nextEl: block.querySelector('.swiper-button-next'),
        prevEl: block.querySelector('.swiper-button-prev')
      } : false
    });
  });
});
