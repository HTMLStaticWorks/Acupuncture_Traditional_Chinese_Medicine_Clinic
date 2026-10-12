// Immediate execution before DOMContentLoaded to prevent theme and dir flash
(function () {
    try {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const savedDir = localStorage.getItem('dir') || 'ltr';
        document.documentElement.setAttribute('dir', savedDir);
    } catch (e) {
        console.warn('Theme/RTL storage initialization error:', e);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    // 1. Theme Toggle
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');

    function updateThemeUI() {
        const isDark = htmlElement.classList.contains('dark');
        themeToggleBtns.forEach(btn => {
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    // Sync theme on load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
    updateThemeUI();

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeUI();
        });
    });

    // 2. RTL Toggle
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');

    function updateRtlUI(dir) {
        rtlToggleBtns.forEach(btn => {
            const span = btn.querySelector('span');
            const labelText = dir === 'rtl' ? 'LTR' : 'RTL';
            if (span) {
                span.textContent = labelText;
            } else {
                btn.textContent = labelText;
            }
            btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
            btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');

            if (dir === 'rtl') {
                btn.classList.add('active-rtl', 'bg-tcm-terracotta', 'text-white', 'border-tcm-terracotta');
                btn.classList.remove('bg-gray-50', 'bg-white', 'text-tcm-charcoal');
            } else {
                btn.classList.remove('active-rtl', 'bg-tcm-terracotta', 'text-white', 'border-tcm-terracotta');
            }
        });
    }

    const savedDir = localStorage.getItem('dir') || 'ltr';
    htmlElement.setAttribute('dir', savedDir);
    updateRtlUI(savedDir);

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDir = htmlElement.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlUI(newDir);
        });
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('hidden');
            const btn = document.getElementById('mobile-menu-btn');
            if (btn) {
                const isExpanded = !menu.classList.contains('hidden');
                btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            }
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileMenuBtn.addEventListener('touchstart', toggleMobileMenu, { passive: false });
    }

    // Delegated fallback in case button is re-rendered or clicked on inner SVG
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#mobile-menu-btn');
        if (toggleBtn) {
            toggleMobileMenu(e);
            return;
        }

        // Close menu if clicking outside when open
        const menu = document.getElementById('mobile-menu');
        if (menu && !menu.classList.contains('hidden')) {
            if (!menu.contains(e.target)) {
                menu.classList.add('hidden');
                const btn = document.getElementById('mobile-menu-btn');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    if (mobileMenu) {
        // Close menu on navigation link click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                mobileMenu.classList.add('hidden');
                if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 4. Scroll to Top
    let scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scroll-to-top';
        scrollToTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-tcm-terracotta text-white rounded-full flex items-center justify-center shadow-lg opacity-0 pointer-events-none transition-all duration-300 z-[100] hover:bg-opacity-90 dark:bg-tcm-sage';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollToTopBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>';
        document.body.appendChild(scrollToTopBtn);
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            scrollToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            scrollToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Header Sticky Shadow
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('shadow-sm', 'dark:shadow-gray-800');
            } else {
                header.classList.remove('shadow-sm', 'dark:shadow-gray-800');
            }
        });
    }

    // 6. Form Validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                if (btn) {
                    const origText = btn.innerHTML;
                    btn.innerHTML = 'Success!';
                    btn.classList.add('bg-green-600');
                    setTimeout(() => {
                        btn.innerHTML = origText;
                        btn.classList.remove('bg-green-600');
                        form.reset();
                    }, 3000);
                }
            }
        });
    });

    // 7. Interactive Treatment Pathway Switcher (Home Page 2)
    const pathwayTabs = document.querySelectorAll('#pathway-tabs .pathway-btn');
    const pathwayTitle = document.getElementById('pathway-title');
    const pathwayBadge = document.getElementById('pathway-badge');
    const pathwayDesc = document.getElementById('pathway-desc');
    const pathwayLink = document.getElementById('pathway-link');

    if (pathwayTabs.length && pathwayTitle && pathwayBadge && pathwayDesc && pathwayLink) {
        const pathwayData = {
            pain: {
                title: "Precision Electro-Acupuncture + Medical Cupping",
                badge: "92% Relief Rate",
                desc: "Targeted meridian decompression releases deep myofascial triggers, down-regulates inflammatory pain pathways, and restores joint mobility.",
                link: "contact.html?therapy=pain"
            },
            stress: {
                title: "Auriculotherapy + Shen-Calming Herbal Tinctures",
                badge: "Deep Rest & Cortisol Reset",
                desc: "Calms the autonomic nervous system, settles excessive stress responses, and gently restores sound, uninterrupted sleep architecture.",
                link: "contact.html?therapy=stress"
            },
            digestive: {
                title: "Spleen-Stomach Harmonization + Digestive Formulas",
                badge: "Microbiome & Bloat Relief",
                desc: "Strengthens metabolic Qi, relieves chronic bloating, acid reflux, and resolves gut dysbiosis through targeted botanical teas.",
                link: "contact.html?therapy=digestive"
            },
            hormones: {
                title: "Five-Element Endocrine Balance + Cycle Restoration",
                badge: "Natural Vitality & Fertility",
                desc: "Balances hormonal rhythms, alleviates cycle discomfort, supports fertility protocols, and eases peri-menopausal fluctuations.",
                link: "contact.html?therapy=hormones"
            }
        };

        pathwayTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const pathwayKey = tab.getAttribute('data-pathway');
                const data = pathwayData[pathwayKey];
                if (!data) return;

                pathwayTabs.forEach(t => {
                    t.classList.remove('active', 'bg-tcm-terracotta', 'text-white', 'shadow-sm');
                    t.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'border', 'border-gray-200', 'dark:border-gray-600');
                });

                tab.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'border', 'border-gray-200', 'dark:border-gray-600');
                tab.classList.add('active', 'bg-tcm-terracotta', 'text-white', 'shadow-sm');

                const contentBox = document.getElementById('pathway-content');
                if (contentBox) {
                    contentBox.classList.add('opacity-50');
                    setTimeout(() => {
                        pathwayTitle.textContent = data.title;
                        pathwayBadge.textContent = data.badge;
                        pathwayDesc.textContent = data.desc;
                        pathwayLink.href = data.link;
                        contentBox.classList.remove('opacity-50');
                    }, 120);
                }
            });
        });
    }
});
