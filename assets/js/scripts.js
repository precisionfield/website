// ============================================================
//  PRECISIONFIELD — scripts.js
//  Maneja: header scrolled state, scroll-spy del nav, menú
//  móvil, dropdown "Herramientas", scroll-reveal y email.
// ============================================================

// ── SCROLL: header + logo swap + nav activo ──
const header   = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ── MOBILE MENU ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    header.classList.toggle('menu-open');
    document.body.classList.toggle('no-scroll');
});

document.querySelectorAll('.nav-link, .nav-dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
        // El toggle del dropdown no debe cerrar el menú móvil
        if (link.classList.contains('nav-dropdown-toggle')) return;
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        header.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
    });
});

// ── DROPDOWN HERRAMIENTAS ──
const dropdown       = document.getElementById('navDropdown');
const dropdownToggle = document.getElementById('navDropdownToggle');

if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
    '.service-card, .tool-card, .about-card, .team-member, .contact-card, .section-header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ── EMAIL (anti-scraping) ──
(() => {
    const email = 'precisionfieldar' + '@' + 'gmail.com';

    const el = document.getElementById('email-link');
    if (el) {
        el.href = 'mailto:' + email;
        const text = document.getElementById('email-text');
        if (text) text.textContent = email;
    }

    const fel = document.getElementById('footer-email-link');
    if (fel) {
        fel.href = 'mailto:' + email;
        fel.textContent = email;
    }
})();
