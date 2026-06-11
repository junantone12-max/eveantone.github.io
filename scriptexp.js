/* =========================================================
   PORTFOLIO INTERACTIONS
   Everything here is purely visual/interactive — no links
   go anywhere yet, this just makes the page feel alive.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     1. NAV: solid background on scroll
  ----------------------------------------------------- */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();


  /* -----------------------------------------------------
     2. NAV: highlight the link for the section in view
  ----------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));


  /* -----------------------------------------------------
     3. GROWING VINE: draw it as the page is scrolled
  ----------------------------------------------------- */
  const vinePath = document.querySelector('.vine-path');
  const vineSvg = document.querySelector('.vine');

  function setVineHeight() {
    const height = document.body.scrollHeight;
    vineSvg.setAttribute('viewBox', `0 0 60 ${height}`);
    vineSvg.style.height = height + 'px';
  }

  function updateVineDraw() {
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const length = vinePath.getTotalLength();
    vinePath.style.strokeDasharray = length;
    vinePath.style.strokeDashoffset = length * (1 - progress);
  }

  setVineHeight();
  updateVineDraw();

  window.addEventListener('scroll', updateVineDraw);
  window.addEventListener('resize', () => {
    setVineHeight();
    updateVineDraw();
  });


  /* -----------------------------------------------------
     4. REVEAL ON SCROLL: fade/slide elements into view
  ----------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.section-tag, .about-grid, .skills-grid .skill-card, .work-grid .work-card, .section-title, .contact-title, .contact-sub, .contact-form, .socials'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // small stagger for elements that reveal at the same time
        const delay = (index % 4) * 80;
        setTimeout(() => entry.target.classList.add('reveal-visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* -----------------------------------------------------
     5. CURSOR GLOW: soft light that follows the mouse
  ----------------------------------------------------- */
  const glow = document.getElementById('cursorGlow');
  let glowTargetX = window.innerWidth / 2;
  let glowTargetY = window.innerHeight / 2;
  let glowX = glowTargetX;
  let glowY = glowTargetY;

  window.addEventListener('mousemove', (e) => {
    glowTargetX = e.clientX;
    glowTargetY = e.clientY;
  });

  function animateGlow() {
    // ease toward the target position for a smooth, trailing feel
    glowX += (glowTargetX - glowX) * 0.12;
    glowY += (glowTargetY - glowY) * 0.12;
    if (glow) {
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateGlow);
  }
  if (glow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateGlow();
  }


  /* -----------------------------------------------------
     6. FALLING LEAVES: ambient leaves drifting in the hero
  ----------------------------------------------------- */
  const hero = document.querySelector('.hero');
  const leafSymbols = ['🍃', '🌿', '🍂','🌱','🌾'];

  function spawnLeaf() {
    if (!hero) return;
    const leaf = document.createElement('span');
    leaf.className = 'leaf-particle';
    leaf.textContent = leafSymbols[Math.floor(Math.random() * leafSymbols.length)];

    const startLeft = Math.random() * 100; // percentage
    const fallDuration = 8 + Math.random() * 6; // seconds
    const sway = (Math.random() * 80 - 40); // px, drifts left or right
    const size = 0.9 + Math.random() * 0.9; // rem

    leaf.style.left = `${startLeft}%`;
    leaf.style.fontSize = `${size}rem`;
    leaf.style.animationDuration = `${fallDuration}s`;
    leaf.style.setProperty('--sway', `${sway}px`);

    hero.appendChild(leaf);

    // clean up once it has fallen past the bottom
    setTimeout(() => leaf.remove(), fallDuration * 1000 + 500);
  }

  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // seed a few leaves immediately, then keep spawning
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnLeaf, i * 1200);
    }
    setInterval(spawnLeaf, 1000);
  }


  /* -----------------------------------------------------
     7. MAGNETIC BUTTONS: gently pull toward the cursor
  ----------------------------------------------------- */
  const magneticEls = document.querySelectorAll('.btn');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });


  /* -----------------------------------------------------
     8. RIPPLE EFFECT: little burst on button click
  ----------------------------------------------------- */
  magneticEls.forEach(el => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });


  /* -----------------------------------------------------
     9. TILT CARDS: subtle 3D tilt on skill & work cards
  ----------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.skill-card, .work-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // tilt up/down
      const rotateY = ((x - centerX) / centerX) * 6;  // tilt left/right

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* -----------------------------------------------------
     10. CONTACT FORM: small "sent" confirmation animation
  ----------------------------------------------------- */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const button = contactForm.querySelector('button[type="submit"]');
      if (!button) return;

      const originalText = button.textContent;
      button.textContent = 'Sent! 🌱';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 2200);
    });
  }


  /* -----------------------------------------------------
     11. SMOOTH SCROLL: nav links scroll smoothly with offset
  ----------------------------------------------------- */
  const navAnchors = document.querySelectorAll('a[href^="#"]');

  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

});