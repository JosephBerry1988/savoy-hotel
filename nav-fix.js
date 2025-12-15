// nav.js — Webflow Component Safe + GSAP Reset Safe

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
    if (!parents.length || typeof gsap === "undefined") return;

    let activeParent = null;
    let activeTimeline = null;
    let nextToOpen = null;

    parents.forEach((parent) => {
      const menu = parent.querySelector(".menu-second-level");
      if (!menu) return;

      const bg = menu.querySelector(".menu-bg-wipe");
      const borderLine = menu.querySelector(".border-line-left");
      const links = menu.querySelectorAll(".nav-links-child");

      if (!bg || !borderLine || !links.length) return;

      // Initial hidden state (important)
      gsap.set(menu, { display: "none" });
      gsap.set(bg, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(borderLine, { autoAlpha: 0 });
      gsap.set(links, { y: 60, autoAlpha: 0 });

      // Performance hint
      [bg, borderLine, ...links].forEach(el => {
        el.style.willChange = "transform, opacity";
      });

      // Build timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" }
      });

      tl.set(menu, { display: "flex" });
      tl.to(bg, { scaleX: 1, duration: 0.4 }, 0);
      tl.to(borderLine, { autoAlpha: 1, duration: 0.2 }, 0.2);
      tl.to(
        links,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.25,
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

      // ----------------------------------------
      // Click handler
      // ----------------------------------------
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

    // ----------------------------------------
    // Open menu (FORCED RESET)
    // ----------------------------------------
    function openMenu(parent) {
      const menu = parent.querySelector(".menu-second-level");
      const bg = menu.querySelector(".menu-bg-wipe");
      const borderLine = menu.querySelector(".border-line-left");
      const links = menu.querySelectorAll(".nav-links-child");

      // 🔥 FORCE clean start every time
      gsap.set(menu, { display: "flex" });
      gsap.set(bg, { scaleX: 0 });
      gsap.set(borderLine, { autoAlpha: 0 });
      gsap.set(links, { y: 60, autoAlpha: 0 });

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
    // 3️⃣ Close buttons
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
  // 4️⃣ Webflow-safe init
  // ----------------------------------------
  if (window.Webflow) {
    Webflow.push(initNav);
  } else {
    window.addEventListener("load", initNav);
  }

})();
