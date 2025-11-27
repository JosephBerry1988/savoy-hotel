document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     SLIDER 1 — .slider-card
     ============================================================ */
  function initSliderCard() {
    const sliders = document.querySelectorAll('.slider-card');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 4.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0.4rem',
        arrows: 'slider',
        pagination: 'slider',
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 3.5, gap: '0.4rem' },
          1680: { perPage: 3.5, gap: '0.4rem' },
          1024: { perPage: 2.5, gap: '0.4rem' },
          991:  { perPage: 2.5, gap: '0.4rem' },
          767:  { perPage: 2.5, gap: '0.4rem' },
          479:  { perPage: 2.5, gap: '0.4rem' }
        }
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', index => {
        if (currentEl) currentEl.textContent = index + 1;
      });
    });
  }

  /* ============================================================
     SLIDER 2 — .slider-edit
     ============================================================ */
  function initSliderEdit() {
    const sliders = document.querySelectorAll('.slider-edit');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      new Splide(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '0rem',
        arrows: 'slider',
        pagination: true,
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true
      }).mount();
    });
  }

  /* ============================================================
     SLIDER 3 — .slider-rooms
     ============================================================ */
  function initSliderRooms() {
    const sliders = document.querySelectorAll('.slider-rooms');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 3,
        perMove: 1,
        focus: 'center',
        type: 'slide',
        gap: '1rem',
        padding: { left: '1rem', right: '1rem' },
        arrows: 'slider',
        pagination: 'slider',
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 3, gap: '1rem' },
          1680: { perPage: 3, gap: '1rem' },
          1024: { perPage: 2.5, gap: '1rem' },
          991:  { perPage: 2.5, gap: '0.4rem' },
          767:  { perPage: 2.5, gap: '0.4rem' },
          479:  { perPage: 1.1, gap: '0.4rem' }
        }
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', index => {
        if (currentEl) currentEl.textContent = index + 1;
      });
    });
  }

  /* ============================================================
     SLIDER 4 — .slider-news
     ============================================================ */
  function initSliderNews() {
    const sliders = document.querySelectorAll('.slider-news');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 4.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0.4rem',
        arrows: 'slider',
        pagination: 'slider',
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 3.5, gap: '0.4rem' },
          1680: { perPage: 3.5, gap: '0.4rem' },
          1024: { perPage: 2.5, gap: '0.4rem' },
          991:  { perPage: 2.5, gap: '0.4rem' },
          767:  { perPage: 2.5, gap: '0.4rem' },
          479:  { perPage: 2.5, gap: '0.4rem' }
        }
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', idx => {
        if (currentEl) currentEl.textContent = idx + 1;
      });
    });
  }

  /* ============================================================
     SLIDER 5 — .slider-gallery
     ============================================================ */
  function initSliderGallery() {
    const sliders = document.querySelectorAll('.slider-gallery');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 2.5,
        perMove: 1,
        focus: 'center',
        type: 'loop',
        gap: '0rem',
        arrows: 'slider',
        pagination: 'slider',
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 2.5 },
          1680: { perPage: 2.5 },
          991:  { perPage: 2.5 },
          767:  { perPage: 1 },
          479:  { perPage: 1 }
        }
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', i => {
        if (currentEl) currentEl.textContent = i + 1;
      });

      /* Center class logic here (unchanged) */
      const applyCenterClass = (targetIndex = splide.index) => {
        const slides = [...sliderEl.querySelectorAll('.splide__slide')];
        slides.forEach(s => {
          s.classList.remove('is-center');
          const c = s.querySelector('.slider-crumb');
          if (c) c.classList.remove('is-visible');
        });

        const realSlides = splide.Components.Slides.get();
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

      splide.on('move', newIndex => applyCenterClass(newIndex));
      splide.on('moved', () => requestAnimationFrame(updateByGeometry));
      splide.on('mounted updated', updateByGeometry);
      window.addEventListener('resize', updateByGeometry);

      updateByGeometry();
    });
  }

  /* ============================================================
     SLIDER 6 — .slider-offers
     ============================================================ */
  function initSliderOffers() {
    const sliders = document.querySelectorAll('.slider-offers');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '1rem',
        arrows: 'slider',
        pagination: true,
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', idx => {
        if (currentEl) currentEl.textContent = idx + 1;
      });
    });
  }

  /* ============================================================
     SLIDER 7 — .slider-items
     ============================================================ */
  function initSliderItems() {
    const sliders = document.querySelectorAll('.slider-items');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      const splide = new Splide(sliderEl, {
        perPage: 5,
        perMove: 1,
        focus: 'center',
        type: 'slide',
        gap: '1rem',
        arrows: 'slider',
        pagination: 'slider',
        speed: 800,
        dragAngleThreshold: 80,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 5, gap: '1rem' },
          1680: { perPage: 5, gap: '1rem' },
          1024: { perPage: 4.5, gap: '1rem', padding: { left: '1rem', right: '1rem' } },
          991:  { perPage: 4.5, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } },
          767:  { perPage: 2.5, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } },
          479:  { perPage: 1.1, gap: '0.4rem', padding: { left: '1rem', right: '1rem' } }
        }
      });

      splide.mount();

      const currentEl = sliderEl.querySelector('.slider-number.slider-amount');
      const totalEl = sliderEl.querySelector('.slider-number.slider-count');

      if (totalEl) totalEl.textContent = splide.length;
      if (currentEl) currentEl.textContent = splide.index + 1;

      splide.on('move', idx => {
        if (currentEl) currentEl.textContent = idx + 1;
      });
    });
  }

  /* ============================================================
     SLIDER 8 — .row-card  (ADDED)
     ============================================================ */
  function initSliderRowCard() {
    const sliders = document.querySelectorAll('.row-card');
    if (!sliders.length) return;

    sliders.forEach(sliderEl => {
      new Splide(sliderEl, {
        perPage: 1,
        perMove: 1,
        focus: 'left',
        type: 'slide',
        gap: '0rem',
        arrows: 'slider',
        pagination: true,
        speed: 800,
        dragAngleThreshold: 80,
        autoWidth: false,
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: true,
        breakpoints: {
          1920: { perPage: 3, gap: '1rem' },
          1680: { perPage: 3, gap: '1rem' },
          991:  { perPage: 1, gap: '1rem' }
        }
      }).mount();
    });
  }

  /* ============================================================
     INITIALIZE ALL SLIDERS
     ============================================================ */
  initSliderCard();
  initSliderEdit();
  initSliderRooms();
  initSliderNews();
  initSliderGallery();
  initSliderOffers();
  initSliderItems();
  initSliderRowCard();  // <-- ADDED HERE

});
