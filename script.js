// Apple iPhone Duo / Fold Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  initGlobalNav();
  initColorSwitcher();
  initCarousel();
  initScrollSpy();
  initFoldSlider();
  initMultitaskTabs();
  initCameraLensTabs();
  initBuyDrawer();
});

/* --- Global Navigation & Search / Bag Trays --- */
function initGlobalNav() {
  const searchBtn = document.getElementById('search-toggle-btn');
  const searchTray = document.getElementById('global-search-tray');
  const searchInput = document.getElementById('global-search-input');
  
  const bagBtn = document.getElementById('bag-toggle-btn');
  const bagTray = document.getElementById('bag-dropdown-tray');
  
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.querySelector('.global-nav-links-desktop');

  if (searchBtn && searchTray) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = searchTray.classList.toggle('open');
      if (bagTray) bagTray.classList.remove('open');
      if (isOpen && searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    });
  }

  if (bagBtn && bagTray) {
    bagBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bagTray.classList.toggle('open');
      if (searchTray) searchTray.classList.remove('open');
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Close overlays on outside click or Escape
  document.addEventListener('click', (e) => {
    if (searchTray && !searchTray.contains(e.target) && e.target !== searchBtn) {
      searchTray.classList.remove('open');
    }
    if (bagTray && !bagTray.contains(e.target) && e.target !== bagBtn) {
      bagTray.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchTray) searchTray.classList.remove('open');
      if (bagTray) bagTray.classList.remove('open');
    }
  });
}

/* --- Color Finish Switcher --- */
function initColorSwitcher() {
  const swatches = document.querySelectorAll('.swatch-btn');
  const finishLabel = document.getElementById('active-finish-name');
  const heroImg = document.getElementById('hero-product-img');

  const finishNames = {
    'natural': 'Natural Titanium',
    'white': 'White Titanium',
    'black': 'Black Titanium',
    'desert': 'Desert Titanium'
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const finishKey = swatch.dataset.finish;
      if (finishLabel && finishNames[finishKey]) {
        finishLabel.textContent = finishNames[finishKey];
      }

      // Smooth subtle visual feedback on hero image
      if (heroImg) {
        heroImg.style.opacity = '0.7';
        heroImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
}

/* --- Highlights Carousel --- */
function initCarousel() {
  const viewport = document.getElementById('carousel-viewport');
  const cards = document.querySelectorAll('.feature-media-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const playPauseBtn = document.getElementById('carousel-play-pause');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!viewport || cards.length === 0) return;

  let currentIndex = 0;
  let isPlaying = true;
  let autoplayTimer = null;

  function scrollToCard(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    const targetCard = cards[currentIndex];
    const leftOffset = targetCard.offsetLeft - viewport.offsetLeft - (viewport.clientWidth - targetCard.clientWidth) / 2;
    viewport.scrollTo({ left: leftOffset, behavior: 'smooth' });

    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      scrollToCard(currentIndex + 1);
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.dataset.index, 10);
      scrollToCard(targetIdx);
      if (isPlaying) startAutoplay();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToCard(currentIndex - 1);
      if (isPlaying) startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToCard(currentIndex + 1);
      if (isPlaying) startAutoplay();
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        startAutoplay();
        playPauseBtn.innerHTML = `<svg viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>`;
      } else {
        stopAutoplay();
        playPauseBtn.innerHTML = `<svg viewBox="0 0 16 16"><path d="M6 3.8a1 1 0 0 1 1.5-.86l5 3.2a1 1 0 0 1 0 1.72l-5 3.2A1 1 0 0 1 6 10.2V3.8z"/></svg>`;
      }
    });
  }

  // Update dots on manual user scroll
  viewport.addEventListener('scroll', () => {
    const scrollCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      if (Math.abs(scrollCenter - cardCenter) < card.clientWidth / 2) {
        if (currentIndex !== idx) {
          currentIndex = idx;
          updateDots();
        }
      }
    });
  }, { passive: true });

  startAutoplay();
}

/* --- Scroll Spy for Sticky Navigation --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const localNavLinks = document.querySelectorAll('.product-nav-anchors a');
  const anchorBarLinks = document.querySelectorAll('.anchor-list a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    localNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    anchorBarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });
}

/* --- Interactive Fold Slider Widget --- */
function initFoldSlider() {
  const slider = document.getElementById('fold-angle-slider');
  const angleDisplay = document.getElementById('fold-angle-value');
  const modeDisplay = document.getElementById('fold-mode-value');
  const foldVisual = document.getElementById('fold-animated-render');

  if (!slider) return;

  const modes = [
    { max: 20, name: 'Pocket Fold (6.3" Cover Display)', transform: 'rotateY(60deg) scale(0.92)' },
    { max: 100, name: 'Flex Mode (Desk Stand & Dual Cam)', transform: 'rotateY(35deg) scale(0.95)' },
    { max: 155, name: 'Studio Angle (Ergonomic Reading)', transform: 'rotateY(15deg) scale(0.98)' },
    { max: 180, name: 'Full Canvas (7.9" Super Retina XDR)', transform: 'rotateY(0deg) scale(1)' }
  ];

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    if (angleDisplay) angleDisplay.textContent = `${val}°`;

    const currentMode = modes.find(m => val <= m.max) || modes[modes.length - 1];
    if (modeDisplay) modeDisplay.textContent = currentMode.name;

    if (foldVisual) {
      foldVisual.style.transform = currentMode.transform;
    }
  });
}

