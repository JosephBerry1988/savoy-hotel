{\rtf1\ansi\ansicpg1252\cocoartf2820
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \
document.addEventListener("DOMContentLoaded", () => \{\
  // ----------------------------------------\
  // 1\uc0\u65039 \u8419  Scroll progress animation\
  // ----------------------------------------\
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") \{\
    gsap.registerPlugin(ScrollTrigger);\
\
    const progressText = document.querySelector(".progress-text");\
    const progressObj = \{ value: 0 \};\
\
    gsap.to(progressObj, \{\
      value: 100,\
      ease: "none",\
      scrollTrigger: \{\
        trigger: document.body,\
        start: "top top",\
        end: "bottom bottom",\
        scrub: true\
      \},\
      onUpdate: () => \{\
        progressText.textContent = Math.round(progressObj.value)\
                                  .toString()\
                                  .padStart(2, '0');\
      \}\
    \});\
  \} else \{\
    console.error("GSAP or ScrollTrigger is not loaded");\
  \}\
\
  // ----------------------------------------\
  // 2\uc0\u65039 \u8419  Menu animation logic (GPU optimized)\
  // ----------------------------------------\
  const parents = document.querySelectorAll(".nav-link-s-parent");\
  let activeParent = null;\
  let activeTimeline = null;\
  let nextToOpen = null;\
\
  parents.forEach((parent) => \{\
    const menu = parent.querySelector(".menu-second-level");\
    const bg = menu.querySelector(".menu-bg-wipe");\
    const borderLine = bg.querySelector(".border-line-left");\
    const links = menu.querySelectorAll(".nav-links-child");\
\
    // GPU acceleration\
    [bg, borderLine, ...links].forEach(el => \{\
      el.style.willChange = "transform, opacity";\
    \});\
\
    // Build GSAP timeline for this parent\
    const tl = gsap.timeline(\{ paused: true, defaults: \{ ease: "power2.out" \} \});\
\
    // OPEN sequence (transform-based)\
    tl.set(menu, \{ display: "flex" \});\
    tl.fromTo(bg, \{ scaleX: 0, transformOrigin: "left center" \}, \{ scaleX: 1, duration: 0.4 \}, 0);\
    tl.fromTo(borderLine, \{ autoAlpha: 0 \}, \{ autoAlpha: 1, duration: 0.2 \}, 0.2);\
    tl.fromTo(\
      links,\
      \{ y: 60, autoAlpha: 0 \},\
      \{ y: 0, autoAlpha: 1, duration: 0.2, stagger: 0.1 \},\
      0.1\
    );\
\
    // On close complete \'97 hide menu\
    tl.eventCallback("onReverseComplete", () => \{\
      gsap.set(menu, \{ display: "none" \});\
      if (nextToOpen) \{\
        openMenu(nextToOpen);\
        nextToOpen = null;\
      \}\
    \});\
\
    parent.timeline = tl;\
\
    parent.addEventListener("click", (e) => \{\
      if (e.target.closest(".menu-second-level")) return;\
\
      const isSameParent = activeParent === parent;\
\
      if (isSameParent) \{\
        activeTimeline.timeScale(1.3).reverse();\
        activeParent = null;\
        activeTimeline = null;\
        nextToOpen = null;\
        return;\
      \}\
\
      if (activeTimeline) \{\
        activeTimeline.timeScale(1.3);\
        nextToOpen = parent;\
        activeTimeline.reverse();\
      \} else \{\
        openMenu(parent);\
      \}\
    \});\
\
    function openMenu(targetParent) \{\
      const tl = targetParent.timeline;\
      tl.timeScale(1).play(0);\
      activeParent = targetParent;\
      activeTimeline = tl;\
    \}\
  \});\
\
  // ----------------------------------------\
  // .menu-back & .menu-btn close logic\
  // ----------------------------------------\
  const menuBacks = document.querySelectorAll(".menu-back");\
  const menuBtns = document.querySelectorAll(".menu-btn");\
\
  function closeActiveMenu(quick = false) \{\
    if (activeTimeline) \{\
      activeTimeline.timeScale(quick ? 2 : 1.3);\
      activeTimeline.reverse();\
      activeParent = null;\
      activeTimeline = null;\
      nextToOpen = null;\
    \}\
  \}\
\
  menuBacks.forEach((btn) => \{\
    btn.addEventListener("click", (e) => \{\
      e.stopPropagation();\
      closeActiveMenu();\
    \});\
  \});\
\
  menuBtns.forEach((btn) => \{\
    btn.addEventListener("click", () => closeActiveMenu(true));\
  \});\
\});\
\
}