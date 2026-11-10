/* ===========================================================================
   skills.js   skills.opusjake.ai: prices, countdown, checkout links, buy bar

   Reads /offer.json, the same config the /r/ pop-up (offer.js) uses, so the
   price, the real deadline and the Stripe Payment Links stay in one
   place. Until the deadline every Buy link is the launch link; after it, the
   afterDeadline link and price. The HTML ships the launch values, so the page
   still sells if this file or the fetch fails.

   Tracking matches offer.js: a cookieless POST to /api/public/offer-event,
   "open" once per page load (detail "landing") and "checkout" per press
   (detail = which button). Checkout links carry client_reference_id
   r_skills-landing, so the portal funnel puts views, clicks and sales from
   this page on one row ("skills-landing").
   =========================================================================== */
(function () {
  'use strict';

  var SLUG = 'skills-landing';
  var VARIANT = 'lp-v1';
  var REF = 'r_' + SLUG;
  var SKILLS = 500;

  var o = {
    id: 'skill-setup-v1',
    price: 29,
    compareAt: 49,
    deadline: '2026-11-16T23:59:00-05:00',
    checkoutUrl: 'https://buy.stripe.com/bJe5kE7Ac3fB8VQfwy3VC0d',
    afterDeadline: { price: 49, checkoutUrl: 'https://buy.stripe.com/fZu3cwg6IbM71to5VY3VC0e' }
  };

  var landed = Date.now();
  var VIEW = Math.random().toString(36).slice(2, 12);
  var REPORT = !navigator.webdriver && !/^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$|\.local$|\.test$|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);

  function $all(sel) { return [].slice.call(document.querySelectorAll(sel)); }
  function end() { return new Date(o.deadline).getTime(); }
  function live() { return !isNaN(end()) && Date.now() < end(); }
  function price() { return live() ? o.price : (o.afterDeadline && o.afterDeadline.price) || o.price; }
  function money(n) { return '$' + (Math.round(n * 100) % 100 ? n.toFixed(2) : String(n)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function checkoutUrl() {
    var base = live() ? o.checkoutUrl : (o.afterDeadline && o.afterDeadline.checkoutUrl) || o.checkoutUrl;
    try {
      var u = new URL(base, location.href);
      u.searchParams.set('client_reference_id', REF);
      return u.toString();
    } catch (e) { return base; }
  }

  function deadlineLong() {
    try {
      var d = new Date(o.deadline);
      var months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      return d.getDate() + ' ' + months[d.getMonth()] + ' в 23:59 ET';
    } catch (e) { return o.deadlineShort || ''; }
  }

  function paint() {
    var p = price(), on = live();
    var after = (o.afterDeadline && o.afterDeadline.price) || o.compareAt;
    $all('[data-price]').forEach(function (el) { el.textContent = money(p); });
    $all('[data-price-cents]').forEach(function (el) { el.textContent = '$' + p.toFixed(2); });
    $all('[data-after]').forEach(function (el) { el.textContent = money(after); });
    $all('[data-compare]').forEach(function (el) {
      var show = on && o.compareAt > p;
      el.textContent = show ? money(o.compareAt) : '';
      el.hidden = !show;
    });
    // under $100 a percentage reads bigger than the dollar amount (40% off vs Save $20)
    $all('[data-save]').forEach(function (el) {
      var show = on && o.compareAt > p;
      el.textContent = !show ? '' : o.compareAt < 100 ? 'Скидка ' + Math.floor((o.compareAt - p) / o.compareAt * 100) + '%' : 'Экономия ' + money(o.compareAt - p);
      el.hidden = !show;
    });
    $all('[data-per-skill]').forEach(function (el) { el.textContent = 'Меньше ' + Math.ceil(p / SKILLS * 100) + '¢ за навык'; });
    $all('[data-deadline-long]').forEach(function (el) { el.textContent = deadlineLong(); });
    $all('[data-live-only]').forEach(function (el) { el.hidden = !on; });
    $all('[data-ended-only]').forEach(function (el) { el.hidden = on; });
    var href = checkoutUrl();
    $all('a[data-buy]').forEach(function (a) { a.href = href; });
  }

  var wasLive = null;
  function tick() {
    var on = live();
    if (on !== wasLive) { wasLive = on; paint(); }
    if (!on) return;
    var s = Math.max(0, Math.floor((end() - Date.now()) / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    $all('[data-clock]').forEach(function (c) {
      var u = c.querySelectorAll('[data-u]');
      for (var i = 0; i < u.length; i++) {
        var k = u[i].getAttribute('data-u');
        u[i].textContent = k === 'd' ? String(d) : pad(k === 'h' ? h : k === 'm' ? m : sec);
      }
    });
    var short = d > 0 ? d + 'д ' + pad(h) + 'ч ' + pad(m) + 'м' : pad(h) + ':' + pad(m) + ':' + pad(sec);
    $all('[data-clock-short]').forEach(function (el) { el.textContent = short; });
  }

  function track(name, detail) {
    if (!REPORT) return;
    var body = { offer: o.id, variant: VARIANT, event: name, detail: detail || '', slug: SLUG, view: VIEW, ms: Date.now() - landed, referrer: (document.referrer || '').slice(0, 2000) };
    try {
      fetch('/api/public/offer-event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, credentials: 'omit' }).catch(function () {});
    } catch (e) {}
  }

  // the buy bar: on phones, once the hero's button is off screen and before the closing band
  function stickyBar() {
    var bar = document.querySelector('[data-sticky]');
    var hero = document.querySelector('[data-buy="hero"]');
    var close = document.querySelector('.sk-close');
    if (!bar || !hero) return;
    bar.hidden = false;
    var on = false;
    function update() {
      var vh = window.innerHeight;
      var past = hero.getBoundingClientRect().bottom < 0;
      var atClose = close && close.getBoundingClientRect().top < vh * 0.9;
      var want = past && !atClose;
      if (want !== on) { on = want; bar.classList.toggle('is-on', on); }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-buy]');
    if (!a) return;
    a.href = checkoutUrl();
    track('checkout', a.getAttribute('data-buy'));
  });

  function boot() {
    paint();
    tick();
    setInterval(tick, 1000);
    stickyBar();
    track('open', 'landing');
  }

  fetch('./offer.json', { cache: 'no-store', credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) { if (cfg && cfg.checkoutUrl && cfg.price) o = cfg; })
    .catch(function () {})
    .then(boot);
})();

/* ===========================================================================
   The moving parts: the hero chat that plays the install and then one job,
   the pick-a-job demo, the wall of all 500 names, the counters.

   Timing runs on setTimeout, never requestAnimationFrame or observers alone:
   a hidden tab runs neither, and the page must still end up drawn. Every
   piece starts from finished HTML, so a failed script leaves a full page.
   Reduced motion: no playback, no drift, no counting.
   =========================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STOP = {};
  var AV = '<img class="sk-chat-av" src="./brand-icons/claude.png" alt="" width="24" height="24">';

  // example jobs; skill and pack names are real entries in the vault
  var JOBS = {
    ig: {
      prompt: 'Напиши 5 хуков для рилса о моей кофейне',
      skill: 'ig-reel', pack: 'Контент',
      reply: [
        'Вот 5 хуков, от самого сильного:',
        '1. Мы берём $7 за этот латте. Вот куда уходит каждый доллар.',
        '2. Напиток, который наши бариста отказываются готовить после 14:00.',
        '3. Как выглядят 400 чашек в день по ту сторону стойки.',
        '4. Перестаньте заказывать это в любой кофейне.',
        '5. Наш наименее продаваемый напиток — тот, которым мы гордимся больше всего.',
        'Составить раскадровку для варианта #1?'
      ]
    },
    email: {
      prompt: 'Напиши холодное письмо владельцу спортзала о моём приложении для записи',
      skill: 'cold-email', pack: 'Продажи',
      reply: [
        'Тема: 11 пропусков занятий за прошлую неделю?',
        'Привет, Сэм!',
        'Залы вашего формата теряют от 8 до 12 мест в неделю из-за неявок. Наше приложение отправляет SMS за два часа до тренировки и заполняет свободные места из листа ожидания.',
        'Уделите 10 минут в четверг, чтобы взглянуть?',
        'Я также подготовил цепочку фоллоу-апов на 3-й и 7-й дни.'
      ]
    },
    yt: {
      prompt: 'Напиши сценарий для 60-секундного YouTube Short про мой хлеб на закваске',
      skill: 'yt-script', pack: 'Контент',
      reply: [
        'Хук (0–3 сек): Твой хлеб плоский из-за одного шага, который ты пропускаешь.',
        '0:03 Плоская буханка рядом с пышной. Та же мука, та же печь.',
        '0:15 Секрет: холодная расстойка на ночь. Тесто идёт в холодильник.',
        '0:40 Утренняя выпечка. Надрез, пористый мякиш, хрустящая корка.',
        '0:55 Напиши «ХЛЕБ» в комментариях — и я пришлю полный рецепт.'
      ]
    },
    li: {
      prompt: 'Сделай пост для соцсетей: мы только что набрали 1 000 клиентов',
      skill: 'li-post', pack: 'Контент',
      reply: [
        '1 000 клиентов.',
        '18 месяцев назад их было 3, и один из них — моя мама.',
        'Что реально сдвинуло цифру:',
        '→ Мы отвечали на каждое письмо поддержки меньше чем за час.',
        '→ Мы убрали 2 функции, которыми никто не пользовался.',
        '→ Мы попросили каждого клиента об одной рекомендации.',
        'Никакой рекламы. Никакого шума. Только системная работа.'
      ]
    },
    shop: {
      prompt: 'Настрой магазин свечей ручной работы',
      skill: 'shopify-expert', pack: 'Разработка',
      reply: [
        'Вот план запуска по шагам:',
        '1. Витрина: фокус на подбор ароматов прямо с главной страницы.',
        '2. Карточки: один товар на аромат, объём как вариация, время горения в описании.',
        '3. Оплата: быстрая оплата картой в один клик, бесплатная доставка от $50.',
        '4. Запуск: приветственная цепочка из 3 писем для базы подписчиков.',
        'Написать тексты для описания товаров?'
      ]
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function near(el, frac) { var r = el.getBoundingClientRect(); return r.top < innerHeight * (frac || 0.85) && r.bottom > 0; }

  // one Claude window that can type, send and answer
  function Chat(fig) {
    var body = fig.querySelector('[data-chat-body]');
    var compose = fig.querySelector('[data-compose]');
    var sendBtn = fig.querySelector('.sk-chat-compose b');
    var hint = compose.textContent;
    var token = 0;

    // every tick also keeps the newest line in view, as the real app does
    function wait(ms, t) {
      return new Promise(function (ok, no) {
        setTimeout(function () {
          if (t !== token) return no(STOP);
          body.scrollTop = body.scrollHeight;
          ok();
        }, ms);
      });
    }
    function add(parent, tag, cls, html) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      e.setAttribute('data-new', '');
      parent.appendChild(e);
      return e;
    }
    return {
      body: body,
      start: function () { token++; return token; },
      stop: function () { token++; compose.classList.remove('is-typed'); compose.textContent = hint; },
      wait: wait,
      clear: function (t, fade) {
        if (!fade) { body.innerHTML = ''; return Promise.resolve(); }
        body.classList.add('is-clearing');
        return wait(280, t).then(function () { body.innerHTML = ''; body.classList.remove('is-clearing'); });
      },
      type: async function (text, t, fast) {
        compose.classList.add('is-typed');
        for (var i = 1; i <= text.length; i++) {
          compose.textContent = text.slice(0, i);
          await wait((fast ? 14 : 22) + Math.random() * (fast ? 16 : 30), t);
        }
        await wait(260, t);
        sendBtn.classList.add('is-press');
        await wait(130, t);
        sendBtn.classList.remove('is-press');
        compose.classList.remove('is-typed');
        compose.textContent = hint;
        add(body, 'p', 'sk-chat-me', esc(text));
      },
      turn: function () {
        var ai = add(body, 'div', 'sk-chat-ai', AV + '<div class="sk-chat-turn"></div>');
        return ai.querySelector('.sk-chat-turn');
      },
      say: async function (parent, text, t, perWord) {
        var p = add(parent, 'p', '');
        var words = text.split(' ');
        for (var i = 0; i < words.length; i++) {
          p.textContent = words.slice(0, i + 1).join(' ');
          await wait(perWord || 34, t);
        }
        return p;
      },
      // a trail line: spinner + busy label, then a check (or the skill spark) + done label
      tool: async function (parent, busy, done, ms, t, opts) {
        opts = opts || {};
        var p = add(parent, 'p', 'sk-chat-tool is-busy', '<i></i><span>' + busy + '</span>');
        var label = p.querySelector('span');
        if (opts.count) {
          var steps = 14;
          for (var k = 1; k <= steps; k++) {
            label.textContent = busy + ' (' + Math.round(opts.count * k / steps) + ' of ' + opts.count + ')';
            await wait(ms / steps, t);
          }
        } else {
          await wait(ms, t);
        }
        p.className = 'sk-chat-tool ' + (opts.skill ? 'is-skill' : 'is-done');
        label.innerHTML = done;
      },
      ask: function (parent, q, opts) {
        var card = add(parent, 'div', 'sk-chat-ask', '<p class="sk-chat-q">' + esc(q) + '</p>' +
          opts.map(function (o) { return '<p class="sk-chat-opt"><b></b>' + esc(o[0]) + '<em>' + esc(o[1]) + '</em></p>'; }).join(''));
        return [].slice.call(card.querySelectorAll('.sk-chat-opt'));
      },
      lines: async function (parent, lines, t, perWord) {
        var out = add(parent, 'div', 'sk-chat-out');
        for (var i = 0; i < lines.length; i++) {
          var p = document.createElement('p');
          out.appendChild(p);
          var words = lines[i].split(' ');
          for (var w = 0; w < words.length; w++) {
            p.textContent = words.slice(0, w + 1).join(' ');
            await wait(perWord || 16, t);
          }
          await wait(90, t);
        }
      }
    };
  }

  function skillLine(job) { return 'Использую навык <b>' + esc(job.skill) + '</b> · пак «' + esc(job.pack) + '»'; }

  // --- hero: the real install, then one job; loops through three jobs -------
  function hero() {
    var fig = document.querySelector('[data-hero-chat]');
    if (!fig) return;
    var c = Chat(fig);
    c.body.classList.add('is-live');
    if (REDUCED) return;
    var order = ['ig', 'email', 'yt'];
    var n = 0;
    async function cycle(t, first) {
      var job = JOBS[order[n++ % order.length]];
      await c.clear(t, !first);
      await c.wait(first ? 350 : 500, t);
      await c.type('Install skills from opusjake.ai/i/OJ-7F3K-92QD', t);
      await c.wait(450, t);
      var a = c.turn();
      await c.say(a, "Это ваш персональный набор навыков. Начинаю установку.", t);
      await c.tool(a, 'Открываю ссылку для установки', 'Ссылка открыта', 800, t);
      await c.tool(a, 'Устанавливаю навыки', 'Установлено 500 навыков', 1300, t, { count: 500 });
      await c.wait(300, t);
      var opts = c.ask(a, 'Какие паки включить?', [['Контент', '71 навык'], ['Продажи', '36 навыков'], ['Видео', '48 навыков'], ['Дизайн', '45 навыков']]);
      for (var i = 0; i < 3; i++) { await c.wait(420, t); opts[i].classList.add('is-on'); }
      await c.wait(500, t);
      await c.say(a, 'Готово. Контент, Продажи и Видео включены.', t);
      await c.wait(1000, t);
      await c.type(job.prompt, t);
      await c.wait(400, t);
      var b = c.turn();
      await c.tool(b, 'Подбираю навык', skillLine(job), 700, t, { skill: true });
      await c.lines(b, job.reply, t);
      await c.wait(4500, t);
    }
    var t = c.start();
    (async function loop(first) {
      try { await cycle(t, first); loop(false); } catch (e) { if (e !== STOP) throw e; }
    })(true);
  }

  // --- demo: tabs pick the job; cycles by itself until someone picks ---------
  function demo() {
    var fig = document.querySelector('[data-demo-chat]');
    var list = document.querySelector('.sk-jobs');
    if (!fig || !list) return;
    var tabs = [].slice.call(list.querySelectorAll('[data-job]'));
    var c = Chat(fig);
    var AUTO = 12000;
    var auto = !REDUCED, timer = 0, current = 0, started = false;
    list.style.setProperty('--auto-ms', AUTO + 'ms');
    c.body.classList.add('is-live');
    // below the fold at load: start empty, so the first job types in on arrival
    if (!REDUCED && !near(fig, 0.8)) c.body.innerHTML = '';

    function select(i) {
      current = i;
      tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      // restart the progress line on the newly selected tab
      list.classList.remove('is-auto');
      void list.offsetWidth;
      if (auto) list.classList.toggle('is-auto', true);
    }
    async function show(i, t) {
      var job = JOBS[tabs[i].getAttribute('data-job')];
      await c.clear(t, true);
      await c.wait(150, t);
      await c.type(job.prompt, t, true);
      await c.wait(300, t);
      var a = c.turn();
      await c.tool(a, 'Подбираю навык', skillLine(job), 600, t, { skill: true });
      await c.lines(a, job.reply, t, 12);
    }
    function play(i) {
      select(i);
      clearTimeout(timer);
      var t = c.start();
      show(i, t).catch(function (e) { if (e !== STOP) throw e; });
      if (auto) timer = setTimeout(function () { play((i + 1) % tabs.length); }, AUTO);
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { auto = false; list.classList.remove('is-auto'); clearTimeout(timer); started = true; play(i); });
    });
    // arrow keys move between tabs, like any tab list
    list.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var i = (current + d + tabs.length) % tabs.length;
      tabs[i].focus();
      tabs[i].click();
    });
    if (REDUCED) return;
    // the first job types itself once the window is on screen
    function check() {
      if (started || !near(fig, 0.8)) return;
      started = true;
      removeEventListener('scroll', check);
      play(0);
    }
    addEventListener('scroll', check, { passive: true });
    check();
  }

  // --- the wall: drifting rows of all 500, or one pack laid out --------------
  function wall() {
    var rows = document.querySelector('[data-rows]');
    var gridWrap = document.querySelector('[data-grid-wrap]');
    var grid = document.querySelector('[data-grid]');
    var cap = document.querySelector('[data-grid-cap]');
    var tabs = [].slice.call(document.querySelectorAll('.sk-tab'));
    if (!rows || !grid) return;
    var pills = [].slice.call(rows.querySelectorAll('.sk-pill'));
    if (!REDUCED) {
      [].forEach.call(rows.querySelectorAll('.sk-track'), function (track) {
        var copy = track.cloneNode(true);
        while (copy.firstChild) {
          var p = copy.firstChild;
          if (p.nodeType === 1) p.setAttribute('aria-hidden', 'true');
          track.appendChild(p);
        }
      });
      rows.classList.add('is-moving');
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var pack = tab.getAttribute('data-pack');
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === tab ? 'true' : 'false'); });
        if (pack === 'all') { gridWrap.hidden = true; rows.hidden = false; return; }
        var mine = pills.filter(function (p) { return p.getAttribute('data-p') === pack; });
        mine.sort(function (a, b) {
          var ja = a.classList.contains('is-jake'), jb = b.classList.contains('is-jake');
          return ja === jb ? a.textContent.localeCompare(b.textContent) : ja ? -1 : 1;
        });
        grid.innerHTML = '';
        mine.forEach(function (p, k) {
          var c = p.cloneNode(true);
          c.style.setProperty('--k', Math.min(k, 60));
          grid.appendChild(c);
        });
        var jake = +tab.getAttribute('data-jake') || 0;
        cap.innerHTML = '<b>' + mine.length + ' навыков</b> в паке «' + esc(tab.getAttribute('data-name')) + '»' + (jake ? ' · ' + jake + ' авторских' : '');
        rows.hidden = true;
        gridWrap.hidden = false;
      });
    });
  }

  // --- counters tick up the first time they come on screen -------------------
  function counters() {
    var els = [].slice.call(document.querySelectorAll('[data-count]'));
    if (REDUCED || !els.length) return;
    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
    els.forEach(function (el) {
      var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
      var done = false;
      if (el.getBoundingClientRect().top > innerHeight) el.textContent = '0' + suf;
      else done = true;
      function run() {
        if (done) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0) { el.textContent = fmt(to) + suf; done = true; return; }
        if (r.top > innerHeight * 0.92) return;
        done = true;
        var t0 = Date.now(), dur = 1300;
        (function step() {
          var k = Math.min(1, (Date.now() - t0) / dur);
          el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))) + suf;
          if (k < 1) setTimeout(step, 30);
        })();
      }
      addEventListener('scroll', run, { passive: true });
    });
  }

  function boot() { hero(); demo(); wall(); counters(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