/* --- Multitasking Tabs Widget --- */
function initMultitaskTabs() {
  const tabBtns = document.querySelectorAll('.multitask-tab-btn');
  const multitaskDesc = document.getElementById('multitask-description');

  const descriptions = {
    'creative': 'Run Final Cut Pro on the top half while monitoring color grades and notes on the lower canvas with zero lag.',
    'productivity': 'Side-by-side Safari and Mail with drag-and-drop file attachments and split clipboard support.',
    'intelligence': 'Apple Intelligence Writing Tools with live rewrite suggestions and Image Playground generation.'
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      if (multitaskDesc && descriptions[mode]) {
        multitaskDesc.textContent = descriptions[mode];
      }
    });
  });
}

/* --- Camera Focal Length Tabs --- */
function initCameraLensTabs() {
  const lensPills = document.querySelectorAll('.lens-tab-pill');
  const lensDesc = document.getElementById('camera-lens-desc');

  const lensData = {
    '0.5x': '13mm Ultra Wide: 48MP sensor with autofocus for extreme macro photography up to 2cm and panoramic vistas.',
    '1x': '24mm Fusion: 48MP quad-pixel sensor with f/1.78 aperture and second-generation sensor-shift optical image stabilization.',
    '5x': '120mm Telephoto: Folded tetraprism design delivering 5x optical zoom and 25x digital zoom in an ultra-slim chassis.'
  };

  lensPills.forEach(pill => {
    pill.addEventListener('click', () => {
      lensPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const focal = pill.dataset.focal;
      if (lensDesc && lensData[focal]) {
        lensDesc.textContent = lensData[focal];
      }
    });
  });
}

/* --- Pre-Order / Buy Drawer --- */
function initBuyDrawer() {
  const buyBtns = document.querySelectorAll('.trigger-buy-drawer');
  const overlay = document.getElementById('buy-modal-overlay');
  const closeBtn = document.getElementById('drawer-close-btn');
  const finishCards = document.querySelectorAll('.drawer-finish-card');
  const storageCards = document.querySelectorAll('.drawer-storage-card');
  const tradeCards = document.querySelectorAll('.drawer-trade-card');
  const priceDisplay = document.getElementById('drawer-total-price');
  const monthlyDisplay = document.getElementById('drawer-monthly-price');
  const addToBagBtn = document.getElementById('add-to-bag-btn');
  const bagBadge = document.getElementById('global-bag-badge');
  const bagItemCount = document.getElementById('bag-item-count');
  const bagPreviewList = document.getElementById('bag-preview-list');

  let selectedFinish = 'Natural Titanium';
  let basePrice = 1399;
  let tradeInDiscount = 0;
  let cartCount = 0;

  function updatePrice() {
    const finalPrice = basePrice - tradeInDiscount;
    const monthly = (finalPrice / 24).toFixed(2);
    if (priceDisplay) priceDisplay.textContent = `$${finalPrice.toLocaleString()}`;
    if (monthlyDisplay) monthlyDisplay.textContent = `or $${monthly}/mo. for 24 mo.*`;
  }

  buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  finishCards.forEach(card => {
    card.addEventListener('click', () => {
      finishCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedFinish = card.dataset.finish;
    });
  });

  storageCards.forEach(card => {
    card.addEventListener('click', () => {
      storageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      basePrice = parseInt(card.dataset.price, 10);
      updatePrice();
    });
  });

  tradeCards.forEach(card => {
    card.addEventListener('click', () => {
      tradeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      tradeInDiscount = parseInt(card.dataset.discount, 10);
      updatePrice();
    });
  });

  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      cartCount++;
      if (bagBadge) {
        bagBadge.textContent = cartCount;
        bagBadge.classList.add('active');
      }
      if (bagItemCount) {
        bagItemCount.textContent = `(${cartCount})`;
      }
      if (bagPreviewList) {
        bagPreviewList.innerHTML = `
          <div class="bag-item-preview">
            <img src="assets/hero_iphone_fold.jpg" alt="iPhone Duo" class="bag-item-img">
            <div class="bag-item-info">
              <h4>iPhone Duo</h4>
              <p>${selectedFinish} · ${basePrice === 1399 ? '256GB' : basePrice === 1599 ? '512GB' : '1TB'}</p>
              <p><strong>$${(basePrice - tradeInDiscount).toLocaleString()}</strong></p>
            </div>
          </div>
        `;
      }

      addToBagBtn.textContent = '✓ Added to Bag';
      addToBagBtn.style.backgroundColor = '#1d1d1f';

      setTimeout(() => {
        addToBagBtn.textContent = 'Add to Bag';
        addToBagBtn.style.backgroundColor = 'var(--color-pricing-blue)';
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }, 1000);
    });
  }
}
