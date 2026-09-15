/**
 * MONO STUDIO — слой записи.
 * Сейчас работает demo-адаптер (без backend).
 * Чтобы подключить сервис — задайте MonoBooking.use('telegram') и реализуйте адаптер.
 *
 * Доступные слоты: demo | telegram | crm | sheets | supabase | email | whatsapp
 */
(function (global) {
  const STORAGE_KEY = "mono_bookings";

  function saveLocal(payload) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem("mono_last_booking", JSON.stringify(payload));
  }

  const adapters = {
    async demo(payload) {
      saveLocal(payload);
      console.info("[MONO][demo] заявка сохранена локально", payload);
      return { ok: true, channel: "demo" };
    },

    async telegram(payload) {
      // Пример: fetch('/api/telegram', { method: 'POST', body: JSON.stringify(payload) })
      throw new Error("Telegram-адаптер не подключён. Используйте demo или реализуйте POST на Bot API.");
    },

    async crm(payload) {
      throw new Error("CRM-адаптер не подключён.");
    },

    async sheets(payload) {
      throw new Error("Google Sheets адаптер не подключён.");
    },

    async supabase(payload) {
      throw new Error("Supabase-адаптер не подключён.");
    },

    async email(payload) {
      throw new Error("Email-адаптер не подключён.");
    },

    async whatsapp(payload) {
      throw new Error("WhatsApp-адаптер не подключён.");
    },
  };

  const MonoBooking = {
    active: "demo",
    adapters,

    use(name) {
      if (!adapters[name]) {
        throw new Error("Неизвестный адаптер: " + name);
      }
      this.active = name;
      return this;
    },

    register(name, fn) {
      adapters[name] = fn;
      return this;
    },

    async submit(formData) {
      const payload = {
        id: "mono_" + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        source: "site",
        name: String(formData.name || "").trim(),
        phone: String(formData.phone || "").trim(),
        service: formData.service || "",
        master: formData.master || "",
        date: formData.date || "",
        comment: formData.comment || "",
        package: formData.package || "",
      };

      const adapter = adapters[this.active] || adapters.demo;
      return adapter(payload);
    },
  };

  global.MonoBooking = MonoBooking;
})(window);
