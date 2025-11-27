/* sliders.bundle.js
   Option B — merged + optimized (keeps functionality, removes duplication)
   Requires: Splide core + CSS to be present on the page.
*/

(function () {
  'use strict';

  /* ---------- Utilities ---------- */
  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const raf = cb => requestAnimationFrame(cb);

  /* ---------- Shared config / breakpoints ---------- */
  const COMMON_DEFAULTS = {
    speed: 800,
    dragAngleThreshold: 80,
    rewind: true,
    rewindSpeed: 800,
    waitForTransition: false,
    updateOnMove: true,
    trimSpace: true,
    arrows: 'slider',
    pagination: 'slider'
  };

  const BP_4_5 = {
    1920: { perPage: 3.5, gap: '0.4rem' },
    1680: { perPage: 3.5, gap: '0.4rem' },
    1024: { perPage: 2.5, gap: '0.4rem' },
    991:  { perPage: 2.5, gap: '0.4rem' },
    767:  { perPage: 2.5, gap: '0.4rem' },
    479:  { perPage: 2.5, gap: '0.4rem' }
  };

  const BP_GALLERY = {
    1920: { perPage: 2.5 },
    1680: { perPage: 2.5 },
    991:  { perPage: 2.5 },
    767:  { perPage: 1 },
    479:  { perPage: 1 }
  };

  const BP_ROOMS = {
    1920: { perPage: 3, gap: '1rem' },
    1680: { perPage: 3, gap: '1rem' },
    1024: { perPage: 2.5, gap: '1rem' },
    991:  { perPage: 2.5, gap: '0.4rem' },
    767:  { perPage: 2.5, gap: '0.4rem' },
    479:  { perPage: 1.1, gap: '0.4rem' }
  };

  const BP_ITEMS = {
    1920: { perPage: 5, gap: '1rem' },
    1680: { perPage: 5, gap: '1rem' },
    1024: { perPage: 4.5, gap: '1rem', padding: { left: '1rem', right: '1rem' } },
    991:  { perPage: 4.5, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } },
    767:  { perPage: 2.5, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } },
    479:  { perPage: 1.1, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } }
  };

  /* ---------- Shared helpers ---------- */

  // Ensure Splide exists
  function ensureSplide() {
    if (typeof Splide === 'undefined') {
      console.warn('Splide is not loaded. Please include Splide JS/CSS before sliders.bundle.js');
      return false;
    }
    return true;
  }

  // Create and mount a Splide instance with shared defaults
  function createSlider(el, opts = {}, mount = true) {
    const conf = Object.assign({}, COMMON_DEFAULTS, opts);
    const s = new Splide(el, conf);
    if (mount) s.mount();
    return s;
  }

  // Unified counter updater (total/current)
  const COUNTERS = {
    attach(splide, sliderEl) {
      if (!splide || !sliderEl) return;
      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', idx => {
        if (currentEl) currentEl.textContent = idx + 1;
      });
    }
  };

  /* ---------- Per-slider initializers ---------- */

  function initSliderCard() {
    const sliders = document.querySelectorAll('.slider-card');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 4.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0.4rem',
        breakpoints: BP_4_5
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  function initSliderEdit() {
    const sliders = document.querySelectorAll('.slider-edit');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '0rem',
        pagination: true
      });
      splide.mount();
      // edit sliders likely don't have counters; attach only if present
      COUNTERS.attach(splide, sliderEl);
    });
  }

  function initSliderRooms() {
    const sliders = document.querySelectorAll('.slider-rooms');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 3,
        perMove: 1,
        focus: 'center',
        type: 'slide',
        gap: '1rem',
        padding: { left: '1rem', right: '1rem' },
        breakpoints: BP_ROOMS,
        pagination: 'slider'
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  function initSliderNews() {
    const sliders = document.querySelectorAll('.slider-news');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 4.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0.4rem',
        breakpoints: BP_4_5
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  // Gallery needs the center/geometry logic — keep but reusable and debounced
  function initSliderGallery() {
    const sliders = document.querySelectorAll('.slider-gallery');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 2.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0rem',
        breakpoints: BP_GALLERY
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);

      // CENTER CLASS LOGIC
      const applyCenterClass = (targetIndex = splide.index) => {
        const slides = [...sliderEl.querySelectorAll('.splide__slide')];
        slides.forEach(s => {
          s.classList.remove('is-center');
          const c = s.querySelector('.slider-crumb');
          if (c) c.classList.remove('is-visible');
        });

        // Splide internal Slides
        const realSlides = splide.Components && splide.Components.Slides ? splide.Components.Slides.get() : [];
        realSlides.forEach(slideObj => {
          if (slideObj.index === targetIndex) {
            slideObj.slide.classList.add('is-center');
            const c = slideObj.slide.querySelector('.slider-crumb');
            if (c) c.classList.add('is-visible');
          }
        });
      };

      const updateByGeometry = () => {
        const track = sliderEl.querySelector('.splide__track');
        if (!track) return;
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        const slides = [...sliderEl.querySelectorAll('.splide__slide')];
        if (!slides.length) return;

        let best = null;
        let bestDist = Infinity;

        slides.forEach(slideEl => {
          const r = slideEl.getBoundingClientRect();
          const slideCenter = r.left + r.width / 2;
          const dist = Math.abs(slideCenter - centerX);
          if (dist < bestDist) {
            bestDist = dist;
            best = slideEl;
          }
        });

        slides.forEach(s => {
          const c = s.querySelector('.slider-crumb');
          if (s === best) {
            s.classList.add('is-center');
            if (c) c.classList.add('is-visible');
          } else {
            s.classList.remove('is-center');
            if (c) c.classList.remove('is-visible');
          }
        });
      };

      // Hook events: keep applyCenterClass on move, geometry on moved/mounted/updated
      splide.on('move', newIndex => applyCenterClass(newIndex));
      splide.on('moved', () => raf(updateByGeometry));
      splide.on('mounted updated', () => raf(updateByGeometry));

      // Debounce resize globally per instance to avoid thrash
      const debouncedGeometry = debounce(() => raf(updateByGeometry), 120);
      window.addEventListener('resize', debouncedGeometry);

      // initial run
      raf(updateByGeometry);
    });
  }

  function initSliderOffers() {
    const sliders = document.querySelectorAll('.slider-offers');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '1rem',
        pagination: true
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  function initSliderItems() {
    const sliders = document.querySelectorAll('.slider-items');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 5,
        perMove: 1,
        focus: 'center',
        type: 'slide',
        gap: '1rem',
        breakpoints: BP_ITEMS
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  function initSliderRowCard() {
    const sliders = document.querySelectorAll('.row-card');
    if (!sliders.length) return;
    sliders.forEach(sliderEl => {
      const splide = createSlider(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '0rem',
        pagination: true,
        autoWidth: false,
        breakpoints: {
          1920: { perPage: 3, gap: '1rem' },
          1680: { perPage: 3, gap: '1rem' },
          991:  { perPage: 1, gap: '1rem' }
        }
      });
      splide.mount();
      COUNTERS.attach(splide, sliderEl);
    });
  }

  /* ---------- Initialize all sliders ---------- */
  function initAll() {
    if (!ensureSplide()) return;
    initSliderCard();
    initSliderEdit();
    initSliderRooms();
    initSliderNews();
    initSliderGallery();
    initSliderOffers();
    initSliderItems();
    initSliderRowCard();
  }

  /* ---------- Auto-run on DOMContentLoaded ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* ---------- Expose for debugging (optional) ---------- */
  window.__SLIDERS_BUNDLE = {
    initAll,
    createSlider,
    COUNTERS
  };

})();
