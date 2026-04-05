document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
});





  /* ── 1. Scroll: turn nav white after 50px ────────── */
  var nav = document.getElementById('main-nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  /* ── 2. Hamburger: open / close mobile menu ─────── */
  var btn        = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var isOpen     = false;

  btn.addEventListener('click', function () {
    isOpen = !isOpen;

    if (isOpen) {
      mobileMenu.classList.add('open');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenu.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });


  /* ── 3. BONUS: close menu when a link is tapped ─── */
  var mobileLinks = document.querySelectorAll('.mobile-link');

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      isOpen = false;
      mobileMenu.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });




