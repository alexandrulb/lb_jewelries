import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wpgcb-carousel').forEach((el) => {
    const autoplay = el.dataset.autoplay === 'true';
    const loop = el.dataset.loop === 'true';
    new Swiper(el, {
      modules: [Navigation, Pagination, Autoplay],
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
  });
});
