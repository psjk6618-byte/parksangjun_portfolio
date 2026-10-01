// 박상준 포트폴리오 v2 — main.js
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.menu-toggle');
  var progress = document.querySelector('.progress');
  var toTop = document.querySelector('.to-top');
  var timeline = document.querySelector('.timeline');

  /* ---------- scroll-linked: header, progress, to-top, timeline ---------- */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    toTop.classList.toggle('show', y > window.innerHeight * 1.2);
    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var t = (window.innerHeight * 0.7 - r.top) / r.height;
      timeline.style.setProperty('--tl', Math.max(0, Math.min(1, t)).toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- active nav ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var alias = { p1: 'projects', p2: 'projects', p3: 'projects', p4: 'projects', p5: 'projects', credentials: 'career' };
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = alias[en.target.id] || en.target.id;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id], main article[id]').forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- count-up ---------- */
  function fmt(n, sep) { return sep ? n.toLocaleString('ko-KR') : String(n); }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var sep = el.hasAttribute('data-sep');
    if (reduce) { el.textContent = fmt(target, sep); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(target * e), sep);
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal], .path');
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* hero board KPIs: count up after the board animates in */
  setTimeout(function () { document.querySelectorAll('.board [data-count]').forEach(countUp); }, reduce ? 0 : 900);

  /* ---------- timeline filter ---------- */
  var fbtns = document.querySelectorAll('.tl-filter button');
  var tlItems = document.querySelectorAll('.tl');
  fbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      fbtns.forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      tlItems.forEach(function (li) {
        var show = f === '전체' || li.getAttribute('data-type') === f;
        li.hidden = !show;
        li.classList.add('in');
        li.classList.remove('show');
        if (show && !reduce) { void li.offsetWidth; li.classList.add('show'); }
      });
      onScroll();
    });
  });

  /* ---------- hero rotator ---------- */
  var rot = document.querySelector('.rotator');
  if (rot && !reduce) {
    var items = rot.querySelectorAll('span');
    var i = 0;
    setInterval(function () {
      var cur = items[i];
      i = (i + 1) % items.length;
      var next = items[i];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      next.classList.remove('is-out'); next.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    }, 2400);
    // keep width stable to the longest phrase
    var w = 0; items.forEach(function (s) { s.style.position = 'relative'; w = Math.max(w, s.scrollWidth); });
    rot.style.minWidth = w + 'px';
  }

  /* ---------- hero parallax (pointer) ---------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var clouds = hero.querySelectorAll('.cloud img');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      clouds.forEach(function (c, idx) {
        var d = (idx + 1) * 8;
        c.style.transform = 'translate(' + (x * d).toFixed(1) + 'px,' + (y * d).toFixed(1) + 'px)';
      });
    });
    hero.addEventListener('pointerleave', function () { clouds.forEach(function (c) { c.style.transform = ''; }); });
  }

  /* ---------- copy email / phone ---------- */
  var status = document.getElementById('copy-status');
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.getAttribute('data-label');
      function done(ok) {
        btn.textContent = ok ? '복사했습니다' : '직접 선택해 복사해 주세요';
        btn.classList.toggle('done', ok);
        status.textContent = ok ? text + ' 복사했습니다' : '';
        setTimeout(function () { btn.textContent = label; btn.classList.remove('done'); }, 2200);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          done(document.execCommand('copy'));
          document.body.removeChild(ta);
        } catch (err) { done(false); }
      }
    });
  });
})();
