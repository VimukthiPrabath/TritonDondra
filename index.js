/**
 * Triton Dondra landing page — scroll reveals + testimonial slider
 */
(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----- Scroll reveal: IntersectionObserver ----- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----- Testimonial slider (responsive slides per view) ----- */
  var track = document.getElementById('slider-track');
  var prevBtn = document.getElementById('slider-prev');
  var nextBtn = document.getElementById('slider-next');
  var dotsWrap = document.getElementById('slider-dots');
  var slides = track ? track.querySelectorAll('.slider-slide') : [];

  function slidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  var index = 0;
  var spv = slidesPerView();
  var maxIndex = Math.max(0, slides.length - spv);

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    var n = maxIndex + 1;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === index ? 'true' : 'false');
      b.setAttribute('aria-label', 'Go to review set ' + (i + 1));
      b.className =
        'h-2 rounded-full transition-all ' +
        (i === index ? 'w-8 bg-forest-light' : 'w-2 bg-forest/25 hover:bg-forest/40');
      (function (j) {
        b.addEventListener('click', function () {
          index = j;
          render();
        });
      })(i);
      dotsWrap.appendChild(b);
    }
  }

  function render() {
    spv = slidesPerView();
    maxIndex = Math.max(0, slides.length - spv);
    if (index > maxIndex) index = maxIndex;
    var slide = slides[0];
    var offset = 0;
    if (slide && track) {
      offset = index * slide.getBoundingClientRect().width;
    }
    if (track) {
      track.style.transform = 'translateX(-' + offset + 'px)';
    }
    updateDots();
  }

  function go(delta) {
    index = Math.max(0, Math.min(maxIndex, index + delta));
    render();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    go(-1);
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    go(1);
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 120);
  });

  var sliderViewport = document.getElementById('slider-viewport');
  if (window.ResizeObserver && track && sliderViewport) {
    var ro = new ResizeObserver(function () {
      render();
    });
    ro.observe(sliderViewport);
  }

  if (slides.length && track) {
    render();
  }

  /* Auto-advance (pause on hover) */
  var paused = false;
  if (sliderViewport) {
    sliderViewport.addEventListener('mouseenter', function () {
      paused = true;
    });
    sliderViewport.addEventListener('mouseleave', function () {
      paused = false;
    });
  }
  setInterval(function () {
    if (!slides.length || paused) return;
    if (index >= maxIndex) index = 0;
    else index++;
    render();
  }, 6000);
})();
