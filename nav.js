// nav.js
window.addEventListener("load", () => {
  // ----------------------------------------
  // 1️⃣ Scroll progress animation (throttled)
  // ----------------------------------------
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const progressText = document.querySelector(".progress-text");
    const progressObj = { value: 0 };
    let latestValue = 0;
    let ticking = false;

    gsap.to(progressObj, {
      value: 100,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      },
      onUpdate: () => {
        latestValue = Math.round(progressObj.value);
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            progressText.textContent = latestValue.toString().padStart(2, "0");
            ticking = false;
          });
        }
      }
    });
  } else {
    console.error("GSAP or ScrollTrigger is not loaded");
  }

  // ----------------------------------------
  // 2️⃣ Menu animation logic (GPU optimized)
  // ----------------------------------------
  const parents = document.querySelectorAll(".nav-link-s-parent");
  let activeParent = null;
  let activeTimeline = null;
  let nextToOpen = null;

  parents.forEach((parent) => {
    const menu = parent.querySelector(".menu-second-level");
    const bg = menu.querySelector(".menu-bg-wipe");
    const borderLine = bg.querySelector(".border-line-left");
    const links = menu.querySelectorAll(".nav-links-child");

    // GPU acceleration
    [bg, borderLine, ...links].forEach(el => {
      el.style.willChange = "transform, opacity";
    });

    // Build GSAP timeline for this parent
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

    tl.set(menu, { display: "flex" });
    tl.fromTo(bg, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.4 }, 0);
    tl.fromTo(borderLine, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.2);
    tl.fromTo(
      links,
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.2, stagger: 0.1 },
      0.1
    );

    tl.eventCallback("onReverseComplete", () => {
      gsap.set(menu, { display: "none" });
      if (nextToOpen) {
        openMenu(nextToOpen);
        nextToOpen = null;
      }
    });

    parent.timeline = tl;

    parent.addEventListener("click", (e) => {
      if (e.target.closest(".menu-second-level")) return;

      const isSameParent = activeParent === parent;

      if (isSameParent) {
        activeTimeline.timeScale(1.3).reverse();
        activeParent = null;
        activeTimeline = null;
        nextToOpen = null;
        return;
      }

      if (activeTimeline) {
        activeTimeline.timeScale(1.3);
        nextToOpen = parent;
        activeTimeline.reverse();
      } else {
        openMenu(parent);
      }
    });

    function openMenu(targetParent) {
      const tl = targetParent.timeline;
      tl.timeScale(1).play(0);
      activeParent = targetParent;
      activeTimeline = tl;
    }
  });

  // ----------------------------------------
  // 3️⃣ .menu-back & .menu-btn close logic
  // ----------------------------------------
  const menuBacks = document.querySelectorAll(".menu-back");
  const menuBtns = document.querySelectorAll(".menu-btn");

  function closeActiveMenu(quick = false) {
    if (activeTimeline) {
      activeTimeline.timeScale(quick ? 2 : 1.3);
      activeTimeline.reverse();
      activeParent = null;
      activeTimeline = null;
      nextToOpen = null;
    }
  }

  menuBacks.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeActiveMenu();
    });
  });

  menuBtns.forEach((btn) => {
    btn.addEventListener("click", () => closeActiveMenu(true));
  });
});
