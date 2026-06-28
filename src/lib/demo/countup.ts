// Animación count-up al entrar en viewport. Reutilizada por LiveCounter y Comunidad.
// Atributos del elemento: data-count, data-to, data-locale, data-prefix?, data-compact="cop"?
export function initCountUp() {
  const els = document.querySelectorAll<HTMLElement>("[data-count]:not([data-done])");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      el.setAttribute("data-done", "1");
      const to = Number(el.dataset.to || "0");
      const locale = el.dataset.locale || "es-CO";
      const prefix = el.dataset.prefix || "";
      const compact = el.dataset.compact === "cop";
      const dur = 1300;
      const start = performance.now();
      const fmt = (n: number) => {
        if (compact) {
          const m = n / 1_000_000;
          return prefix + m.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + (locale.startsWith("es") ? " M" : "M");
        }
        return prefix + Math.round(n).toLocaleString(locale);
      };
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(to);
      };
      requestAnimationFrame(tick);
    }
  }, { rootMargin: "0px 0px -15% 0px" });
  els.forEach((el) => io.observe(el));
}
