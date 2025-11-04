document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------
  // Helper: load external script
  // ------------------------------
  function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  }

  // ------------------------------
  // Initialize Text + Fade Animations
  // ------------------------------
  function initTextAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof SplitType === "undefined") {
      console.warn("GSAP, ScrollTrigger, or SplitType not loaded.");
      return;
    }

    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Split text into spans
    new SplitType("[text-split]", { types: "words, chars", tagName: "span" });

    // ------------------------------
    // Letters Slide-Up Animation (play once)
    // ------------------------------
    document.fonts.ready.then(() => {
      $("[letters-slide-up-no]").each(function () {
        const chars = $(this).find(".char");
        chars.css({ display: "inline-block", willChange: "opacity", opacity: 0 });

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
          trigger: this,
          start: "top 90%",
          once: true, // 👈 play only once
          onEnter: () => tl.play()
        });
      });
    });

    gsap.set("[text-split]", { opacity: 1 });

    // ------------------------------
    // Simple fade + scale-in animation (play once)
    // ------------------------------
    $("[fade-in]").each(function () {
      const tl = gsap.timeline({ paused: true });

      tl.from($(this), {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power1.out"
      });

      ScrollTrigger.create({
        trigger: this,
        start: "top 95%",
        once: true, // 👈 play only once
        onEnter: () => tl.play()
      });
    });
  }

  // ------------------------------
  // Lazy-load external libraries
  // ------------------------------
  function lazyLoadTextAnimations() {
    loadScript("https://cdn.jsdelivr.net/gh/timothydesign/script/split-type.js", () => {
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js", () => {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js", initTextAnimations);
      });
    });
  }

  // ------------------------------
  // Trigger lazy-load
  // ------------------------------
  if ("requestIdleCallback" in window) {
    requestIdleCallback(lazyLoadTextAnimations);
  } else {
    window.addEventListener("load", lazyLoadTextAnimations);
  }

});