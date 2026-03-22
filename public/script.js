/* ============================================
   ANSH PORTFOLIO — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- SCROLL-SPY: Active nav link ---- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ---- AOS-like scroll animation ---- */
  const aosElements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  aosElements.forEach(el => observer.observe(el));

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = mobileMenu.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity  = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    document.querySelectorAll('.mobile-link, .mobile-resume').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ---- NAVBAR: shrink top margin on scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.style.top = window.scrollY > 50 ? '10px' : '20px';
    }, { passive: true });
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      // Form posts to formspree — let it submit normally but show success
      const btn = contactForm.querySelector('.btn-submit');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        btn.disabled = true;
      }

      // Intercept to show success (formspree handles actual sending)
      // If you want to prevent navigation, use fetch instead:
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        if (btn) { btn.textContent = 'Send Message'; btn.style.opacity = ''; btn.disabled = false; }
        return;
      }

      // POST via fetch to formspree
      fetch(contactForm.action || 'https://formspree.io/f/movlnjnb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      .then(res => {
        formSuccess.classList.add('visible');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      })
      .catch(() => {
        // Fallback: open mailto
        const subject = encodeURIComponent('Portfolio Contact from ' + name);
        const body = encodeURIComponent(message + '\n\nFrom: ' + name + '\nEmail: ' + email);
        window.open('mailto:pratapsingh07017@gmail.com?subject=' + subject + '&body=' + body, '_blank');
        formSuccess.classList.add('visible');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      })
      .finally(() => {
        if (btn) { btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'; btn.style.opacity = ''; btn.disabled = false; }
      });
    });
  }

  /* ---- COUNTER ANIMATION for bento stats ---- */
  function animateCounter(el, target, isFloat) {
    let start = 0;
    const duration = 1400;
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      start += increment;
      if (count >= steps) { start = target; clearInterval(timer); }
      el.dataset.display = isFloat ? start.toFixed(2) : Math.floor(start).toString();
      renderStat(el, isFloat ? start.toFixed(2) : Math.floor(start));
    }, duration / steps);
  }

  function renderStat(numEl, val) {
    const card = numEl.closest('.bento-stat');
    if (!card) return;
    const platform = card.querySelector('.stat-platform');
    const isLeet = platform && platform.textContent.includes('LeetCode');
    numEl.innerHTML = isLeet
      ? val + '<span class="stat-plus">+</span>'
      : val;
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const numEl = card.querySelector('.stat-number');
        if (!numEl || numEl.dataset.animated) return;
        numEl.dataset.animated = 'true';
        const platform = card.querySelector('.stat-platform');
        if (platform && platform.textContent.includes('LeetCode')) animateCounter(numEl, 600, false);
        else if (platform && platform.textContent.includes('CGPA')) animateCounter(numEl, 9.13, true);
        statsObserver.unobserve(card);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.bento-stat').forEach(card => statsObserver.observe(card));

  /* ---- HIRE ME sparkle ---- */
  document.querySelectorAll('.btn-hire').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.style.cssText = 'position:fixed;width:4px;height:4px;background:#ff6b00;border-radius:50%;pointer-events:none;z-index:9999;opacity:1;transition:all 0.55s ease-out;';
        const rect = btn.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        sparkle.style.left = x + 'px';
        sparkle.style.top  = y + 'px';
        document.body.appendChild(sparkle);
        const angle = Math.random() * 2 * Math.PI;
        const dist  = 25 + Math.random() * 35;
        requestAnimationFrame(() => {
          sparkle.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`;
          sparkle.style.opacity = '0';
        });
        setTimeout(() => sparkle.remove(), 650);
      }
    });
  });

  /* ---- Blinking cursor on hero title ---- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = 'color:#ff6b00;margin-left:2px;animation:blink 1s step-end infinite;';
    const style = document.createElement('style');
    style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(style);
    heroTitle.appendChild(cursor);
  }
});