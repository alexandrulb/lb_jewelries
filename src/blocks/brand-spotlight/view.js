(function() {
  function initCarousel(root) {
    const slides = Array.from(root.querySelectorAll('.bs-slide'));
    const autoplay = root.dataset.autoplay === 'true';
    const delay = parseInt(root.dataset.delay || '5000', 10);
    let index = 0;
    let timer = null;

    function updateDots(i) {
      slides.forEach((s, idx) => {
        const dots = s.querySelectorAll('.bs-dot');
        dots.forEach((d, di) => {
          d.classList.toggle('is-active', di === i);
          d.setAttribute('aria-selected', di === i ? 'true' : 'false');
        });
      });
    }
    function show(i) {
      const nextIndex = (i + slides.length) % slides.length;
      if (nextIndex === index) return;
      const prevSlide = slides[index];
      const nextSlide = slides[nextIndex];
      if (prevSlide) prevSlide.classList.remove('is-active');
      if (nextSlide) nextSlide.classList.add('is-active');
      index = nextIndex;
      updateDots(index);
    }
    function next() { show(index + 1); }
    function start() {
      if (!autoplay || slides.length <= 1) return;
      stop();
      timer = setInterval(next, delay);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    // Event delegation for all dots (works even when hidden)
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.bs-dot');
      if (!btn) return;
      const i = parseInt(btn.dataset.index || '0', 10);
      show(i);
      start();
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // init
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === 0);
    });
    index = 0;
    updateDots(0);
    start();
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bs-carousel').forEach(initCarousel);
  });
})();
