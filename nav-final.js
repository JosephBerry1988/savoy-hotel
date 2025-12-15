// nav.js — Webflow Page-Change Safe + Component Safe

(function () {

  let navTimelines = [];

  function killNav() {
    navTimelines.forEach(tl => tl.kill());
    navTimelines = [];

    // Remove GSAP inline styles
    document
      .querySelectorAll(
        ".menu-second-level, .menu-bg-wipe, .border-line-left, .nav-links-child"
      )
      .forEach(el => el.removeAttribute("style"));
  }

  function initNav() {

    // ----------------------------------------
    // 1️⃣ Scroll progress (safe)
    // ----------------------------------------
    const progressText = document.querySelector(".progress-text");

    if (
      progressText &&
      typeof gsap !== "undefined" &&
      typeof ScrollTrigger !== "undefined"
    ) {
      gsap.registerPlugin(ScrollTrigger);

      const progressObj = { value: 0 };

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
          progressText.textContent = Math.round(progressObj.value)
            .toString()
            .padStart(2, "0");
        }
      });
    }

    // ----------------------------------------
    // 2️⃣ Nav menus
    // ----------------------------------------
    const parents = document.querySelectorAll(".nav-link-s-parent");
    if (!parents.length || typeof gsap === "undefined") return;

    let activeParent = null;
    let activeTimeline = null;
    let nextToOpen = null;

    parents.forEach(parent => {
      const menu = parent.querySelector(".menu-second-level");
      const bg = menu?.querySelector(".menu-bg-wipe");
      const borderLine = menu?.querySelector(".border-line-left");
      const links = menu?.querySelectorAll(".nav-links-child");

      if (!menu || !bg || !borderLine || !links.length) return;

      // Hard reset
      gsap.set(menu, { display: "none" });
      gsap.set(bg, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(borderLine, { autoAlpha: 0 });
      gsap.set(links, { y: 60, autoAlpha: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" }
      });

      tl.set(menu, { display: "flex" });
      tl.to(bg, { scaleX: 1, duration: 0.4 }, 0);
      tl.to(borderLine, { autoAlpha: 1, duration: 0.2 }, 0.2);
      tl.to(
        links,
        { y: 0, autoAlpha: 1, duration: 0.25, stagger: 0.1 },
        0.1
      );

      tl.eventCallback("onReverseComplete", () => {
        gsap.set(menu, { display: "none" });
        if (nextToOpen) {
          openMenu(nextToOpen);
          nextToOpen = null;
        }
      });

      navTimelines.push(tl);
      parent._timeline = tl;

      parent.addEventListener("click", e => {
        if (e.target.closest(".menu-second-level")) return;

        if (activeParent === parent) {
          activeTimeline?.reverse();
          reset();
          return;
        }

        if (activeTimeline) {
          nextToOpen = parent;
          activeTimeline.reverse();
        } else {
          openMenu(parent);
        }
      });
    });

    function openMenu(parent) {
      const menu = parent.querySelector(".menu-second-level");
      const bg = menu.querySelector(".menu-bg-wipe");
      const borderLine = menu.querySelector(".border-line-left");
      const links = menu.querySelectorAll(".nav-links-child");

      // Force clean state every time
      gsap.set(menu, { display: "flex" });
      gsap.set(bg, { scaleX: 0 });
      gsap.set(borderLine, { autoAlpha: 0 });
      gsap.set(links, { y: 60, autoAlpha: 0 });

      parent._timeline.play(0);
      activeParent = parent;
      activeTimeline = parent._timeline;
    }

    function reset() {
      activeParent = null;
      activeTimeline = null;
      nextToOpen = null;
    }

    // ----------------------------------------
    // 3️⃣ Close buttons
    // ----------------------------------------
    document.querySelectorAll(".menu-back").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        activeTimeline?.reverse();
        reset();
      });
    });

    document.querySelectorAll(".menu-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTimeline?.reverse();
        reset();
      });
    });
  }

  // ----------------------------------------
  // 4️⃣ Webflow lifecycle (THIS IS THE FIX)
  // ----------------------------------------
  if (window.Webflow) {
    Webflow.push(() => {
      killNav();
      initNav();
    });

    Webflow.on("pageChange", () => {
      killNav();
      initNav();
    });
  } else {
    window.addEventListener("load", initNav);
  }

})();
