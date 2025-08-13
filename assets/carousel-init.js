document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.wpgcb-carousel,.lbj-carousel').forEach(function (wrap) {
    var swiperEl = wrap.querySelector('.swiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;
    new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      pagination: {
        el: wrap.querySelector('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: wrap.querySelector('.swiper-button-next'),
        prevEl: wrap.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  });
});
