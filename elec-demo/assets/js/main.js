/**
 * ============================================================================
 * MAIN APPLICATION SCRIPT
 * ============================================================================
 * Handles:
 * - Dynamic config hydration from CONFIG object
 * - Mobile menu toggle & focus trapping
 * - Smooth navigation & active scroll spy
 * - Service card "Request Service" auto-fill
 * - Project portfolio category filtering
 * - WhatsApp quotation & booking message generators
 * - Accessible FAQ accordion enhancements
 * - Credential verification modal
 * ============================================================================
 */

(function () {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    hydrateConfig();
    initMobileNav();
    initScrollSpy();
    initServiceSelection();
    initProjectFiltering();
    initQuoteForm();
    initBookingForm();
    initCredentialsModal();
    initFaqAccordion();
    initFloatingActions();
  }

  /**
   * 1. HYDRATE CONFIGURATION
   * Injects CONFIG variables into all matching elements across the DOM
   */
  function hydrateConfig() {
    if (typeof window.CONFIG === 'undefined') {
      console.warn('CONFIG object not found in window.');
      return;
    }

    const cfg = window.CONFIG;

    // Update text placeholders
    document.querySelectorAll('[data-config]').forEach(el => {
      const key = el.getAttribute('data-config');
      if (cfg[key]) {
        el.textContent = cfg[key];
      }
    });

    // Update Company Name
    document.querySelectorAll('.cfg-company').forEach(el => {
      el.textContent = cfg.company || 'Electrical Engineering & Services';
    });

    // Update Phone Display & Links
    document.querySelectorAll('.cfg-phone-text').forEach(el => {
      el.textContent = cfg.phoneDisplay;
    });
    document.querySelectorAll('.cfg-phone-link').forEach(el => {
      el.href = `tel:${cfg.phoneHref}`;
      el.setAttribute('aria-label', `Call ${cfg.phoneDisplay}`);
    });

    // Update WhatsApp Links
    document.querySelectorAll('.cfg-wa-link').forEach(el => {
      el.href = `https://wa.me/${cfg.whatsapp}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.setAttribute('aria-label', 'Contact us on WhatsApp');
    });

    // Update Email Links
    document.querySelectorAll('.cfg-email-text').forEach(el => {
      el.textContent = cfg.email;
    });
    document.querySelectorAll('.cfg-email-link').forEach(el => {
      el.href = `mailto:${cfg.email}`;
      el.setAttribute('aria-label', `Send email to ${cfg.email}`);
    });

    // Update Address & Service Area
    document.querySelectorAll('.cfg-address').forEach(el => {
      el.textContent = cfg.address;
    });
    document.querySelectorAll('.cfg-service-area').forEach(el => {
      el.textContent = cfg.serviceArea;
    });
    document.querySelectorAll('.cfg-hours').forEach(el => {
      el.textContent = cfg.businessHours;
    });

    // Copyright Year
    document.querySelectorAll('.cfg-year').forEach(el => {
      el.textContent = new Date().getFullYear().toString();
    });

    // Social Links
    const socialPlatforms = ['instagram', 'facebook', 'linkedin', 'youtube'];
    socialPlatforms.forEach(platform => {
      const el = document.getElementById(`social-${platform}`);
      if (el) {
        if (cfg[platform] && cfg[platform].trim() !== '') {
          el.href = cfg[platform];
          el.style.display = 'inline-flex';
        } else {
          el.style.display = 'none';
        }
      }
    });

    // Inject LocalBusiness Schema.org JSON-LD dynamically
    injectSchema(cfg);
  }

  function injectSchema(cfg) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Electrician",
      "name": cfg.company,
      "description": "Professional electrical engineering, residential, commercial and industrial services. Certified by MSME & SGSU.",
      "telephone": cfg.phoneHref,
      "email": cfg.email,
      "url": cfg.website || window.location.href,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": cfg.address,
        "addressLocality": cfg.serviceArea,
        "addressCountry": "IN"
      },
      "areaServed": cfg.serviceArea,
      "priceRange": "$$",
      "openingHours": "Mo-Sa 08:00-20:00",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Electrical Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Repairs" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Whole House Wiring" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Electrical Fit-Out" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Warehouse Electrical Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV & Data Surveillance" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Earthing & Lightning Protection" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Annual Maintenance Contracts (AMC)" } }
        ]
      }
    };

    let script = document.getElementById('schema-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
  }

  /**
   * 2. MOBILE NAVIGATION
   */
  function initMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    if (!toggleBtn || !navMenu) return;

    function openNav() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.classList.add('nav-locked');
    }

    function closeNav() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.classList.remove('nav-locked');
    }

    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav();
      else openNav();
    });

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close mobile menu on anchor click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          closeNav();
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNav();
        toggleBtn.focus();
      }
    });
  }

  /**
   * 3. SCROLL SPY & HEADER SHADOW
   */
  function initScrollSpy() {
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function onScroll() {
      // Header shadow on scroll
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      // Active Section Spy
      let scrollPos = window.scrollY + 140;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * 4. SERVICE CARD PRE-SELECTION
   */
  function initServiceSelection() {
    document.querySelectorAll('[data-select-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serviceName = btn.getAttribute('data-select-service');
        const quoteSelect = document.getElementById('quote-service');
        if (quoteSelect && serviceName) {
          // Match by value or text
          for (let i = 0; i < quoteSelect.options.length; i++) {
            if (quoteSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
                quoteSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
              quoteSelect.selectedIndex = i;
              break;
            }
          }
        }
      });
    });
  }

  /**
   * 5. PROJECT PORTFOLIO FILTERING
   */
  function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.96)';
            setTimeout(() => {
              card.classList.add('is-hidden');
            }, 250);
          }
        });
      });
    });
  }

  /**
   * 6. QUOTE FORM (WhatsApp Message Generator)
   */
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const property = form.querySelector('[name="property"]')?.value;
      const service = form.querySelector('[name="service"]')?.value;
      const area = form.querySelector('[name="area"]')?.value.trim() || 'Not specified';
      const location = form.querySelector('[name="location"]')?.value.trim();
      const details = form.querySelector('[name="details"]')?.value.trim() || 'No specific details provided';

      if (!name || !phone || !location) {
        alert('Please fill in your Name, Phone Number, and Location.');
        return;
      }

      const company = window.CONFIG?.company || 'Electrical Services';
      const waNumber = window.CONFIG?.whatsapp || '';

      const message = `Hello ${company},\n\nI would like to request an electrical quotation.\n\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Property: ${property}\n` +
        `• Service: ${service}\n` +
        `• Area / Size: ${area}\n` +
        `• Location: ${location}\n` +
        `• Details: ${details}\n\n` +
        `Sent from website quotation form.`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Show confirmation in page
      showFeedbackModal({
        title: 'Quotation Request Prepared',
        message: 'Your request has been prepared and opened in WhatsApp. If it did not open automatically, you can click below or copy the message.',
        actionUrl: waUrl,
        actionText: 'Open WhatsApp Again',
        copyText: message
      });
    });
  }

  /**
   * 7. BOOK A SERVICE FORM (WhatsApp Message Generator)
   */
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const service = form.querySelector('[name="service"]')?.value;
      const urgency = form.querySelector('[name="urgency"]')?.value;
      const prefDate = form.querySelector('[name="date"]')?.value || 'Earliest available';
      const prefTime = form.querySelector('[name="time"]')?.value || 'Flexible';
      const address = form.querySelector('[name="address"]')?.value.trim();
      const problem = form.querySelector('[name="problem"]')?.value.trim();

      if (!name || !phone || !address || !problem) {
        alert('Please fill in Name, Phone Number, Address, and Problem Description.');
        return;
      }

      const company = window.CONFIG?.company || 'Electrical Services';
      const waNumber = window.CONFIG?.whatsapp || '';

      const message = `Hello ${company},\n\nI would like to book an electrical service.\n\n` +
        `• Urgency: ${urgency}\n` +
        `• Service: ${service}\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Preferred Date: ${prefDate}\n` +
        `• Preferred Time: ${prefTime}\n` +
        `• Service Address: ${address}\n` +
        `• Problem Description: ${problem}\n\n` +
        `*Note: I can send photos/videos of the issue directly in this chat.*\n\n` +
        `Sent from website booking form.`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      window.open(waUrl, '_blank');

      showFeedbackModal({
        title: 'Service Booking Request Prepared',
        message: 'Your service request has been prepared and opened in WhatsApp. You can also attach photos or videos of the electrical issue directly in the chat.',
        actionUrl: waUrl,
        actionText: 'Open WhatsApp Chat',
        copyText: message
      });
    });
  }

  /**
   * 8. CREDENTIALS MODAL
   */
  function initCredentialsModal() {
    const viewBtns = document.querySelectorAll('.btn-view-credentials');
    const modal = document.getElementById('credentials-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-backdrop');

    function openModal() {
      modal.classList.add('is-active');
      document.body.classList.add('modal-locked');
    }

    function closeModal() {
      modal.classList.remove('is-active');
      document.body.classList.remove('modal-locked');
    }

    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  /**
   * 9. ACCESSIBLE FAQ ACCORDION
   */
  function initFaqAccordion() {
    const detailsList = document.querySelectorAll('.faq-item');

    detailsList.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;

      // Ensure proper accessible roles and smooth keyboard accessibility
      summary.addEventListener('click', () => {
        // Exclusive accordion behavior for browsers that don't yet support name="faq-group"
        if (!item.hasAttribute('open')) {
          detailsList.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              otherItem.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  /**
   * 10. FLOATING QUICK ACTION BUTTONS
   */
  function initFloatingActions() {
    const floatingWrap = document.querySelector('.floating-contact-bar');
    if (!floatingWrap) return;

    // Show floating bar after scrolling 150px
    function toggleFloating() {
      if (window.scrollY > 150) {
        floatingWrap.classList.add('is-visible');
      } else {
        floatingWrap.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggleFloating, { passive: true });
    toggleFloating();
  }

  /**
   * FEEDBACK / SUCCESS MODAL HELPER
   */
  function showFeedbackModal({ title, message, actionUrl, actionText, copyText }) {
    let modal = document.getElementById('form-feedback-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'form-feedback-modal';
      modal.className = 'custom-modal';
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title"></h3>
            <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="modal-body">
            <p class="modal-msg"></p>
            <div class="modal-actions">
              <a class="btn btn-secondary modal-action-btn" target="_blank" rel="noopener noreferrer"></a>
              <button type="button" class="btn btn-outline modal-copy-btn">📋 Copy Message</button>
            </div>
            <div class="copy-status" style="display:none; margin-top: 10px; font-size: 0.85rem; color: #22C55E;">✓ Message copied to clipboard!</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('is-active');
      });
      modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.classList.remove('is-active');
      });
    }

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-msg').textContent = message;

    const actionBtn = modal.querySelector('.modal-action-btn');
    actionBtn.href = actionUrl;
    actionBtn.textContent = actionText;

    const copyBtn = modal.querySelector('.modal-copy-btn');
    const copyStatus = modal.querySelector('.copy-status');
    copyStatus.style.display = 'none';

    copyBtn.onclick = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText).then(() => {
          copyStatus.style.display = 'block';
        });
      } else {
        alert('Could not auto-copy. Please send directly via WhatsApp.');
      }
    };

    modal.classList.add('is-active');
  }

})();
