(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const comfortCopy = {
    explain: 'Knowing what happens next can make the unfamiliar feel a little easier.',
    pace: 'There is room to pause, take a breath and talk about a pace that feels comfortable.',
    questions: 'Bring your list. Ask again. A clear conversation leaves room for what matters to you.'
  };
  $$('[data-question]').forEach(button => button.addEventListener('click', () => {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    button.closest('.s-choice-card').classList.toggle('is-picked', selected);
    button.lastElementChild.textContent = selected ? 'Added to my talking points' : 'Add to my talking points';
    button.querySelector('i').className = 'fa-solid fa-' + (selected ? 'check' : 'plus');
    $('#question-count').textContent = $$('[data-question][aria-pressed="true"]').length + ' of 3 selected';
  }));
  $$('[data-contact-topic]').forEach(button => button.addEventListener('click', () => {
    const field = $('#contact-interest');
    field.value = button.dataset.contactTopic;
    field.dispatchEvent(new Event('change', {bubbles:true}));
    $('#contact-form').scrollIntoView({behavior:reduce.matches || document.body.classList.contains('no-motion') ? 'instant' : 'smooth',block:'start'});
    field.focus({preventScroll:true});
  }));
  $$('[data-comfort]').forEach(button => button.addEventListener('click', () => {
    $$('[data-comfort]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $('#comfort-response').textContent = comfortCopy[button.dataset.comfort];
    if (!reduce.matches && !document.body.classList.contains('no-motion') && window.gsap) gsap.fromTo('#comfort-response', {opacity:.3,y:5}, {opacity:1,y:0,duration:.35,clearProps:'all'});
  }));
  $$('.faq-grid>div:first-child').forEach(panel => {
    const emblem = document.createElement('div'); emblem.className = 's-faq-emblem'; emblem.setAttribute('aria-hidden','true'); emblem.innerHTML = '<i class="fa-regular fa-comments"></i>'; panel.append(emblem);
  });
  const responses = {
    everyday: ['Start with the essentials.', 'A check-up is a chance to discuss your oral health, ask questions and understand whether any further care is recommended.'],
    confidence: ['Make room for your smile goals.', 'Explain what you would like to explore. A clinician can discuss suitability, realistic expectations and the options that may be available to you.'],
    family: ['A welcome for every chapter.', 'Ask about appointments for different ages, practical arrangements and what would help each family member feel at ease.'],
    nervous: ['Start with how you feel.', 'Let the team know what feels difficult. You can discuss explanations, pauses and the preferences that would make a first visit more comfortable.']
  };
  $$('[data-intent]').forEach(button => button.addEventListener('click', () => {
    $$('[data-intent]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const [title, copy] = responses[button.dataset.intent];
    $('#intent-answer-title').textContent = title; $('#intent-answer-copy').textContent = copy;
    if (!reduce.matches && !document.body.classList.contains('no-motion') && window.gsap) gsap.fromTo('.p-intent-answer', { y: 12, opacity: .4 }, { y: 0, opacity: 1, duration: .45, clearProps: 'transform,opacity' });
  }));
  $$('[data-about-value]').forEach(button => button.addEventListener('click', () => {
    const n = button.dataset.aboutValue;
    $$('[data-about-value]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $$('[data-about-panel]').forEach(p => p.hidden = p.dataset.aboutPanel !== n);
    if (!reduce.matches && !document.body.classList.contains('no-motion') && window.gsap) gsap.fromTo('[data-about-panel="'+n+'"]', { opacity: .3, y: 12 }, { opacity: 1, y: 0, duration: .5, clearProps: 'all' });
  }));
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let context;
  let userPaused = false;
  let motionButton;
  const looping = [];
  function startMotion() {
    context = gsap.context(() => {
      if ($('.p-reading-progress')) gsap.to('.p-reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .15 } });
      if ($('.p-hero')) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.p-hero-copy .eyebrow', { y: 15, opacity: 0, duration: .8, clearProps: 'all' })
          .from('.p-reveal-lines>span', { y: 65, opacity: 0, stagger: .14, duration: 1.15, clearProps: 'all' }, .12)
          .from('.p-hero-copy>p,.p-hero-copy>.actions', { y: 22, opacity: 0, stagger: .1, duration: .9, clearProps: 'all' }, .5)
          .from('.p-hero-image', { opacity: 0, scale: 1.04, duration: 1.5, clearProps: 'all' }, 0)
          .from('.p-hero-bottom,.p-hero-seal', { opacity: 0, duration: 1, clearProps: 'opacity' }, .9);
        looping.push(gsap.to('.p-hero-seal svg', { rotation: 360, duration: 45, repeat: -1, ease: 'none' }));
        if (innerWidth > 800) gsap.to('.p-hero-image img', { yPercent: 10, scale: 1, ease: 'none', scrollTrigger: { trigger: '.p-hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      }
      $$('[data-split]').forEach(el => {
        gsap.from(el, { y: 35, opacity: 0, duration: .95, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 91%', once: true } });
      });
      $$('.p-image-reveal').forEach(el => {
        gsap.from(el, { clipPath: 'inset(14% 0 14% 0)', duration: 1.35, ease: 'power3.out', clearProps: 'clipPath', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
        const img = el.querySelector('img');
        if (img) gsap.from(img, { scale: 1.1, duration: 1.5, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      });
      $$('.s-listening-card').forEach((card,i) => gsap.from(card, {x:i%2?35:-35,y:25,rotation:0,opacity:0,duration:1,clearProps:'all',scrollTrigger:{trigger:card,start:'top 92%',once:true}}));
      $$('.s-role-photo img').forEach(art => gsap.from(art, {scale:1.08,duration:1.25,ease:'power2.out',clearProps:'transform',scrollTrigger:{trigger:art,start:'top 92%',once:true}}));
      $$('.s-journal-lines').forEach(art => gsap.fromTo(art,{x:-18},{x:18,ease:'none',scrollTrigger:{trigger:art.closest('.s-journal-card'),start:'top bottom',end:'bottom top',scrub:1}}));
      $$('.s-philosophy-arch').forEach(art => gsap.from(art,{clipPath:'inset(15% 0 0 0)',y:25,duration:1.3,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:art,start:'top 85%',once:true}}));
      $$('.s-standard-art>div').forEach(art => gsap.from(art,{y:30,opacity:.2,duration:.9,clearProps:'all',scrollTrigger:{trigger:art,start:'top 92%',once:true}}));
      if ($('.s-plan-sheet')) gsap.from('.s-plan-sheet',{rotation:-3,y:45,opacity:0,duration:1.2,clearProps:'all',scrollTrigger:{trigger:'.s-plan-sheet',start:'top 88%',once:true}});
      if ($('.s-reading-note')) gsap.from('.s-reading-note',{rotation:3,y:40,opacity:0,duration:1.1,clearProps:'all',scrollTrigger:{trigger:'.s-reading-note',start:'top 90%',once:true}});
      if ($('.s-hello-art')) gsap.from('.s-hello-art>div',{y:30,opacity:0,rotation:0,stagger:.15,duration:1.1,clearProps:'all'});
      if ($('.s-smile-line')) gsap.fromTo('.s-smile-line path',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.4,ease:'power2.inOut',scrollTrigger:{trigger:'.s-smile-line',start:'top 90%',once:true}});
      if ($('.s-article-symbol')) gsap.from('.s-article-symbol',{rotation:-15,scale:.85,opacity:0,duration:1.2,clearProps:'all',scrollTrigger:{trigger:'.s-article-symbol',start:'top 90%',once:true}});
      if ($('.s-signoff-arch')) gsap.from('.s-signoff-arch',{scale:.85,opacity:.2,duration:1.4,clearProps:'all',scrollTrigger:{trigger:'.p-contact-signoff',start:'top 85%',once:true}});
      if ($('.s-service-closing')) gsap.from('.s-service-closing span',{y:20,opacity:0,stagger:.12,duration:.8,clearProps:'all',scrollTrigger:{trigger:'.s-service-closing',start:'top 90%',once:true}});
      $$('.p-word-reveal').forEach(el => {
        if (!el.dataset.splitReady) {
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
          nodes.forEach(node => { const fragment = document.createDocumentFragment(); node.textContent.split(/(\s+)/).forEach(word => { if (/^\s+$/.test(word)) fragment.append(document.createTextNode(word)); else if (word) { const span = document.createElement('span'); span.className = 'word'; span.textContent = word; fragment.append(span); } }); node.replaceWith(fragment); });
          el.dataset.splitReady = 'true';
        }
        gsap.fromTo(el.querySelectorAll('.word'), { opacity: .2 }, { opacity: 1, stagger: .2, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 42%', scrub: .4 } });
      });
      if ($('.p-process-line')) {
        gsap.from('.p-process-line span', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '.p-process-list', start: 'top 65%', end: 'bottom 65%', scrub: .5 } });
        $$('.p-process-step').forEach(el => gsap.from(el, { x: 25, opacity: .25, duration: .7, clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 80%', once: true } }));
      }
      if ($('.p-comfort-orbits')) gsap.from('.p-comfort-orbits span', { scale: .75, opacity: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.p-comfort', start: 'top 95%', end: 'bottom 65%', scrub: .6 } });
      if ($('.p-finale-rings')) gsap.from('.p-finale-rings i', { scale: .6, opacity: 0, stagger: .15, duration: 1.6, scrollTrigger: { trigger: '.p-finale', start: 'top 85%', once: true } });
      if ($('.p-about-hero-media img')) gsap.from('.p-about-hero-media img', { scale: 1.12, duration: 1.7, ease: 'power2.out', clearProps: 'transform' });
      if ($('.p-service-sculpture img') && innerWidth > 800) gsap.fromTo('.p-service-sculpture img', { y: -18 }, { y: 18, ease: 'none', scrollTrigger: { trigger: '.p-service-intro', start: 'top 90%', end: 'bottom 10%', scrub: 1 } });
      if ($('.p-blog-feature')) gsap.from('.p-blog-feature', { y: 40, opacity: 0, duration: 1.2, clearProps: 'all' });
      if ($('.auth-layout')) {
        gsap.from('.auth-visual img', { scale: 1.06, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' });
        gsap.from('.auth-form>h1,.auth-form>.field,.auth-form>.role-tabs', { y: 16, opacity: 0, stagger: .07, duration: .75, clearProps: 'all' });
      }
      if ($('.db-main')) gsap.from('.db-main>h1,.metric', { y: 13, opacity: 0, stagger: .06, duration: .55, clearProps: 'all' });
      $$('.p-contact-method').forEach((el, i) => gsap.from(el, { y: 25, opacity: 0, duration: .8, delay: i * .08, clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    });
  }
  function stopMotion() {
    context?.revert(); looping.splice(0).forEach(t => t.kill());
    context = undefined;
    const panels = $$('[data-about-panel],.p-intent-answer,#comfort-response,.p-service-panel');
    if (panels.length) { gsap.killTweensOf(panels); gsap.set(panels, {clearProps:'transform,opacity'}); }
    document.body.classList.add('no-motion');
    if (window.AOS) { $$('[data-aos]').forEach(el => el.classList.add('aos-animate')); }
  }
  function syncMotion() {
    const stopped = userPaused || reduce.matches;
    if (stopped) stopMotion();
    else if (!context) { document.body.classList.remove('no-motion'); startMotion(); }
    if (motionButton) {
      motionButton.hidden = reduce.matches;
      motionButton.setAttribute('aria-pressed', String(stopped));
      motionButton.setAttribute('aria-label', stopped ? 'Resume decorative motion' : 'Pause decorative motion');
      motionButton.innerHTML = '<i class="fa-solid fa-'+(stopped?'play':'pause')+'" aria-hidden="true"></i>';
    }
  }
  if ($('.premium-page')) {
    motionButton = document.createElement('button'); motionButton.type = 'button'; motionButton.className = 'p-motion-toggle'; document.body.append(motionButton);
    motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  }
  syncMotion();
  reduce.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => looping.forEach(t => t.paused(document.hidden)));
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
