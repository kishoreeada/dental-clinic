(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = $('.menu-toggle');
  const mobileMenu = $('#mobileMenu');
  const sidebar = $('.db-sidebar');
  const overlay = $('.drawer-overlay');
  function sizeMobileMenu() {
    if (mobileMenu) {
      const bottom = $('.site-header').getBoundingClientRect().bottom;
      mobileMenu.style.setProperty('--mobile-menu-height', `${Math.max(0, (window.visualViewport?.height || innerHeight) - bottom)}px`);
    }
  }
  function toggleMenu(open, returnFocus = true) {
    const nav = mobileMenu || sidebar;
    nav?.classList.toggle('open', open);
    overlay?.classList.toggle('open', open);
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', mobileMenu ? (open ? 'Close menu' : 'Open menu') : (open ? 'Close workspace navigation' : 'Open workspace navigation'));
    if (mobileMenu) {
      sizeMobileMenu();
      // Return focus before hiding the panel from the accessibility tree.
      if (!open && returnFocus) menu?.focus();
      mobileMenu.inert = !open;
      mobileMenu.setAttribute('aria-hidden', String(!open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      $$('main, .site-footer').forEach(el => { el.inert = open; });
      if (open) requestAnimationFrame(() => { if (mobileMenu.classList.contains('open')) $('a', mobileMenu)?.focus({ preventScroll: true }); });
    }
    if (sidebar && innerWidth <= 800) {
      sidebar.inert = !open;
      $('.db-shell').inert = open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('.db-close').focus(); else menu?.focus();
    }
  }
  menu?.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
  $('.db-close')?.addEventListener('click', () => toggleMenu(false));
  overlay?.addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') toggleMenu(false);
    if (e.key === 'Tab' && sidebar?.classList.contains('open')) {
      const items = $$('a,button', sidebar); const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Tab' && mobileMenu?.classList.contains('open')) {
      const items = [menu, ...$$('a, button', mobileMenu)];
      if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1).focus(); }
      if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0].focus(); }
    }
  });
  if (mobileMenu) {
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    addEventListener('resize', () => {
      if (innerWidth > 800 && mobileMenu.classList.contains('open')) {
        toggleMenu(false, false);
        $('#primary-nav [aria-current="page"]')?.focus({ preventScroll: true });
      } else sizeMobileMenu();
    });
    window.visualViewport?.addEventListener('resize', sizeMobileMenu);
    addEventListener('pageshow', () => { if (mobileMenu.classList.contains('open')) toggleMenu(false); });
  }
  if (sidebar) {
    const adaptDrawer = () => {
      sidebar.inert = innerWidth <= 800 && !sidebar.classList.contains('open');
      if (innerWidth > 800) { sidebar.classList.remove('open'); overlay?.classList.remove('open'); $('.db-shell').inert = false; document.body.style.overflow = ''; menu?.setAttribute('aria-expanded', 'false'); }
    };
    adaptDrawer(); addEventListener('resize', adaptDrawer);
  }
  const treatmentTabs = $$('[data-treatment]');
  function selectTreatment(tab, focus = false) {
    treatmentTabs.forEach(t => { const selected = t === tab; t.setAttribute('aria-selected', String(selected)); t.tabIndex = selected ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !selected; });
    if (focus) tab.focus();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !document.body.classList.contains('no-motion') && window.gsap) gsap.fromTo($('#' + tab.getAttribute('aria-controls')), { opacity: .3, y: 12 }, { opacity: 1, y: 0, duration: .4, clearProps: 'transform,opacity' });
  }
  treatmentTabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTreatment(t));
    t.addEventListener('keydown', e => { let index; if (['ArrowDown', 'ArrowRight'].includes(e.key)) index = (i + 1) % treatmentTabs.length; if (['ArrowUp', 'ArrowLeft'].includes(e.key)) index = (i - 1 + treatmentTabs.length) % treatmentTabs.length; if (e.key === 'Home') index = 0; if (e.key === 'End') index = treatmentTabs.length - 1; if (index !== undefined) { e.preventDefault(); selectTreatment(treatmentTabs[index], true); } });
  });
  let journalCategory = 'All stories';
  function filterJournal() {
    const query = ($('#journal-search')?.value || '').trim().toLowerCase(); let shown = 0;
    $$('.article-card').forEach(card => { const searchable = $$('h3,p,.article-meta', card).map(el => el.textContent).join(' ').toLowerCase(); const visible = (journalCategory === 'All stories' || card.dataset.category === journalCategory) && searchable.includes(query); card.hidden = !visible; if (visible) { shown++; card.classList.add('aos-animate'); } });
    if ($('#journal-empty')) $('#journal-empty').hidden = shown > 0;
    if ($('#journal-count')) $('#journal-count').textContent = String(shown).padStart(2, '0') + (shown === 1 ? ' story to explore' : ' stories to explore');
    window.ScrollTrigger?.refresh();
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => { journalCategory = button.dataset.filter; $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); filterJournal(); }));
  $('#journal-search')?.addEventListener('input', filterJournal);
  $$('.password-toggle').forEach(b => b.addEventListener('click', () => { const input = b.previousElementSibling; const show = input.type === 'password'; input.type = show ? 'text' : 'password'; b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); b.setAttribute('aria-pressed', String(show)); }));
  let role = 'client';
  $$('.role-tabs button').forEach(b => b.addEventListener('click', () => { role = b.dataset.role; $$('.role-tabs button').forEach(t => t.setAttribute('aria-pressed', String(t === b))); }));
  $('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    $('#email').value = '';
    $('#password').value = '';
    location.href = role + '-dashboard.html';
  });
  const confirmPassword = $('#confirm-password');
  if (confirmPassword) {
    const match = () => confirmPassword.setCustomValidity(confirmPassword.value && confirmPassword.value !== $('#password').value ? 'Passwords must match.' : '');
    confirmPassword.addEventListener('input', match); $('#password').addEventListener('input', match);
  }
  $('#signup-form')?.addEventListener('submit', e => {
    e.preventDefault(); if (!e.currentTarget.reportValidity()) return;
    $('#password').value = ''; confirmPassword.value = '';
    location.href = 'login.html?registered=1';
  });
  if ($('#login-form') && new URLSearchParams(location.search).has('registered')) {
    const status = $('.form-status'); status.classList.remove('error'); status.textContent = 'You’re ready for the next step. Sign in to continue.';
  }
  $('.logout')?.addEventListener('click', () => { location.replace('login.html'); });
  $('#settings-form')?.addEventListener('submit', e => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; const email = $('#profile-email').value.trim(); $$('.account-email').forEach(el => el.textContent = email); $$('.avatar').forEach(el => { el.textContent = email[0].toUpperCase(); el.setAttribute('aria-label', 'Account initial ' + el.textContent); }); $('.form-status', e.currentTarget).textContent = 'Display updated on this page only. Nothing is stored; navigation or reload resets it.'; });
  $('#preferences-form')?.addEventListener('submit', e => { e.preventDefault(); $('.form-status', e.currentTarget).textContent = 'Preferences applied to this preview. They reset when you leave the page.'; });
  $('#contact-form')?.addEventListener('submit', e => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; $('.form-status', e.currentTarget).textContent = 'Your enquiry preview is complete. No message has been sent or stored.'; });
  $('#message-form')?.addEventListener('submit', e => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; $('.form-status', e.currentTarget).textContent = 'Reply preview: ' + $('#reply').value.trim() + ' — Not sent or stored.'; });
  $$('[data-message]').forEach(b => b.addEventListener('click', () => { $$('[data-message]').forEach(t => t.setAttribute('aria-pressed', String(t === b))); $('#message-preview').innerHTML = b.dataset.message === 'welcome' ? '<div class="article-meta">Sample conversation · Care team</div><h3>Welcome to your care space</h3><p>This is a place to see sample appointments, explore the journal and get to know the care journey.</p>' : '<div class="article-meta">Sample conversation · Care team</div><h3>A note before your visit</h3><p>Bring any questions you would like to discuss. We can take a moment to talk through what happens next.</p>'; }));
  let tableFilter = 'all';
  function filterTable() { const q = ($('[data-table-search]')?.value || '').toLowerCase().trim(); let n = 0; $$('tbody tr').forEach(tr => { tr.hidden = !(tr.textContent.toLowerCase().includes(q) && (tableFilter === 'all' || tr.textContent.includes(tableFilter))); if (!tr.hidden) n++; }); if ($('[data-table-empty]')) $('[data-table-empty]').hidden = n > 0; }
  $('[data-table-search]')?.addEventListener('input', filterTable);
  $$('[data-table-filter]').forEach(b => b.addEventListener('click', () => { tableFilter = b.dataset.tableFilter; $$('[data-table-filter]').forEach(t => t.setAttribute('aria-pressed', String(t === b))); filterTable(); }));
  $('#go-back')?.addEventListener('click', () => { if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) history.back(); else location.href = 'index.html'; });
  $('.motion-pause')?.addEventListener('click', e => { const paused = $('.marquee').classList.toggle('paused'); e.currentTarget.setAttribute('aria-pressed', String(paused)); e.currentTarget.textContent = paused ? 'Resume motion' : 'Pause motion'; });
  // AOS and GSAP own different elements. Content remains visible when either library is missing.
  if (!reduced && window.AOS) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/vendor/aos/aos.css';
    css.onload = () => AOS.init({ duration: 700, once: true, offset: 45, easing: 'ease-out-cubic' });
    document.head.append(css);
  }
  if (!reduced && window.gsap) {
    const intro = gsap.timeline({ defaults: { duration: .9, ease: 'power3.out' } });
    if ($('.animate-title')) intro.from('.animate-title', { y: 40, opacity: 0, clearProps: 'all' });
    if ($('.hero-photo')) intro.from('.hero-photo', { y: 45, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, .15);
    if ($('.hero-bottom')) intro.from('.hero-bottom', { y: 15, opacity: 0, clearProps: 'all' }, .4);
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      if ($('.journey-steps')) gsap.from('.journey-step', { y: 40, opacity: 0, stagger: .15, duration: .8, clearProps: 'all', scrollTrigger: { trigger: '.journey-steps', start: 'top 85%', once: true } });
      if ($('.quote-block')) gsap.from('.quote-block', { opacity: .25, y: 30, scrollTrigger: { trigger: '.quote-block', start: 'top 85%', end: 'top 45%', scrub: .5 } });
      if (innerWidth > 800 && $('.hero-photo img')) gsap.to('.hero-photo img', { objectPosition: '55% 50%', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }
  }
})();
