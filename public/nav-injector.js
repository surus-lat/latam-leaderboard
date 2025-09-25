/**
 * Navigation Injector for Self-Contained HTML
 * Injects a navigation bar that matches the main React app design
 */
(function() {
    'use strict';

    // Navigation configuration
    const NAV_CONFIG = {
        brand: {
            text: 'LatamBoard',
            href: '/'
        },
        items: [
            { href: '/', label: 'Home' },
            { href: '/tests', label: 'Tasks' },
            { href: '/about.html', label: 'About', active: true },
            { href: '/contribute', label: 'Contribute' }
        ],
        languages: [
            { code: 'en', label: 'EN', active: true },
            { code: 'es', label: 'ES' },
            { code: 'pt', label: 'PT' }
        ]
    };

    // CSS Styles matching the React app design
    const CSS_STYLES = `
        <style id="nav-injector-styles">
            /* Reset and base styles for injected nav */
            .injected-nav * {
                box-sizing: border-box;
            }

            .injected-nav {
                position: sticky;
                top: 0;
                z-index: 50;
                width: 100%;
                border-bottom: 1px solid hsl(0 0% 90%);
                background: hsla(0 0% 99% / 0.9);
                backdrop-filter: blur(8px);
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .injected-nav-container {
                max-width: 1280px;
                margin: 0 auto;
                padding: 0 1rem;
                display: flex;
                height: 4rem;
                align-items: center;
                justify-content: space-between;
            }

            .injected-nav-brand {
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                font-size: 1.125rem;
                font-weight: 500;
                letter-spacing: -0.025em;
                color: hsl(0 0% 8%);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .injected-nav-brand:hover {
                color: hsl(220 15% 75%);
            }

            .injected-nav-links {
                display: none;
                align-items: center;
                gap: 2rem;
            }

            .injected-nav-link {
                font-size: 0.875rem;
                color: hsl(0 0% 45%);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .injected-nav-link:hover,
            .injected-nav-link.active {
                color: hsl(0 0% 8%);
            }

            .injected-nav-divider {
                margin-left: 1rem;
                padding-left: 1rem;
                border-left: 1px solid hsl(0 0% 90%);
            }

            .injected-nav-lang-switcher {
                display: flex;
                gap: 0.5rem;
            }

            .injected-nav-lang {
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
                color: hsl(0 0% 45%);
                text-decoration: none;
                border-radius: 0.25rem;
                transition: all 0.2s ease;
            }

            .injected-nav-lang:hover,
            .injected-nav-lang.active {
                background: hsl(0 0% 96%);
                color: hsl(0 0% 8%);
            }

            .injected-nav-mobile-toggle {
                display: block;
                padding: 0.5rem;
                color: hsl(0 0% 45%);
                background: none;
                border: none;
                cursor: pointer;
                transition: color 0.2s ease;
            }

            .injected-nav-mobile-toggle:hover {
                color: hsl(0 0% 8%);
            }

            .injected-nav-mobile-menu {
                display: none;
                border-top: 1px solid hsl(0 0% 90%);
                background: hsl(0 0% 99%);
                padding: 1rem 0;
            }

            .injected-nav-mobile-menu.open {
                display: block;
            }

            .injected-nav-mobile-links {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .injected-nav-mobile-link {
                display: block;
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                color: hsl(0 0% 45%);
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .injected-nav-mobile-link:hover,
            .injected-nav-mobile-link.active {
                color: hsl(0 0% 8%);
            }

            .injected-nav-mobile-langs {
                padding: 0 1rem;
                display: flex;
                gap: 0.5rem;
            }

            /* Desktop styles */
            @media (min-width: 768px) {
                .injected-nav-links {
                    display: flex;
                }

                .injected-nav-mobile-toggle {
                    display: none;
                }
            }
        </style>
    `;

    // Create navigation HTML
    function createNavigationHTML() {
        const navLinks = NAV_CONFIG.items
            .map(item => `
                <a href="${item.href}" class="injected-nav-link ${item.active ? 'active' : ''}">
                    ${item.label}
                </a>
            `).join('');

        const langSwitcher = NAV_CONFIG.languages
            .map(lang => `
                <a href="#" class="injected-nav-lang ${lang.active ? 'active' : ''}" data-lang="${lang.code}">
                    ${lang.label}
                </a>
            `).join('');

        const mobileLinks = NAV_CONFIG.items
            .map(item => `
                <a href="${item.href}" class="injected-nav-mobile-link ${item.active ? 'active' : ''}">
                    ${item.label}
                </a>
            `).join('');

        const mobileLangs = NAV_CONFIG.languages
            .map(lang => `
                <a href="#" class="injected-nav-lang ${lang.active ? 'active' : ''}" data-lang="${lang.code}">
                    ${lang.label}
                </a>
            `).join('');

        return `
            <header class="injected-nav">
                <div class="injected-nav-container">
                    <a href="${NAV_CONFIG.brand.href}" class="injected-nav-brand">
                        ${NAV_CONFIG.brand.text}
                    </a>

                    <nav class="injected-nav-links">
                        ${navLinks}
                        <div class="injected-nav-divider">
                            <div class="injected-nav-lang-switcher">
                                ${langSwitcher}
                            </div>
                        </div>
                    </nav>

                    <button class="injected-nav-mobile-toggle" aria-label="Toggle menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="4" x2="20" y1="12" y2="12"/>
                            <line x1="4" x2="20" y1="6" y2="6"/>
                            <line x1="4" x2="20" y1="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div class="injected-nav-mobile-menu">
                    <div class="injected-nav-container">
                        <div class="injected-nav-mobile-links">
                            ${mobileLinks}
                        </div>
                        <div class="injected-nav-mobile-langs">
                            ${mobileLangs}
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    // Inject navigation into page
    function injectNavigation() {
        // Add CSS styles
        document.head.insertAdjacentHTML('beforeend', CSS_STYLES);

        // Create navigation element
        const nav = document.createElement('div');
        nav.innerHTML = createNavigationHTML();

        // Insert at top of body
        document.body.insertBefore(nav.firstElementChild, document.body.firstChild);

        // Add mobile menu toggle functionality
        const mobileToggle = document.querySelector('.injected-nav-mobile-toggle');
        const mobileMenu = document.querySelector('.injected-nav-mobile-menu');

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('open');

                // Update icon
                const svg = mobileToggle.querySelector('svg');
                if (mobileMenu.classList.contains('open')) {
                    svg.innerHTML = `
                        <line x1="18" x2="6" y1="6" y2="18"/>
                        <line x1="6" x2="18" y1="6" y2="18"/>
                    `;
                } else {
                    svg.innerHTML = `
                        <line x1="4" x2="20" y1="12" y2="12"/>
                        <line x1="4" x2="20" y1="6" y2="6"/>
                        <line x1="4" x2="20" y1="18" y2="18"/>
                    `;
                }
            });
        }

        // Close mobile menu when clicking links
        document.querySelectorAll('.injected-nav-mobile-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });

        // Handle language switcher (placeholder functionality)
        document.querySelectorAll('.injected-nav-lang').forEach(lang => {
            lang.addEventListener('click', function(e) {
                e.preventDefault();
                const langCode = this.dataset.lang;
                console.log('Language switch requested:', langCode);
                // Note: Actual language switching would need to be implemented
                // based on your app's i18n system
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavigation);
    } else {
        injectNavigation();
    }

})();