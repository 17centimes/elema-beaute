/* ============================================
   ELEMA'BEAUTÉ — JavaScript principal
   ============================================ */

(function () {
  'use strict';

  /* -------- Menu mobile -------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Ferme le menu au clic sur un lien (mobile)
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* -------- Dropdown navigation -------- */
  document.querySelectorAll('.has-dropdown').forEach((item) => {
    const toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = item.classList.contains('open');
      // Ferme les autres dropdowns
      document.querySelectorAll('.has-dropdown.open').forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
      toggle.setAttribute('aria-expanded', !wasOpen);
    });

    // Support clavier
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Ferme les dropdowns au clic à l'extérieur
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach((item) => {
        item.classList.remove('open');
      });
    }
  });

  /* -------- FAQ accordéon -------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optionnel : ferme les autres
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* -------- Smooth scroll vers ancres -------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -------- Animation au scroll (fade-in) -------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.observe-fade').forEach((el) => observer.observe(el));

  /* -------- Carrousel bannière -------- */
  document.querySelectorAll('[data-carousel]').forEach((car) => {
    const slides = Array.from(car.querySelectorAll('.carousel-slide'));
    const dots = Array.from(car.querySelectorAll('.carousel-dot'));
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;

    const show = (n) => {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    };

    const start = () => {
      stop();
      timer = setInterval(() => show(index + 1), 5000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };

    car.querySelector('.carousel-next')?.addEventListener('click', () => { show(index + 1); start(); });
    car.querySelector('.carousel-prev')?.addEventListener('click', () => { show(index - 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));

    car.addEventListener('mouseenter', stop);
    car.addEventListener('mouseleave', start);

    start();
  });

  /* -------- Slider Avant / Après -------- */
  document.querySelectorAll('[data-ba]').forEach((slider) => {
    const range = slider.querySelector('.ba-range');
    if (!range) return;
    const update = () => slider.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', update);
    update();
  });

  /* -------- Galerie carrousel (réalisations) -------- */
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('.gallery-track');
    if (!track) return;
    const stepSize = () => {
      const item = track.querySelector('.gallery-item');
      if (!item) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return item.getBoundingClientRect().width + gap;
    };
    gallery.querySelector('.gallery-next')?.addEventListener('click', () => {
      track.scrollBy({ left: stepSize(), behavior: 'smooth' });
    });
    gallery.querySelector('.gallery-prev')?.addEventListener('click', () => {
      track.scrollBy({ left: -stepSize(), behavior: 'smooth' });
    });
  });

  /* -------- Carrousel de sliders Avant / Après -------- */
  document.querySelectorAll('[data-ba-carousel]').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.ba-carousel-slide'));
    const count = carousel.querySelector('.ba-carousel-count');
    if (slides.length < 2) return;
    let index = 0;
    const show = (n) => {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      if (count) count.textContent = (index + 1) + ' / ' + slides.length;
    };
    carousel.querySelector('.ba-carousel-next')?.addEventListener('click', () => show(index + 1));
    carousel.querySelector('.ba-carousel-prev')?.addEventListener('click', () => show(index - 1));
    show(0);
  });

  /* -------- Année footer dynamique -------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
