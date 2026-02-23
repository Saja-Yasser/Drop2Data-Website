if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  ScrollTrigger.refresh();
});


// Scroll smooth for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Carousel Logic
const items = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const fills = document.querySelectorAll('.fill');
const duration = 4000;
let index = 0;
let timer;

function updateCarousel(i) {
  index = i;
  const total = items.length;

  items.forEach((item, idx) => {
    const diff = ((idx - index + total) % total); // relative position
    let posX = '-50%';
    let rotate = 0;
    let scale = 1;
    let opacity = 1;
    let blur = 0;

    // Toggle active class for mobile fade support
    if (diff === 0) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }

    if (diff === 0) { // center
      posX = '-50%';
      rotate = 0;
      scale = 1.5;
      opacity = 1;
      item.style.zIndex = 10;
      item.style.pointerEvents = 'auto';
      blur = 0;
    } else if (diff === 1 || diff === -(total - 1)) { // next
      posX = '50%';
      rotate = -20;
      scale = 0.8;
      opacity = 1;
      blur = 2.5;
      item.style.zIndex = 5;
      item.style.pointerEvents = 'auto';
    } else if (diff === total - 1 || diff === -1) { // previous
      posX = '-150%';
      rotate = 20;
      scale = 0.8;
      opacity = 1;
      item.style.zIndex = 5;
      blur = 2.5;
      item.style.pointerEvents = 'auto';
    } else { // far slides
      if (diff < total / 2) posX = `${-150 - (diff - 1) * 50}%`;
      else posX = `${50 + (diff - 1) * 50}%`;
      rotate = 0;
      scale = 0.6;
      opacity = 0;
      blur = 5;
      item.style.zIndex = 0;
      item.style.pointerEvents = 'none';
    }

    item.style.transform = `translateX(${posX}) rotateY(${rotate}deg) scale(${scale})`;
    item.style.opacity = opacity;
    item.style.filter = `blur(${blur}px)`;
  });


  // Update dots & progress
  dots.forEach(dot => dot.classList.remove('active'));
  fills.forEach(fill => {
    fill.style.transition = 'none';
    fill.style.width = '0%';
  });

  dots[index].classList.add('active');

  setTimeout(() => {
    fills[index].style.transition = `width ${duration}ms linear`;
    fills[index].style.width = '100%';
  }, 50);

  // Auto next
  clearTimeout(timer);
  timer = setTimeout(() => updateCarousel((index + 1) % items.length), duration);
}

// Clickable dots
dots.forEach((dot, i) => dot.addEventListener('click', () => updateCarousel(i)));

// Initialize
updateCarousel(index);

/* PARTICLES */
particlesJS("particles-js", {
  particles: {
    number: { value: 120 },
    color: { value: "#ffffff" },
    size: { value: 3, random: true },
    move: { speed: 2 },
    line_linked: { enable: true }
  }
});

// GSAP Animations
// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray(".story-section");

ScrollTrigger.matchMedia({
  // DESKTOP ONLY
  "(min-width: 901px)": function () {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-wrapper",
        start: "top top",
        end: "+=800%",
        scrub: 1,
        pin: true,
        pinSpacing: true
      }
    });

    // 1. INITIAL SETUP
    gsap.set(".story-section:not(.section-1)", { yPercent: 100 });
    gsap.set(".move-item", { opacity: 0, y: 50 });

    // 2. LOGIC LOOP
    sections.forEach((section, i) => {
      const items = section.querySelectorAll(".move-item");

      // --- SECTION 1 LOGIC ---
      if (i === 0) {
        tl.to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1
        });
      }
      // --- SECTIONS 2 & 3 LOGIC ---
      else {
        tl.to(section, {
          yPercent: 0,
          duration: 1,
          ease: "power2.inOut"
        });

        tl.to(sections[i - 1].querySelectorAll(".move-item"), {
          opacity: 0,
          y: -50,
          duration: 1
        }, "<");

        items.forEach((item, index) => {
          tl.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.2)"
          });
        });
      }
    });

    return () => {
      tl.kill();
    };
  },

  // MOBILE
  "(max-width: 900px)": function () {
    gsap.set(".story-section", { clearProps: "all" });
    gsap.set(".move-item", { clearProps: "all" });
    gsap.set(".pin-wrapper", { clearProps: "all" });
  }
});

const cards = document.querySelectorAll(".feature-card");

cards.forEach(card => {
  const text = card.querySelector("p");

  // Create a timeline for expansion
  const tl = gsap.timeline({ paused: true });

  tl.to(card, { height: 420, duration: 0.5, ease: "power2.out" }) // expand card
    .to(text, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3"); // slide text up

  const playAnimation = () => {
    if (!card.classList.contains("expanded")) {
      tl.play();
      card.classList.add("expanded");
    }
  };

  card.addEventListener("mouseenter", playAnimation);
  card.addEventListener("click", playAnimation); // support click/tap for mobile
});



// Make sure GSAP + ScrollTrigger are included
gsap.registerPlugin(ScrollTrigger);

// Title — only plays when truly visible
gsap.from(".how-it-works h2", {
  scrollTrigger: {
    trigger: ".how-it-works",
    start: "top center", // waits until section hits center of screen
    once: true           // plays only once
  },
  y: 80,
  opacity: 0,
  scale: 0.9,
  duration: 1.5,
  ease: "power4.out"
});

// Steps — cinematic drift → perfect landing
gsap.fromTo(
  ".step",
  {
    y: 120,
    x: () => gsap.utils.random(-80, 80),
    rotation: () => gsap.utils.random(-12, 12),
    scale: 0.85,
    opacity: 0
  },
  {
    scrollTrigger: {
      trigger: ".how-it-works",
      start: "top 60%",
      once: true
    },
    y: 0,
    x: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    duration: 2,
    ease: "expo.out",
    stagger: {
      each: 0.4
    }
  }
);

// Footer Particles
document.addEventListener("DOMContentLoaded", () => {
  particlesJS("particles-footer", {
    particles: {
      number: { value: 120 },
      color: { value: "#ffffff" },
      size: { value: 3, random: true },
      move: { speed: 2 },
      line_linked: { enable: true }
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        }
      }
    },
    retina_detect: true
  });

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const backdrop = document.querySelector(".mobile-nav-backdrop");

  if (hamburger && mobileNav) {
    const toggleMenu = () => {
      const isActive = mobileNav.classList.toggle("active");
      hamburger.classList.toggle("active");
      if (backdrop) backdrop.classList.toggle("active");

      // Control body scroll
      if (isActive) {
        document.body.classList.add("no-scroll");
        document.documentElement.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
        document.documentElement.classList.remove("no-scroll");
      }
    };

    hamburger.addEventListener("click", toggleMenu);
    if (backdrop) backdrop.addEventListener("click", toggleMenu);

    // Close menu when a link is clicked
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        if (backdrop) backdrop.classList.remove("active");
        document.body.classList.remove("no-scroll");
        document.documentElement.classList.remove("no-scroll");
      });
    });
  }

  // Carousel Swipe Support
  const carouselContainer = document.querySelector(".carousel");
  let touchStartX = 0;
  let touchEndX = 0;

  if (carouselContainer) {
    carouselContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50; // min distance for swipe
    if (touchEndX < touchStartX - threshold) {
      // Swiped Left -> Next
      updateCarousel((index + 1) % items.length);
    }
    else if (touchEndX > touchStartX + threshold) {
      // Swiped Right -> Prev
      updateCarousel((index - 1 + items.length) % items.length);
    }
  }
});


if (window.innerWidth < 900) {
  gsap.utils.toArray(".story-section").forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });
}

/* ============================= */