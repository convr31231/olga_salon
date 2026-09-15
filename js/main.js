(function () {
  const links = window.StudioLinks || {};
  const BOOKING_URL = links.BOOKING_URL || "https://dikidi.net/2693";
  const TELEGRAM_URL = links.TELEGRAM_URL || "";
  const MAX_URL = links.MAX_URL || "";
  const MAP_URL = links.MAP_URL || "https://yandex.ru/maps/?text=%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%8C%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D1%80%D1%8F%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%2C%2021";
  const MAP_ROUTE_URL = links.MAP_ROUTE_URL || MAP_URL;
  const MAP_EMBED_URL = links.MAP_EMBED_URL || "";

  const isReadyUrl = (url) => Boolean(url) && url.indexOf("ВСТАВИТЬ") === -1;

  const bindExternalLink = (selector, url) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
  };

  const bindOptionalLink = (selector, url, hideIfEmpty) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (isReadyUrl(url)) {
        el.href = url;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
        el.classList.remove("is-disabled");
        el.removeAttribute("aria-disabled");
        el.hidden = false;
        return;
      }
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-disabled");
      if (hideIfEmpty) el.hidden = true;
    });
  };

  bindOptionalLink("[data-link='telegram']", TELEGRAM_URL, false);
  bindOptionalLink("[data-link='max']", MAX_URL, false);
  bindExternalLink("[data-link='map']", MAP_URL);
  bindExternalLink("[data-link='map-route']", MAP_ROUTE_URL);

  const mapFrame = document.getElementById("yandex-map");
  if (mapFrame && MAP_EMBED_URL) mapFrame.src = MAP_EMBED_URL;

  document.addEventListener("click", (event) => {
    const disabled = event.target.closest(".btn.is-disabled, .btn[aria-disabled='true']");
    if (disabled) event.preventDefault();
  });
  const header = document.getElementById("header");
  const menu = document.getElementById("mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const panel = document.getElementById("service-panel");
  const lightbox = document.getElementById("lightbox");
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const galleryEmpty = document.getElementById("gallery-empty");

  const SERVICES = {
    "cut-women": {
      category: "Стрижка",
      title: "Женская стрижка",
      duration: "45 минут",
      price: "1 500 ₽",
      text: [
        "В стоимость входит мытьё волос и сушка по форме стрижки.",
      ],
    },
    "color-complex": {
      category: "Окрашивание",
      title: "Сложное окрашивание волос",
      duration: "4 часа",
      price: "7 000 ₽",
      text: [
        "Создание многогранного, объёмного цвета с помощью техник Airtouch, Shatush, Balayage и других техник окрашивания.",
        "Процедура позволяет добиться плавных переходов, естественных бликов и эффекта «дорогого» цвета, который выглядит объёмно и гармонично при любом освещении.",
        "Повторять процедуру рекомендуется примерно один раз в восемь месяцев, что позволяет сохранять качество волос.",
      ],
    },
    "color-one": {
      category: "Окрашивание",
      title: "Окрашивание в 1 тон",
      duration: "1 час 20 минут",
      price: "3 500 ₽",
      text: [
        "Выполняется с использованием брендов Matrix и Armalla.",
      ],
    },
    "color-tone": {
      category: "Окрашивание",
      title: "Тонирование волос",
      duration: "1 час",
      price: "3 500 ₽",
      text: [
        "Выполняется с использованием брендов Matrix и Armalla.",
      ],
    },
    "color-total": {
      category: "Окрашивание",
      title: "Тотал блонд (корни)",
      duration: "2,5 часа",
      price: "5 500 ₽",
      text: [
        "Выполняется с использованием брендов Matrix и Armalla.",
      ],
    },
    "color-remove": {
      category: "Окрашивание",
      title: "Смывка пигмента с волос",
      price: "от 7 000 ₽",
      text: [
        "Смывка снижает искусственный пигмент, если цвет нужно изменить или подготовить волосы к новому оттенку.",
        "Количество этапов зависит от исходного окрашивания. На консультации мастер оценивает, насколько бережно можно пройти этот путь.",
      ],
    },
    "perm-vertical": {
      category: "Завивка",
      title: "Вертикальная завивка, пайпинг",
      duration: "4 часа",
      price: "7 500 ₽",
      text: [
        "Техника создания выразительных и упругих локонов на длинные волосы. Благодаря этому методу накрутки завиток получается плотным, держится долго и выглядит максимально естественно.",
      ],
    },
    "perm-bio": {
      category: "Завивка",
      title: "Карвинг, биозавивка, корейская завивка",
      duration: "2,5 часа",
      price: "6 500 ₽",
      text: [
        "Данные виды завивки выбираются исходя из особенностей ваших волос. Состав бережно разрывает дисульфидные связи волос, благодаря чему получается мягкий завиток, который по истечении шести месяцев выпрямляется.",
      ],
    },
    "perm-men": {
      category: "Завивка",
      title: "Мужская завивка",
      duration: "2,5 часа",
      price: "от 5 000 ₽",
      text: [
        "Выполняется на длину волос от 10 см. Размер завитка зависит от длины и плотности волос.",
      ],
    },
    "keratin-straight": {
      category: "Кератиновые и восстановительные процедуры",
      title: "Кератиновое выпрямление волос",
      duration: "2 часа",
      price: "4 500 ₽",
      text: [
        "Процедура предназначена для выпрямления природных кудрей.",
      ],
    },
    "keratin-nano": {
      category: "Кератиновые и восстановительные процедуры",
      title: "Нанопластика",
      price: "5 000 ₽",
      text: [
        "Нанопластика — выравнивающая процедура для более гладкой и блестящей длины.",
        "Её часто выбирают, когда нужен спокойный эффект без чрезмерно жёсткого выпрямления. Результат зависит от исходных волос.",
      ],
    },
    "keratin-botox": {
      category: "Кератиновые и восстановительные процедуры",
      title: "Ботокс волос",
      duration: "2 часа",
      price: "4 500 ₽",
      text: [
        "Процедура предназначена для выпрямления слегка вьющихся волос.",
      ],
    },
    "keratin-cold": {
      category: "Кератиновые и восстановительные процедуры",
      title: "Холодная реконструкция волос",
      duration: "1 час",
      price: "3 500 ₽",
      text: [
        "Глубокое восстановление структуры волоса на молекулярном уровне без использования высоких температур. Процедура наполняет волосы необходимыми аминокислотами и протеинами, возвращая им силу, эластичность и здоровый блеск.",
      ],
    },
    "keratin-anti": {
      category: "Завивка",
      title: "Антихимия",
      duration: "2 часа",
      price: "5 000 ₽",
      text: [
        "Данная процедура предназначена для выпрямления химических кудрей. Структура волоса практически возвращается к первоначальному состоянию. По окончании выполняется уход за волосами в мойке.",
      ],
    },
    "care-peel": {
      category: "Уход",
      title: "Пилинг кожи головы",
      duration: "1 час",
      price: "1 500 ₽",
      text: [
        "Интенсивное очищение и обновление кожи головы. Улучшает доступ кислорода к фолликулам, стимулирует рост волос и помогает поддерживать чистоту кожи на более длительный срок.",
      ],
    },
    "care-volume": {
      category: "Завивка",
      title: "Прикорневой объём на начёс",
      duration: "2 часа",
      price: "от 4 500 ₽",
      text: [
        "Процедура предназначена для создания лёгкого объёма у корней. Эффект сохраняется в течение 3–4 месяцев.",
      ],
    },
  };

  const quizMap = {
    "cut-minimal": { title: "Женская стрижка", service: "cut-women", text: "Чистая форма без лишнего. Поддержим силуэт и покажем, как носить его дома." },
    "cut-classic": { title: "Женская стрижка", service: "cut-women", text: "Спокойная геометрия под ваше лицо. Самый точный вход в новый силуэт." },
    "cut-trend": { title: "Женская стрижка", service: "cut-women", text: "Актуальная форма, которую можно носить каждый день, а не только в день визита." },
    "cut-unknown": { title: "Женская стрижка", service: "cut-women", text: "Начнём с консультации и соберём силуэт, который вам подойдёт — без эксперимента вслепую." },
    "color-minimal": { title: "Тонирование волос", service: "color-tone", text: "Лёгкое обновление тона. Цвет свежее, без сложной перестройки." },
    "color-classic": { title: "Окрашивание в 1 тон", service: "color-one", text: "Ровный спокойный цвет. Для тех, кто хочет выглядеть собранно, а не громко." },
    "color-trend": { title: "Сложное окрашивание волос", service: "color-complex", text: "Более объёмный и выразительный оттенок с учётом исходного цвета и состояния волос." },
    "color-unknown": { title: "Сложное окрашивание волос", service: "color-complex", text: "Сначала разберёмся, нужен ли сложный цвет или достаточно ровного тона." },
    "perm-minimal": { title: "Карвинг, биозавивка, корейская завивка", service: "perm-bio", text: "Мягкая волна и живая текстура. Формат подберём на консультации." },
    "perm-classic": { title: "Вертикальная завивка, пайпинг", service: "perm-vertical", text: "Вертикальная волна и объём по длине. Форма остаётся понятной после студии." },
    "perm-trend": { title: "Вертикальная завивка, пайпинг", service: "perm-vertical", text: "Выразительный локон, который всё ещё можно носить в повседневном ритме." },
    "perm-unknown": { title: "Карвинг, биозавивка, корейская завивка", service: "perm-bio", text: "Посмотрим структуру волос и выберем завивку, которая вам ближе." },
    "care-minimal": { title: "Холодная реконструкция волос", service: "keratin-cold", text: "Спокойный уход без термовоздействия. Длина выглядит плотнее и мягче." },
    "care-classic": { title: "Кератиновое выпрямление волос", service: "keratin-straight", text: "Более гладкая и послушная длина. Укладка по утрам становится короче." },
    "care-trend": { title: "Нанопластика", service: "keratin-nano", text: "Выравнивание и блеск, если хочется заметного, но спокойного эффекта." },
    "care-unknown": { title: "Ботокс волос", service: "keratin-botox", text: "Уходовая процедура для плотности и мягкости. Решение уточним на консультации." },
  };

  const whenCopy = {
    today: "Если останется окно — подтвердим его после записи.",
    tomorrow: "Завтра подтвердим точное время в сервисе записи.",
    week: "Подберём слот на этой неделе.",
  };

  const onScroll = () => {
    header.classList.toggle("is-compact", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    menu.hidden = false;
    menu.classList.toggle("is-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (!open) {
      window.setTimeout(() => {
        if (!menu.classList.contains("is-open")) menu.hidden = true;
      }, 400);
    }
  };

  menuToggle.addEventListener("click", () => {
    setMenu(!menu.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((el) => {
    el.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight - 8);
    window.scrollTo({ top, behavior: "smooth" });
    setMenu(false);
  });

  const revealEls = [
    ...document.querySelectorAll("main .section-head, main .service-row, main .service-group, main .philosophy-copy, main .master, main .gallery-item, main .quiz-board, main .about-copy, main .adel-story, main .adel-card, main .adel-closing, main .adv-item, main .ig-grid, main .contacts-copy, main .booking-copy, main .timeline li, main .trust, main .masters-single"),
    ...document.querySelectorAll("main .img-reveal"),
  ];
  revealEls.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  const renderService = (id) => {
    const data = SERVICES[id];
    if (!data) return;
    document.getElementById("service-category").textContent = data.category;
    document.getElementById("service-title").textContent = data.title;
    const durationEl = document.getElementById("service-duration");
    if (durationEl) {
      durationEl.textContent = data.duration || "";
      durationEl.hidden = !data.duration;
    }
    document.getElementById("service-price").textContent = data.price;
    const box = document.getElementById("service-text");
    box.innerHTML = data.text.map((p) => "<p>" + p + "</p>").join("");
    document.getElementById("service-book").href = BOOKING_URL;
  };

  const openService = (id) => {
    if (!SERVICES[id]) return;
    renderService(id);
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("panel-open");
  };

  const closeService = () => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("panel-open");
  };

  document.querySelectorAll(".js-open-service").forEach((btn) => {
    btn.addEventListener("click", () => openService(btn.dataset.service));
  });

  panel.querySelectorAll(".js-close-service").forEach((el) => {
    el.addEventListener("click", closeService);
  });

  const deepLink = new URLSearchParams(window.location.search).get("section") || window.location.hash.replace("#", "");
  if (deepLink) {
    const target = document.getElementById(deepLink);
    if (target && !target.hidden) {
        window.setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight - 8);
          window.scrollTo({ top, behavior: "auto" });
        }, 400);
    }
  }

  if (galleryEmpty) {
    galleryEmpty.hidden = document.querySelectorAll("#gallery .gallery-item").length > 0;
  }
  if (document.querySelectorAll("#gallery .gallery-item").length) {
    document.getElementById("gallery").classList.add("has-items");
  }

  let visibleWorks = galleryItems;
  let currentIndex = 0;

  const renderLightbox = (index) => {
    if (!visibleWorks.length) return;
    currentIndex = (index + visibleWorks.length) % visibleWorks.length;
    const item = visibleWorks[currentIndex];
    const img = item.querySelector("img");
    if (!img) return;
    document.getElementById("lightbox-img").src = img.src;
    document.getElementById("lightbox-img").alt = img.alt;
    document.getElementById("lightbox-title").textContent = item.dataset.title || "";
    document.getElementById("lightbox-meta").textContent = [item.dataset.master, item.dataset.service].filter(Boolean).join(" · ");
  };

  const openLightbox = (items, index) => {
    visibleWorks = items.filter((el) => !el.classList.contains("is-hidden"));
    if (!visibleWorks.length) return;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    renderLightbox(index);
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const group = [...(item.closest(".gallery") || document).querySelectorAll(".gallery-item")];
      const visible = group.filter((el) => !el.classList.contains("is-hidden"));
      openLightbox(visible, visible.indexOf(item));
    });
  });

  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => renderLightbox(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => renderLightbox(currentIndex + 1));

  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      document.querySelectorAll("#gallery .gallery-item").forEach((item) => {
        item.classList.toggle("is-hidden", filter !== "all" && item.dataset.cat !== filter);
      });
    });
  });

  const compare = document.getElementById("ba-compare");
  const wrap = document.getElementById("ba-before-wrap");
  const handle = document.getElementById("ba-handle");
  if (compare && wrap && handle && !document.getElementById("before-after").hidden) {
    let dragging = false;
    const setSplit = (percent) => {
      const p = Math.min(96, Math.max(4, percent));
      wrap.style.right = 100 - p + "%";
      handle.style.left = p + "%";
      handle.setAttribute("aria-valuenow", String(Math.round(p)));
    };
    const fromEvent = (event) => {
      const rect = compare.getBoundingClientRect();
      const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
      setSplit((x / rect.width) * 100);
    };
    compare.addEventListener("pointerdown", (event) => {
      dragging = true;
      compare.setPointerCapture(event.pointerId);
      fromEvent(event);
    });
    compare.addEventListener("pointermove", (event) => {
      if (dragging) fromEvent(event);
    });
    compare.addEventListener("pointerup", () => {
      dragging = false;
    });
    handle.addEventListener("keydown", (event) => {
      const now = Number(handle.getAttribute("aria-valuenow") || 50);
      if (event.key === "ArrowLeft") setSplit(now - 4);
      if (event.key === "ArrowRight") setSplit(now + 4);
    });
  }

  const reviews = [...document.querySelectorAll(".review")];
  const dots = document.getElementById("rev-dots");
  let revIndex = 0;
  reviews.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Отзыв " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => showReview(i));
    dots.appendChild(dot);
  });

  const showReview = (index) => {
    revIndex = (index + reviews.length) % reviews.length;
    reviews.forEach((el, i) => el.classList.toggle("is-active", i === revIndex));
    [...dots.children].forEach((el, i) => el.classList.toggle("is-active", i === revIndex));
  };

  document.getElementById("rev-prev").addEventListener("click", () => showReview(revIndex - 1));
  document.getElementById("rev-next").addEventListener("click", () => showReview(revIndex + 1));

  let revTimer = window.setInterval(() => showReview(revIndex + 1), 7000);
  document.getElementById("carousel").addEventListener("pointerenter", () => window.clearInterval(revTimer));
  document.getElementById("carousel").addEventListener("pointerleave", () => {
    revTimer = window.setInterval(() => showReview(revIndex + 1), 7000);
  });

  const answers = {};
  const resultBox = document.getElementById("quiz-result");

  const goStep = (n) => {
    document.querySelectorAll(".quiz-step").forEach((step) => {
      step.classList.toggle("is-active", Number(step.dataset.step) === n);
    });
  };

  document.querySelectorAll(".quiz-options button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const value = btn.dataset.value;
      answers[key] = value;
      btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");

      const step = Number(btn.closest(".quiz-step").dataset.step);
      if (step < 3) {
        window.setTimeout(() => goStep(step + 1), 180);
        return;
      }

      const rec = quizMap[answers.change + "-" + answers.style] || quizMap["cut-classic"];
      document.getElementById("quiz-title").textContent = rec.title;
      document.getElementById("quiz-text").textContent = rec.text;
      document.getElementById("quiz-when").textContent = whenCopy[answers.when] || "";
      const cta = document.getElementById("quiz-cta");
      cta.dataset.service = rec.service;
      document.querySelectorAll(".quiz-step").forEach((s) => s.classList.remove("is-active"));
      resultBox.hidden = false;
    });
  });

  document.getElementById("quiz-reset").addEventListener("click", () => {
    resultBox.hidden = true;
    Object.keys(answers).forEach((k) => delete answers[k]);
    document.querySelectorAll(".quiz-options button").forEach((b) => b.classList.remove("is-selected"));
    goStep(1);
  });

  document.querySelectorAll("[data-photo]").forEach((img) => {
    const probe = new Image();
    probe.onload = () => {
      img.src = img.dataset.photo;
    };
    probe.src = img.dataset.photo;
  });

  if (lightbox) {
    let touchX = 0;
    lightbox.addEventListener("touchstart", (event) => {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (event) => {
      const dx = event.changedTouches[0].clientX - touchX;
      if (dx > 40) renderLightbox(currentIndex - 1);
      if (dx < -40) renderLightbox(currentIndex + 1);
    }, { passive: true });
  }

  const serviceLink = new URLSearchParams(window.location.search).get("service");
  if (serviceLink && SERVICES[serviceLink]) {
    window.setTimeout(() => openService(serviceLink), 120);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      if (lightbox && !lightbox.hidden && event.key === "ArrowLeft") renderLightbox(currentIndex - 1);
      if (lightbox && !lightbox.hidden && event.key === "ArrowRight") renderLightbox(currentIndex + 1);
      return;
    }
    if (lightbox && !lightbox.hidden) closeLightbox();
    else if (panel.classList.contains("is-open")) closeService();
    else if (menu.classList.contains("is-open")) setMenu(false);
  });
})();
