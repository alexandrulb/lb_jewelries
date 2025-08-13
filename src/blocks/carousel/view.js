import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wpgcb-carousel').forEach((el) => {
    const autoplay = el.dataset.autoplay === 'true';
    const loop = el.dataset.loop === 'true';
    fetch('/wp-json/wc/store/products?product_cat=jewelry&per_page=10')
      .then((res) => res.json())
      .then((products) => {
        const wrapper = el.querySelector('.swiper-wrapper');
        products.forEach((product) => {
          if (product.images && product.images.length > 0) {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const img = document.createElement('img');
            img.src = product.images[0].src;
            img.alt = product.name;
            slide.appendChild(img);
            wrapper.appendChild(slide);
          }
        });

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
      });
  });
});