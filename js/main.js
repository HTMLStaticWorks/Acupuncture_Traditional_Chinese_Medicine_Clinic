document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    });

    // 2. RTL Toggle
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle');
    
    // Check saved direction
    const savedDir = localStorage.getItem('dir') || 'ltr';
    htmlElement.setAttribute('dir', savedDir);

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Toggle hamburger to close icon logic can go here
        });

        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
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

    // 6. Form Validation (Generic simple logic for pages with forms)
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
                    // Add error message logic
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                // Mock submit success
                const btn = form.querySelector('button[type="submit"]');
                const origText = btn.innerHTML;
                btn.innerHTML = 'Success!';
                btn.classList.add('bg-green-600');
                setTimeout(() => {
                    btn.innerHTML = origText;
                    btn.classList.remove('bg-green-600');
                    form.reset();
                }, 3000);
            }
        });
    });
});
