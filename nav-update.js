// nav.js (Component-safe, Webflow-friendly)

(function () {
  function initNav() {

    // ----------------------------------------
    // 1️⃣ Scroll progress animation (SAFE)
    // ----------------------------------------
    const progressText = document.querySelector(".progress-text");

    if (
      progressText &&
      typeof gsap !== "undefined" &&
      typeof ScrollTrigger !== "undefined"
    ) {
      gsap.registerPlugin(ScrollTrigger);

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
              progressText.textContent = latestValue
                .toString()
                .padStart(2, "0");
              ticking = false;
            });
          }
        }
      });
    }

    // ----------------------------------------
    // 2️⃣ Menu animation logic
    // ----------------------------------------
    const parents = document.querySelectorAll(".nav-link-s-parent");
    if (!parents.length) return;

    let activeParent = null;
    let activeTimeline = null;
    let nextToOpen = null;

    parents.forEach((parent) => {
      const menu = parent.querySelector(".menu-second-level");
      if (!menu) return;

      const bg = menu.querySelector(".menu-bg-wipe");
      const borderLine = menu.querySelector(".border-line-left");
      const links = menu.querySelectorAll(".nav-links-child");

      if (!bg || !borderLine) return;

      // GPU acceleration hints
      [bg, borderLine, ...links].forEach(el => {
        if (el) el.style.willChange = "transform, opacity";
      });

      // Build GSAP timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" }
      });

      tl.set(menu, { display: "flex" });
      tl.fromTo(
        bg,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.4 },
        0
      );
      tl.fromTo(
        borderLine,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2 },
        0.2
      );
      tl.fromTo(
        links,
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.2,
          stagger: 0.1
        },
        0.1
      );

      tl.eventCallback("onReverseComplete", () => {
        gsap.set(menu, { display: "none" });
        if (nextToOpen) {
          openMenu(nextToOpen);
          nextToOpen = null;
        }
      });

      parent._timeline = tl;

      parent.addEventListener("click", (e) => {
        if (e.target.closest(".menu-second-level")) return;

        const isSameParent = activeParent === parent;

        if (isSameParent) {
          activeTimeline?.timeScale(1.3).reverse();
          resetState();
          return;
        }

        if (activeTimeline) {
          nextToOpen = parent;
          activeTimeline.timeScale(1.3).reverse();
        } else {
          openMenu(parent);
        }
      });
    });

    function openMenu(parent) {
      parent._timeline.timeScale(1).play(0);
      activeParent = parent;
      activeTimeline = parent._timeline;
    }

    function resetState() {
      activeParent = null;
      activeTimeline = null;
      nextToOpen = null;
    }

    // ----------------------------------------
    // 3️⃣ Close buttons (.menu-back / .menu-btn)
    // ----------------------------------------
    const menuBacks = document.querySelectorAll(".menu-back");
    const menuBtns = document.querySelectorAll(".menu-btn");

    function closeActiveMenu(quick = false) {
      if (!activeTimeline) return;
      activeTimeline.timeScale(quick ? 2 : 1.3).reverse();
      resetState();
    }

    menuBacks.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeActiveMenu();
      });
    });

    menuBtns.forEach(btn => {
      btn.addEventListener("click", () => closeActiveMenu(true));
    });
  }

  // ----------------------------------------
  // 4️⃣ Webflow-safe initialization
  // ----------------------------------------
  if (window.Webflow) {
    Webflow.push(initNav);
  } else {
    window.addEventListener("load", initNav);
  }

})();
