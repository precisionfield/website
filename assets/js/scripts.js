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

// ── FILTRO DE SERVICIOS POR RUBRO ──
(() => {
    const bar = document.getElementById('serviceFilters');
    if (!bar) return;

    const buttons = [...bar.querySelectorAll('.filter-btn')];
    const cards   = [...document.querySelectorAll('.service-card[data-rubro]')];
    if (!cards.length) return;

    const VALIDOS = new Set(buttons.map(b => b.dataset.rubro));

    function aplicar(rubro) {
        if (!VALIDOS.has(rubro)) rubro = 'todos';

        cards.forEach(card => {
            const rubros = (card.dataset.rubro || '').split(' ');
            const visible = rubro === 'todos' || rubros.includes(rubro);
            card.classList.toggle('is-filtered', !visible);

            // El scroll-reveal deja de observar tras el primer cruce: una tarjeta
            // que estuvo oculta nunca lo dispara y volveria a aparecer en opacity 0.
            if (visible) card.classList.add('visible');
        });

        buttons.forEach(b => {
            const on = b.dataset.rubro === rubro;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    bar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const rubro = btn.dataset.rubro;
        aplicar(rubro);

        // Deja el rubro en la URL para poder compartir la vista filtrada
        try {
            const url = new URL(location.href);
            if (rubro === 'todos') url.searchParams.delete('rubro');
            else url.searchParams.set('rubro', rubro);
            history.replaceState(null, '', url.pathname + url.search + '#services');
        } catch (err) { /* sin history no pasa nada grave */ }
    });

    // Filtro inicial desde la URL: index.html?rubro=forestal
    let inicial = 'todos';
    try { inicial = new URLSearchParams(location.search).get('rubro') || 'todos'; } catch (err) {}
    if (inicial !== 'todos' && VALIDOS.has(inicial)) {
        aplicar(inicial);
        window.addEventListener('load', () => {
            const s = document.getElementById('services');
            if (s) s.scrollIntoView();
        });
    }
})();
