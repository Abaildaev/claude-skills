/* ===========================================================================
   skills.js — Коллекция 60+ экспертных навыков для Claude Code
   Автор: Ернур Абайлдаев (Botflow)
   Telegram-бот выдачи: @ernurdev_bot (https://t.me/ernurdev_bot?start=skills)
   Telegram-канал: @ernur_dev (https://t.me/ernur_dev)
   =========================================================================== */
(function () {
  'use strict';

  var BOT_URL = 'https://t.me/ernurdev_bot?start=skills';
  var TG_CHANNEL = 'https://t.me/ernur_dev';
  var SKILLS = 66;

  function $all(sel) { return [].slice.call(document.querySelectorAll(sel)); }

  function paint() {
    $all('[data-price]').forEach(function (el) { el.textContent = '0 ₸'; });
    $all('[data-price-free]').forEach(function (el) { el.textContent = 'Бесплатно'; });
    $all('[data-price-cents]').forEach(function (el) { el.textContent = '0 ₸'; });
    $all('[data-after]').forEach(function (el) { el.textContent = '$49'; });
    $all('[data-compare]').forEach(function (el) {
      el.textContent = '$49';
      el.hidden = false;
    });
    $all('[data-save]').forEach(function (el) {
      el.textContent = '100% Free';
      el.hidden = false;
    });
    $all('[data-per-skill]').forEach(function (el) {
      el.textContent = '100% бесплатно · Open Source';
    });
    $all('[data-deadline-long]').forEach(function (el) {
      el.textContent = 'Открытый доступ';
    });
    $all('[data-live-only]').forEach(function (el) { el.hidden = false; });
    $all('[data-ended-only]').forEach(function (el) { el.hidden = true; });

    // Buttons that open the Telegram bot directly
    $all('a[data-bot]').forEach(function (a) {
      a.href = BOT_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  function stickyBar() {
    var bar = document.querySelector('[data-sticky]');
    var hero = document.querySelector('[data-buy="hero"]');
    var access = document.querySelector('#access');
    var stickyBtn = bar ? bar.querySelector('.rs-btn') : null;
    if (!bar || !hero) return;
    bar.hidden = false;
    var on = false;
    function update() {
      var vh = window.innerHeight;
      var pastHero = hero.getBoundingClientRect().bottom < 0;
      var pastAccess = access && access.getBoundingClientRect().top < vh * 0.5;
      
      if (pastHero !== on) {
        on = pastHero;
        bar.classList.toggle('is-on', on);
      }

      if (stickyBtn) {
        if (pastAccess) {
          stickyBtn.href = BOT_URL;
          stickyBtn.target = '_blank';
          stickyBtn.rel = 'noopener noreferrer';
          stickyBtn.textContent = 'Забрать в @ernurdev_bot ↗';
        } else {
          stickyBtn.href = '#access';
          stickyBtn.removeAttribute('target');
          stickyBtn.removeAttribute('rel');
          stickyBtn.textContent = 'Забрать 60+ навыков ↓';
        }
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function boot() {
    paint();
    stickyBar();

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#access"]');
      if (!a) return;
      e.preventDefault();
      var target = document.querySelector('#access');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* ===========================================================================
   Интерактивные демонстрации:
   - Терминал Claude в Hero
   - Переключатель сценариев (Tabs)
   - Сетка всех 66 навыков с фильтрами по категориям
   =========================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STOP = {};
  var AV = '<img class="sk-chat-av" src="./brand-icons/claude.png" alt="" width="24" height="24">';

  var JOBS = {
    anim: {
      prompt: 'Сделай 3D маршрут для Reels: Алматы — Бали, 8 200 км',
      skill: 'map-route', pack: 'Монтаж и Анимация',
      reply: [
        'Инициализирую сцену Three.js с 3D-глобусом и рельефом местности.',
        '1. Траектория полета: камера динамически летит по дуге Алматы → Бали.',
        '2. Одометр: анимированный счетчик километров с ускорением от 0 до 8 200 км.',
        '3. Пин геолокации и карточка направления в безопасной зоне Instagram Reels.',
        '4. Рендер MP4 завершен (1080x1920, 60fps). Экспортировать в проект?'
      ]
    },
    yt: {
      prompt: 'Напиши сценарий Shorts: 3 AI-инструмента, которые заменят видеомонтажера',
      skill: 'yt-script', pack: 'YouTube и Контент',
      reply: [
        'Оценка хука: 9.4/10 · Прогноз удержания: 82%+',
        '0:00–0:03 [Хук]: Монтажеры берут $50 за ролик, который этот софт собирает за 12 секунд.',
        '0:03–0:18 [Инструмент 1]: HyperFrames — генерирует динамичную графику прямо из кода.',
        '0:18–0:35 [Инструмент 2]: Whisper + CutCurve — вырезает паузы и тишину в один клик.',
        '0:35–0:50 [Инструмент 3]: Zach-D-Films — трехмерные персонажи под вашу озвучку.',
        '0:50–0:58 [Призыв]: Напиши «МОНТАЖ» в комменты — пришлю ссылки на инструменты.'
      ]
    },
    sales: {
      prompt: 'Клиент на созвоне говорит: "У вас дорого, в другом месте сделают за 50 000 ₸". Как ответить?',
      skill: 'sales-coach', pack: 'Продажи и B2B',
      reply: [
        'Режим живого ассистента · Перехват инициативы:',
        '1. Присоединение: «Понимаю вас, разница в цене действительно ощутима».',
        '2. Вскрытие ценности: «Подскажите, за 50 000 ₸ они гарантируют интеграцию с CRM и техподдержку 24/7, или это голый шаблон?»',
        '3. Перевод на риски: «Обычно дешевые решения ломаются через месяц, и бизнес теряет лидов на миллионы. Мы делаем решение под ключ с гарантией окупаемости».',
        '4. Закрытие: «Показать кейс, где клиент сначала выбрал дешевый вариант, а потом пришел переделывать к нам?»'
      ]
    },
    social: {
      prompt: 'Очеловечь этот черновик поста для блога и убери нейросетевой мусор',
      skill: 'ig-human', pack: 'Instagram и Соцсети',
      reply: [
        'Анализ черновика: удалены 6 тире, штампы «в эпоху цифровизации» и канцелярит.',
        'Итоговый живой вариант:',
        '«Мы потратили 4 недели на запуск бота и получили ровно 0 заказов.',
        'Оказалось, людям не нужна была сложная воронка. Им нужна была одна кнопка: узнать цену и записаться.',
        'Как только мы оставили два простых экрана — конверсия выросла в 4 раза за первые выходные.',
        'Мораль: простота продает лучше любых сложных схем.»'
      ]
    },
    recut: {
      prompt: 'Наложи B-roll и всплывающую графику на подкаст спикера по транскрипту',
      skill: 'talking-head-recut', pack: 'Монтаж и Анимация',
      reply: [
        'Анализ дорожки спикера (хронометраж 36 сек):',
        '[0:04] Спикер говорит о «росте выручки x3» → всплывающий 3D-график роста.',
        '[0:15] Фраза «нейросети для бизнеса» → футаж серверной + саунд-эффект Whoosh.',
        '[0:25] Главный инсайт → динамический наезд камеры (Punch-in 1.15x) на спикера.',
        'Звук: фоновый трек приглушен под голос на -18dB (авто-дакинг). Файл скомпонован!'
      ]
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function near(el, frac) { var r = el.getBoundingClientRect(); return r.top < innerHeight * (frac || 0.85) && r.bottom > 0; }

  function Chat(fig) {
    var body = fig.querySelector('[data-chat-body]');
    var compose = fig.querySelector('[data-compose]');
    var sendBtn = fig.querySelector('.sk-chat-compose b');
    var hint = compose ? compose.textContent : '';
    var token = 0;

    function wait(ms, t) {
      return new Promise(function (ok, no) {
        setTimeout(function () {
          if (t !== token) return no(STOP);
          if (body) body.scrollTop = body.scrollHeight;
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
      stop: function () { token++; if (compose) { compose.classList.remove('is-typed'); compose.textContent = hint; } },
      wait: wait,
      clear: function (t, fade) {
        if (!body) return Promise.resolve();
        if (!fade) { body.innerHTML = ''; return Promise.resolve(); }
        body.classList.add('is-clearing');
        return wait(280, t).then(function () { body.innerHTML = ''; body.classList.remove('is-clearing'); });
      },
      type: async function (text, t, fast) {
        if (!compose) return;
        compose.classList.add('is-typed');
        for (var i = 1; i <= text.length; i++) {
          compose.textContent = text.slice(0, i);
          await wait((fast ? 14 : 22) + Math.random() * (fast ? 16 : 30), t);
        }
        await wait(260, t);
        if (sendBtn) {
          sendBtn.classList.add('is-press');
          await wait(130, t);
          sendBtn.classList.remove('is-press');
        }
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
      tool: async function (parent, busy, done, ms, t, opts) {
        opts = opts || {};
        var p = add(parent, 'p', 'sk-chat-tool is-busy', '<i></i><span>' + busy + '</span>');
        var label = p.querySelector('span');
        if (opts.count) {
          var steps = 14;
          for (var k = 1; k <= steps; k++) {
            label.textContent = busy + ' (' + Math.round(opts.count * k / steps) + ' из ' + opts.count + ')';
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

  function skillLine(job) { return 'Использую навык <b>' + esc(job.skill) + '</b> · категория «' + esc(job.pack) + '»'; }

  function hero() {
    var fig = document.querySelector('[data-hero-chat]');
    if (!fig) return;
    var c = Chat(fig);
    c.body.classList.add('is-live');
    if (REDUCED) return;
    var order = ['anim', 'yt', 'sales'];
    var n = 0;
    async function cycle(t, first) {
      var job = JOBS[order[n++ % order.length]];
      await c.clear(t, !first);
      await c.wait(first ? 350 : 500, t);
      await c.type('git clone https://github.com/Abaildaev/claude-skills.git ~/.claude/skills/', t);
      await c.wait(450, t);
      var a = c.turn();
      await c.say(a, "Это коллекция 60+ экспертных навыков Claude от Ернура Абайлдаева (Botflow). Начинаю установку.", t);
      await c.tool(a, 'Клонирую открытый репозиторий', 'Репозиторий подключен', 700, t);
      await c.tool(a, 'Устанавливаю навыки', 'Установлено 66 навыков', 1200, t, { count: 66 });
      await c.wait(300, t);
      var opts = c.ask(a, 'Какие категории активировать?', [
        ['Монтаж и Анимация', '15 навыков'],
        ['YouTube и Контент', '12 навыков'],
        ['Продажи и B2B', '15 навыков'],
        ['Instagram и Соцсети', '13 навыков']
      ]);
      for (var i = 0; i < 4; i++) { await c.wait(380, t); opts[i].classList.add('is-on'); }
      await c.wait(500, t);
      await c.say(a, 'Готово. Все категории активны. Запускаю задачу...', t);
      await c.wait(900, t);
      await c.type(job.prompt, t);
      await c.wait(400, t);
      var b = c.turn();
      await c.tool(b, 'Подбираю регламент', skillLine(job), 650, t, { skill: true });
      await c.lines(b, job.reply, t);
      await c.wait(4800, t);
    }
    var t = c.start();
    (async function loop(first) {
      try { await cycle(t, first); loop(false); } catch (e) { if (e !== STOP) throw e; }
    })(true);
  }

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
    if (!REDUCED && !near(fig, 0.8)) c.body.innerHTML = '';

    function select(i) {
      current = i;
      tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      list.classList.remove('is-auto');
      void list.offsetWidth;
      if (auto) list.classList.toggle('is-auto', true);
    }
    async function show(i, t) {
      var job = JOBS[tabs[i].getAttribute('data-job')];
      if (!job) return;
      await c.clear(t, true);
      await c.wait(150, t);
      await c.type(job.prompt, t, true);
      await c.wait(300, t);
      var a = c.turn();
      await c.tool(a, 'Подбираю регламент', skillLine(job), 600, t, { skill: true });
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
    list.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var i = (current + d + tabs.length) % tabs.length;
      tabs[i].focus();
      tabs[i].click();
    });
    if (REDUCED) return;
    function check() {
      if (started || !near(fig, 0.8)) return;
      started = true;
      removeEventListener('scroll', check);
      play(0);
    }
    addEventListener('scroll', check, { passive: true });
    check();
  }

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
          return a.textContent.localeCompare(b.textContent);
        });
        grid.innerHTML = '';
        mine.forEach(function (p, k) {
          var c = p.cloneNode(true);
          c.style.setProperty('--k', Math.min(k, 60));
          grid.appendChild(c);
        });
        cap.innerHTML = '<b>' + mine.length + ' навыков</b> в категории «' + esc(tab.getAttribute('data-name')) + '» · 100% Open Source';
        rows.hidden = true;
        gridWrap.hidden = false;
      });
    });
  }

  function counters() {
    var els = [].slice.call(document.querySelectorAll('[data-count]'));
    if (REDUCED || !els.length) return;
    function fmt(n) { return Math.round(n).toLocaleString('ru-RU'); }
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
