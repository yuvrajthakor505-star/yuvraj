/**
 * LUXE BEAUTY SALON - Vanilla JavaScript Master Script
 * Handles scrolling animations, interactive filters, sliders, preloader, lightbox, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER HIDE
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    });
    // Fallback if load already fired
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1500);
  }

  // 2. SCROLL PROGRESS BAR & STICKY NAVBAR & SCROLL-TO-TOP
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('header');
  const scrollTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollTop > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  const toggleMobileMenu = () => {
    if (mobileMenu && mobileMenuOverlay) {
      const isOpen = !mobileMenu.classList.contains('translate-x-full');
      if (isOpen) {
        mobileMenu.classList.add('translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking nav links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
        toggleMobileMenu();
      }
    });
  });

  // 4. ACTIVE NAVIGATION LINK SPY
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    threshold: 0.3
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // 5. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, optional keep or unobserve
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. ANIMATED STATS COUNTER
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  const startCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const prefix = stat.getAttribute('data-prefix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeProgress * target);

        stat.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          startCounters();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 7. BEFORE & AFTER TRANSFORM SLIDER
  const baContainer = document.getElementById('ba-slider-container');
  const baAfterWrap = document.getElementById('ba-after-wrap');
  const baHandle = document.getElementById('ba-handle');

  if (baContainer && baAfterWrap && baHandle) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percentage = (x / rect.width) * 100;
      baAfterWrap.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    const onStart = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };

    const onEnd = () => {
      isDragging = false;
    };

    baContainer.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    baContainer.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  // 8. FILTER TABS SYSTEM (Generic handler)
  const setupFilterGroup = (buttonClass, itemClass, dataAttribute) => {
    const buttons = document.querySelectorAll(buttonClass);
    const items = document.querySelectorAll(itemClass);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('bg-rosegold-gradient', 'text-black', 'active');
          b.classList.add('bg-zinc-800/80', 'text-gray-300');
        });

        btn.classList.remove('bg-zinc-800/80', 'text-gray-300');
        btn.classList.add('bg-rosegold-gradient', 'text-black', 'active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const itemVal = item.getAttribute(dataAttribute);
          if (filterValue === 'all' || itemVal === filterValue) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  };

  setupFilterGroup('.service-filter-btn', '.service-card', 'data-category');
  setupFilterGroup('.hair-color-filter-btn', '.hair-color-card', 'data-category');
  setupFilterGroup('.hair-style-filter-btn', '.hair-style-card', 'data-category');
  setupFilterGroup('.pricing-filter-btn', '.pricing-card', 'data-category');
  setupFilterGroup('.gallery-filter-btn', '.gallery-item-wrap', 'data-category');

  // 9. REVIEWS / TESTIMONIALS SLIDER
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewDots = document.querySelectorAll('.review-dot');
  const prevReviewBtn = document.getElementById('prev-review');
  const nextReviewBtn = document.getElementById('next-review');
  let currentReviewIndex = 0;
  let reviewAutoInterval;

  const showReviewSlide = (index) => {
    if (reviewSlides.length === 0) return;
    if (index >= reviewSlides.length) currentReviewIndex = 0;
    else if (index < 0) currentReviewIndex = reviewSlides.length - 1;
    else currentReviewIndex = index;

    reviewSlides.forEach((slide, i) => {
      if (i === currentReviewIndex) {
        slide.classList.remove('hidden', 'opacity-0');
        slide.classList.add('block', 'opacity-100');
      } else {
        slide.classList.remove('block', 'opacity-100');
        slide.classList.add('hidden', 'opacity-0');
      }
    });

    reviewDots.forEach((dot, i) => {
      if (i === currentReviewIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextReview = () => showReviewSlide(currentReviewIndex + 1);
  const prevReview = () => showReviewSlide(currentReviewIndex - 1);

  if (nextReviewBtn) nextReviewBtn.addEventListener('click', () => { nextReview(); resetReviewTimer(); });
  if (prevReviewBtn) prevReviewBtn.addEventListener('click', () => { prevReview(); resetReviewTimer(); });

  reviewDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showReviewSlide(i);
      resetReviewTimer();
    });
  });

  const startReviewTimer = () => {
    reviewAutoInterval = setInterval(nextReview, 5000);
  };

  const resetReviewTimer = () => {
    clearInterval(reviewAutoInterval);
    startReviewTimer();
  };

  if (reviewSlides.length > 0) {
    showReviewSlide(0);
    startReviewTimer();
  }

  // 10. LIGHTBOX MODAL FOR GALLERY
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || img?.alt || 'Luxe Beauty Salon';
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 11. MOUSE CURSOR GLOW (Desktop)
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.innerWidth >= 1024) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 12. RIPPLE EFFECT ON BUTTONS
  const luxuryButtons = document.querySelectorAll('.btn-luxury, .btn-luxury-outline');
  luxuryButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
    });
  });

  // 13. INITIALIZE LUCIDE ICONS
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
