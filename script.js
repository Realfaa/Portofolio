// Initialize page interactions after the deferred script has been parsed.
(() => {
  'use strict';

  document.documentElement.classList.add('has-js');

  /**
   * Initializes the accessible mobile navigation toggle and its keyboard behavior.
   */
  function initializeMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('#primary-navigation');
    const label = toggle?.querySelector('.visually-hidden');

    if (!toggle || !navigation || !label) {
      return;
    }

    navigation.dataset.menuState = 'closed';

    /**
     * Updates the mobile menu state and synchronizes its accessibility attributes.
     * @param {boolean} isOpen - Whether the navigation menu should be open.
     */
    function setMenuOpen(isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      label.textContent = isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi';
      navigation.dataset.menuState = isOpen ? 'open' : 'closed';
    }

    /**
     * Closes the menu when Escape is pressed and returns focus to its toggle.
     * @param {KeyboardEvent} event - The keyboard event to handle.
     */
    function handleMenuKeydown(event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    }

    // Toggle the menu when its button is activated.
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    // Close the menu after a visitor selects a navigation destination.
    navigation.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', handleMenuKeydown);
    // Close an open menu when the visitor clicks outside it.
    document.addEventListener('click', (event) => {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        event.target instanceof Node &&
        !toggle.contains(event.target) &&
        !navigation.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    // Reset the mobile menu state when switching to the desktop layout.
    window.matchMedia('(min-width: 40rem)').addEventListener('change', (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    });
  }

  /**
   * Adds smooth scrolling to same-page navigation links while respecting reduced motion.
   */
  function initializeSmoothScrolling() {
    const smoothLinks = document.querySelectorAll(
      '.site-navigation a[href^="#"], .hero-link[href^="#"]'
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Attach scrolling behavior to each eligible same-page link.
    smoothLinks.forEach((link) => {
      // Scroll to the link destination and update the browser's URL fragment.
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href')?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
          block: 'start'
        });
        window.history.pushState(null, '', `#${encodeURIComponent(targetId)}`);
      });
    });
  }

  /**
   * Reveals selected page sections as they enter the viewport, with a safe fallback.
   */
  function initializeScrollReveal() {
    const revealTargets = document.querySelectorAll(
      '.hero-content, .hero-figure, .about-content, .service-card, .project-card, .contact-section'
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      return;
    }

    // Reveal elements when they enter the viewport, then stop observing them.
    const observer = new IntersectionObserver((entries, activeObserver) => {
      // Process each visibility change reported by the observer.
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.revealed = 'true';
          activeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    // Prepare each target for its one-time reveal animation.
    revealTargets.forEach((target) => {
      target.dataset.reveal = '';
      observer.observe(target);
    });
  }

  initializeMobileMenu();
  initializeSmoothScrolling();
  initializeScrollReveal();
})();
