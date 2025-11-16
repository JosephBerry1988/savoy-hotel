document.addEventListener("DOMContentLoaded", () => {

  // Load external script helper
  function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
  }

  // ------------------------------
  // Initialize Text + Fade Animations
  // ------------------------------
  function initTextAnimations() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitType) {
      console.warn("GSAP, ScrollTrigger, or SplitType not loaded.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Split text into spans
    document.querySelectorAll("[text-split]").forEach(el => {
      new SplitType(el, { types: "words, chars", tagName: "span" });
    });

    document.fonts.ready.then(() => {

      // Slide-up animation
      document.querySelectorAll("[letters-slide-up-no]").forEach(el => {
        const chars = el.querySelectorAll(".char");

        chars.forEach(c => {
          c.style.display = "inline-block";
          c.style.opacity = 0;
          c.style.willChange = "opacity";
        });

        const tl = gsap.timeline({ paused: true });
        tl.to(chars, {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power1.out",
          delay: 0.2,
          stagger: { amount: 0.6 },
          force3D: true
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => tl.play()
        });
      });

      // Fade-in elements
      document.querySelectorAll("[fade-in]").forEach(el => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power1.out"
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 95%",
          once: true,
          onEnter: () => tl.play()
        });
      });

    });

    gsap.set("[text-split]", { opacity: 1 });
  }

  // ------------------------------
  // Only load SplitType (Webflow already loads GSAP)
  // ------------------------------
  function lazyLoadTextAnimations() {
    loadScript(
      "https://cdn.jsdelivr.net/gh/timothydesign/script/split-type.js",
      initTextAnimations
    );
  }

  // Trigger lazy load
  if ("requestIdleCallback" in window) {
    requestIdleCallback(lazyLoadTextAnimations);
  } else {
    window.addEventListener("load", lazyLoadTextAnimations);
  }

});
