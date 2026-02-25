/* ============================================================
   BOX MACHINE — MAIN.JS
   Interatividade: Navbar, Animações, Contadores, FAQ,
   Formulários, Parallax, Scroll Progress
   ============================================================ */

'use strict';

/* ===== NAVBAR — scroll + hambúrguer ===== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navbar) return;

  // Adiciona classe .scrolled quando rolar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Esconde navbar ao rolar para baixo (igual Nike)
    if (current > lastScroll && current > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = current <= 0 ? 0 : current;
  }, { passive: true });

  // Hambúrguer
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha ao clicar em link do menu mobile
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Marca link ativo baseado na página atual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbar.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
})();


/* ===== SCROLL REVEAL — entradas ao scrollar ===== */
(function initScrollReveal() {
  const selectors = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ===== CONTADORES ANIMADOS ===== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + current.toFixed(decimals) + suffix;
    }, step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ===== FAQ ACCORDION ===== */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Fecha todos
      items.forEach(i => {
        i.classList.remove('active');
        const body = i.querySelector('.accordion-body');
        if (body) body.style.maxHeight = null;
      });

      // Abre o clicado se estava fechado
      if (!isOpen) {
        item.classList.add('active');
        const body = item.querySelector('.accordion-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
})();


/* ===== TABS (filtros de categoria) ===== */
(function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tabs]');
  if (!tabGroups.length) return;

  tabGroups.forEach(group => {
    const tabs    = group.querySelectorAll('[data-tab]');
    const panels  = group.querySelectorAll('[data-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => {
          p.style.display = p.dataset.panel === target ? '' : 'none';
        });

        tab.classList.add('active');
      });
    });

    // Ativa o primeiro por padrão
    if (tabs.length) tabs[0].click();
  });
})();


/* ===== FILTRO DE CARDS (FAQ, Soluções, etc.) ===== */
(function initFilter() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filterBtn;
      const targetList  = btn.closest('[data-filter-group]');
      if (!targetList) return;

      const items = targetList.querySelectorAll('[data-filter-item]');

      // Atualiza botões
      targetList.querySelectorAll('[data-filter-btn]').forEach(b => {
        b.classList.toggle('active', b === btn);
      });

      // Mostra/esconde itens
      items.forEach(item => {
        const categories = item.dataset.filterItem.split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = '';
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });
    });
  });
})();


/* ===== SCROLL PROGRESS BAR ===== */
(function initProgressBar() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total    = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
})();


/* ===== PARALLAX LEVE (hero image) ===== */
(function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // Só desktop para não afetar performance mobile
  if (window.innerWidth < 1024) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
})();


/* ===== SMOOTH SCROLL para âncoras ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ===== FORMULÁRIO — validação genérica ===== */
(function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  if (!forms.length) return;

  forms.forEach(form => {
    const inputs = form.querySelectorAll('[required]');

    // Validação em tempo real
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) return;

      // Simula envio
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Enviando...';

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;

          // Dispara evento de sucesso customizável por página
          form.dispatchEvent(new CustomEvent('formSuccess'));
        }, 1500);
      }
    });
  });

  function validateField(input) {
    const errorEl = document.getElementById('err-' + input.id);
    let valid = true;

    if (input.type === 'checkbox') {
      valid = input.checked;
    } else if (input.type === 'email') {
      valid = /
^
[^\s@]+@[^\s@]+\.[^\s@]+
$
/.test(input.value.trim());
    } else if (input.type === 'tel') {
      valid = input.value.trim().length >= 8;
    } else {
      valid = input.value.trim().length > 0;
    }

    input.classList.toggle('error', !valid);
    if (errorEl) errorEl.style.display = valid ? 'none' : 'block';

    return valid;
  }
})();


/* ===== TOAST — notificação flutuante ===== */
window.showToast = function(message, type = 'success', duration = 4000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
};


/* ===== MODAL — abertura e fechamento ===== */
(function initModals() {
  // Abre modal
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalOpen);
      if (!modal) return;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Fecha modal
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Fecha clicando fora
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Fecha com ESC
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.modal-overlay.active');
    if (!open) return;
    open.classList.remove('active');
    document.body.style.overflow = '';
  });
})();


/* ===== LAZY LOAD DE IMAGENS ===== */
(function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
      observer.unobserve(img);
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
})();


/* ===== MÁSCARA DE TELEFONE ===== */
(function initPhoneMask() {
  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], input[name="telefone"], input[id*="tel"]'
  );

  phoneInputs.forEach(input => {
    input.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length <= 10) {
        value = value
          .replace(/
^
(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value
          .replace(/
^
(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }

      e.target.value = value.slice(0, 15);
    });
  });
})();


/* ===== MÁSCARA DE CPF/CNPJ ===== */
(function initDocMask() {
  const docInputs = document.querySelectorAll(
    'input[id*="cpf"], input[id*="cnpj"], input[name*="cpf"], input[name*="cnpj"]'
  );

  docInputs.forEach(input => {
    input.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length <= 11) {
        // CPF
        value = value
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})
$
/, '$1-$2');
      } else {
        // CNPJ
        value = value
          .replace(/
^
(\d{2})(\d)/, '$1.$2')
          .replace(/
^
(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }

      e.target.value = value.slice(0, 18);
    });
  });
})();


/* ===== COPY TO CLIPBOARD ===== */
(function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => (btn.textContent = original), 2000);
      });
    });
  });
})();


/* ===== HEADER HERO — digitação animada ===== */
(function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const words   = JSON.parse(el.dataset.typewriter);
  const speed   = 90;
  const pause   = 1800;
  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;

  function type() {
    const current = words[wordIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting  = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? speed / 2 : speed);
  }

  type();
})();


/* ===== MAPA — inicialização (leaflet) ===== */
// O mapa é inicializado em map.js separadamente
// Este bloco apenas garante que o container existe
(function checkMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    console.warn('Box Machine: Leaflet não carregado. Verifique o link do CDN no HTML.');
  }
})();


/* ===== COOKIE BANNER ===== */
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (localStorage.getItem('bm_cookies_accepted')) {
    banner.remove();
    return;
  }

  banner.style.display = 'flex';

  const acceptBtn = document.getElementById('cookieAccept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('bm_cookies_accepted', '1');
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 400);
    });
  }
})();


/* ===== UTILITÁRIOS GLOBAIS ===== */
window.BM = {

  // Debounce
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Formata número para BRL
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  // Formata número com separador de milhar
  formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

};


/* ===== LOG DE VERSÃO ===== */
console.log(
  '%c Box Machine %c v1.0.0 ',
  'background:#1B4FA8; color:#fff; padding:4px 8px; border-radius:4px 0 0 4px; font-weight:bold;',
  'background:#2563EB; color:#fff; padding:4px 8px; border-radius:0 4px 4px 0;'
);
