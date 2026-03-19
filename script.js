document.addEventListener('DOMContentLoaded', () => {
    const ANALYTICS_MEASUREMENT_ID = (document.querySelector('meta[name="ga4-measurement-id"]')?.content || '').trim();
    const ANALYTICS_ALLOWED_HOSTS = ['kokkiusa.com', 'www.kokkiusa.com'];

    function updateViewportUnit() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    updateViewportUnit();
    window.addEventListener('resize', updateViewportUnit, { passive: true });
    window.addEventListener('orientationchange', updateViewportUnit, { passive: true });

    function initAnalytics() {
        if (!ANALYTICS_MEASUREMENT_ID) return;
        if (!ANALYTICS_ALLOWED_HOSTS.includes(window.location.hostname)) return;

        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_MEASUREMENT_ID)}`;
        document.head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', ANALYTICS_MEASUREMENT_ID, {
            anonymize_ip: true,
            transport_type: 'beacon'
        });
    }

    function trackEvent(eventName, params = {}) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    }

    initAnalytics();

    function markVideoFallback(video) {
        if (!video) return;
        video.classList.add('is-fallback');
        const holder = video.closest('.section-bg-video-wrap, .cap-media, .hero-video-stack');
        holder?.classList.add('video-fallback-active');
    }

    // ── SECTION HEADER VIDEOS ──
    document.querySelectorAll('.section-header-video, .section-bg-video, .cap-media-video').forEach((video) => {
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.addEventListener('error', () => markVideoFallback(video));
        video.play().catch(() => markVideoFallback(video));
    });

    // ── NAV ──
    const nav      = document.querySelector('.site-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');

    // ── HERO VIDEO ──
    const heroVideo      = document.getElementById('heroVideo');
    const heroTextBlocks = document.querySelectorAll('.hero-copy-block');
    const heroVideos = [
        {
              mp4: 'https://github.com/monish251220025/kokki-new-site/releases/download/v1.0-videos/machining-web.mp4'
        },
        {
              mp4: 'https://github.com/monish251220025/kokki-new-site/releases/download/v1.0-videos/die-casting-web.mp4'
        }
    ];
    let heroVideoIndex = 0;

    function resolvePlayableSource(entry) {
        if (!heroVideo) return '';
        const candidates = [
            { src: entry.mp4, type: 'video/mp4' },
            { src: entry.m4v, type: 'video/mp4' },
            { src: entry.mov, type: 'video/quicktime' }
        ].filter((item) => Boolean(item.src));

        const supported = candidates.find((item) => {
            try {
                return heroVideo.canPlayType(item.type) !== '';
            } catch {
                return false;
            }
        });

        return (supported || candidates[0] || {}).src || '';
    }

    function loadHeroVideo(index) {
        if (!heroVideo) return;
        const source = resolvePlayableSource(heroVideos[index]);
        if (!source) {
            markVideoFallback(heroVideo);
            return;
        }
        heroVideo.classList.remove('is-fallback');
        heroVideo.closest('.hero-video-stack')?.classList.remove('video-fallback-active');
        heroVideo.src = encodeURI(source);
        heroVideo.load();
        heroVideo.play().catch(() => markVideoFallback(heroVideo));
    }

    if (heroVideo) {
        heroVideo.muted       = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute('webkit-playsinline', '');
        heroVideo.addEventListener('error', () => {
            heroVideoIndex = (heroVideoIndex + 1) % heroVideos.length;
            loadHeroVideo(heroVideoIndex);
        });
        loadHeroVideo(heroVideoIndex);
        heroVideo.addEventListener('ended', () => { heroVideoIndex = (heroVideoIndex + 1) % heroVideos.length; loadHeroVideo(heroVideoIndex); });
    }

    // Staggered hero text reveal
    heroTextBlocks.forEach((block, idx) => {
        setTimeout(() => block.classList.add('is-visible'), 540 + idx * 380);
    });

    // ── SCROLL STATE ──
    function updateNav() {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 60);

        let activeId = 'hero';
        sections.forEach((section) => {
            const b = section.getBoundingClientRect();
            if (b.top <= 110 && b.bottom >= 110) activeId = section.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
        });

        if (heroVideo) {
            heroVideo.style.transform = `scale(1.04) translateY(${Math.min(28, y * 0.024).toFixed(1)}px)`;
        }
    }

    updateNav();
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(() => {
            updateNav();
            navTicking = false;
        });
    }, { passive: true });

    // ── SMOOTH ANCHOR SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const reduceMotionNow = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ behavior: reduceMotionNow ? 'auto' : 'smooth' });
        });
    });

    // ── REDUCED MOTION CHECK ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const enablePointerFx = !prefersReducedMotion && !isCoarsePointer;

    // ── ORANGE PIXEL CURSOR TRAIL ──
    let pixelTick = 0;
    if (enablePointerFx) {
        let lastMouseX = 0;
        let lastMouseY = 0;
        let hasMousePos = false;

        document.addEventListener('mousemove', (e) => {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            hasMousePos = true;
        }, { passive: true });

        function drawCursorTrail() {
            if (hasMousePos) {
                pixelTick++;
                if (!document.hidden && pixelTick % 9 === 0) {
                    const dot = document.createElement('span');
                    dot.className = 'pixel-cursor-dot';
                    dot.style.left = `${lastMouseX}px`;
                    dot.style.top  = `${lastMouseY}px`;
                    document.body.appendChild(dot);
                    setTimeout(() => dot.remove(), 500);
                }
            }
            requestAnimationFrame(drawCursorTrail);
        }
        requestAnimationFrame(drawCursorTrail);
    }

    // ── POINTER-REACTIVE TILT ──
    const tiltSelectors = [
        '.all-project-card',
        '.project-media',
        '.how-visual',
        '.feature-card',
        '.why-visual',
        '.founder-photo',
        '.dropdown',
        '.fleet-row',
        '.metric-pill',
        '.founder-block',
    ].join(',');

    if (enablePointerFx) {
        document.querySelectorAll(tiltSelectors).forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const r    = el.getBoundingClientRect();
                const xRel = (e.clientX - r.left) / r.width;
                const yRel = (e.clientY - r.top)  / r.height;
                const rotY = (xRel - 0.5) * 5;
                const rotX = (0.5 - yRel) * 3.5;
                el.style.transform = `perspective(820px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`;
                el.style.setProperty('--mx', `${(xRel * 100).toFixed(1)}%`);
                el.style.setProperty('--my', `${(yRel * 100).toFixed(1)}%`);
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.setProperty('--mx', '50%');
                el.style.setProperty('--my', '50%');
            });
        });
    }

    // ── PROJECT MODE TOGGLE (Case Studies / All Projects) ──
    const projectModeButtons = document.querySelectorAll('.project-mode-btn');
    const caseStudiesPanel   = document.getElementById('caseStudiesPanel');
    const allProjectsPanel   = document.getElementById('allProjectsPanel');

    projectModeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');
            trackEvent('project_mode_switch', { mode });
            projectModeButtons.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            const showCase = mode === 'case';
            if (caseStudiesPanel) {
                caseStudiesPanel.classList.toggle('is-visible', showCase);
                caseStudiesPanel.setAttribute('aria-hidden', showCase ? 'false' : 'true');
            }
            if (allProjectsPanel) {
                allProjectsPanel.classList.toggle('is-visible', !showCase);
                allProjectsPanel.setAttribute('aria-hidden', showCase ? 'true' : 'false');
            }
        });
    });

    // ── PROJECT CASE NAV ──
    const projectNavBtns = document.querySelectorAll('.project-nav-btn');
    const projectCases   = document.querySelectorAll('.project-case');

    projectNavBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-project');
            trackEvent('project_case_switch', { project_case: target });
            projectNavBtns.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            projectCases.forEach((panel) => {
                const active = panel.id === target;
                panel.classList.toggle('is-active', active);
                panel.setAttribute('aria-hidden', active ? 'false' : 'true');
            });
        });
    });

    // ── ALL PROJECTS FILTER ──
    const filterBtns      = document.querySelectorAll('.all-filter-btn');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            trackEvent('project_filter', { filter });
            filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
            document.querySelectorAll('.all-project-card').forEach((card) => {
                card.classList.toggle(
                    'is-hidden',
                    filter !== 'all' && card.getAttribute('data-category') !== filter
                );
            });
        });
    });

    // ── PROJECT MEDIA CAROUSEL ──
    function initCarousel(root) {
        const imageData = root.getAttribute('data-images');
        if (!imageData) return;
        const images = imageData.split('|').map(s => s.trim()).filter(Boolean);
        if (!images.length) return;

        const main    = root.querySelector('.media-main');
        const cloud1  = root.querySelector('.media-cloud-1');
        const cloud2  = root.querySelector('.media-cloud-2');
        const prev    = root.querySelector('.media-arrow.prev');
        const next    = root.querySelector('.media-arrow.next');
        const dotWrap = root.querySelector('.media-dots');

        let current = 0;

        function show(index) {
            current = ((index % images.length) + images.length) % images.length;
            if (main)   main.style.backgroundImage   = `url("${encodeURI(images[current])}")`;
            if (cloud1) cloud1.style.backgroundImage = `url("${encodeURI(images[(current + 1) % images.length])}")`;
            if (cloud2) cloud2.style.backgroundImage = `url("${encodeURI(images[(current + 2) % images.length])}")`;
            dotWrap?.querySelectorAll('.media-dot').forEach((d, i) => d.classList.toggle('is-active', i === current));
        }

        if (dotWrap) {
            images.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'media-dot';
                dot.type      = 'button';
                dot.setAttribute('aria-label', `Image ${i + 1}`);
                dot.addEventListener('click', () => show(i));
                dotWrap.appendChild(dot);
            });
        }

        prev?.addEventListener('click', () => show(current - 1));
        next?.addEventListener('click', () => show(current + 1));

        show(0);
    }

    document.querySelectorAll('.project-media').forEach(initCarousel);

    // ── INTERSECTION OBSERVER — SCROLL REVEALS ──
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    function addReveal(selector, ...extraClasses) {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal', ...extraClasses);
            revealObs.observe(el);
        });
    }

    addReveal('.section-header .container');
    addReveal('.cap-layout');
    addReveal('.cap-hud', 'reveal-delay-2');
    addReveal('.why-layout');
    addReveal('.why-explain', 'reveal-delay-1');
    addReveal('.line-stack', 'reveal-delay-1');
    addReveal('.metric-strip', 'reveal-delay-2');
    addReveal('.project-left');
    addReveal('.projects-landing-copy');
    addReveal('.why-highlight .container');

    document.querySelectorAll('.fleet-row').forEach((el, i) => {
        el.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 6)}`);
        revealObs.observe(el);
    });

    document.querySelectorAll('.founder-block').forEach((el, i) => {
        el.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 4)}`);
        revealObs.observe(el);
    });

    // ── METRIC COUNT-UP ANIMATION ──
    function animateCount(strong, end, suffix, duration) {
        const startTime = performance.now();
        function step(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            strong.textContent = Math.round(eased * end) + suffix;
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const metricObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const pill = entry.target;
            pill.classList.add('is-visible');
            const strong = pill.querySelector('strong');
            if (strong && !prefersReducedMotion) {
                const text = strong.textContent.trim();
                const m = text.match(/^(\d[\d,]*)/);
                if (m) {
                    const val = parseInt(m[1].replace(',', ''), 10);
                    const suffix = text.slice(m[1].length);
                    if (val > 5) animateCount(strong, val, suffix, 1100);
                }
            }
            metricObs.unobserve(pill);
        });
    }, { threshold: 0.55 });
    document.querySelectorAll('.metric-pill').forEach(p => metricObs.observe(p));

    // ── MAGNETIC EFFECT on mode + filter buttons ──
    if (enablePointerFx) {
        document.querySelectorAll('.project-mode-btn, .all-filter-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
                const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
                btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // ── KEYBOARD CAROUSEL SUPPORT ──
    document.querySelectorAll('.project-media').forEach(carousel => {
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  carousel.querySelector('.media-arrow.prev')?.click();
            if (e.key === 'ArrowRight') carousel.querySelector('.media-arrow.next')?.click();
        });
    });

    document.querySelectorAll('a[href="contact.html"], a[href$="contact.html"], .btn-primary, .nav-cta').forEach((el) => {
        el.addEventListener('click', () => {
            trackEvent('cta_click', {
                label: (el.textContent || '').trim().slice(0, 80),
                target: el.getAttribute('href') || ''
            });
        });
    });

    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', () => {
        trackEvent('contact_form_submit', { form: 'contact-form' });
    });

    // ── HOW IT WORKS — SCROLL DRUM ──
    (function initHowDrum() {
        const track  = document.getElementById('howWheelTrack');
        const slides = Array.from(document.querySelectorAll('.how-drum-slide'));
        const nodes  = Array.from(document.querySelectorAll('.how-pipe-node'));
        const fill   = document.getElementById('howPipelineFill');
        if (!track || !slides.length) return;

        const TOTAL = slides.length;
        let current = -1;

        function setSlide(idx) {
            idx = Math.max(0, Math.min(TOTAL - 1, idx));
            if (idx === current) return;
            current = idx;

            slides.forEach((s, i) => {
                s.classList.remove('is-active', 'is-prev', 'is-next');
                if      (i === idx)     s.classList.add('is-active');
                else if (i === idx - 1) s.classList.add('is-prev');
                else if (i === idx + 1) s.classList.add('is-next');
            });

            nodes.forEach((n, i) => {
                n.classList.toggle('is-active', i === idx);
                n.classList.toggle('is-done',   i < idx);
            });
        }

        function onDrumScroll() {
            const rect       = track.getBoundingClientRect();
            const scrolled   = -rect.top;
            const scrollable = track.offsetHeight - window.innerHeight;
            if (scrollable <= 0) {
                setSlide(0);
                if (fill) fill.style.height = '0%';
                return;
            }

            const clamped = Math.max(0, Math.min(scrollable, scrolled));
            const progress = clamped / scrollable;
            const speedBoost = 1.32;
            const rawIdx = Math.max(0, Math.min(TOTAL - 1, progress * speedBoost * (TOTAL - 1)));
            let targetIdx = Math.round(rawIdx);

            if (current >= 0) {
                const hysteresis = 0.07;
                const lower = current - 0.5 - hysteresis;
                const upper = current + 0.5 + hysteresis;
                if (rawIdx > upper) targetIdx = current + 1;
                else if (rawIdx < lower) targetIdx = current - 1;
                else targetIdx = current;
            }

            if (fill) {
                fill.style.height = `${(progress * 100).toFixed(2)}%`;
            }

            setSlide(targetIdx);
        }

        // Init with slide 1 active
        setSlide(0);
        let isTicking = false;
        window.addEventListener('scroll', () => {
            if (isTicking) return;
            isTicking = true;
            requestAnimationFrame(() => {
                onDrumScroll();
                isTicking = false;
            });
        }, { passive: true });
        window.addEventListener('resize', onDrumScroll, { passive: true });
        onDrumScroll();

        // Clickable nodes — scroll to that stage
        nodes.forEach((node, i) => {
            node.addEventListener('click', () => {
                const trackTop   = track.getBoundingClientRect().top + window.scrollY;
                const scrollable = track.offsetHeight - window.innerHeight;
                const target     = trackTop + (TOTAL <= 1 ? 0 : (i / (TOTAL - 1)) * scrollable);
                window.scrollTo({ top: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            });
        });
    })();
});
