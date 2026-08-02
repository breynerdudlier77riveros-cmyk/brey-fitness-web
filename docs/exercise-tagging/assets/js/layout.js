// ── Shell compartido del Handbook ───────────────────────────────────────
// Cada página de módulo solo trae su contenido dentro de <article
// class="content" id="content">; este script arma topbar, sidebar,
// breadcrumbs, TOC ("en esta página") y la búsqueda. Vanilla JS, sin
// dependencias, sin build step — abre con doble clic en 5 años igual que hoy.
// Requiere que nav-data.js y search-index.js ya estén cargados antes.

(function () {
  const pageId = document.body.dataset.page || "";
  const depth = document.body.dataset.depth || "../../"; // desde modules/XX/ hacia docs/exercise-tagging/ (raíz del handbook)

  function svgIcon(path) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }
  const ICON_SEARCH = svgIcon('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>');
  const ICON_MENU = svgIcon('<path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>');

  // ── Topbar ─────────────────────────────────────────────────────────
  function renderTopbar() {
    const mount = document.getElementById("topbar-mount");
    if (!mount) return;
    mount.innerHTML = `
      <div class="topbar">
        <button class="topbar__menu-btn" id="menu-btn" aria-label="Abrir navegación">${ICON_MENU}</button>
        <a class="topbar__brand" href="${depth}modules/00-introduccion/index.html">
          <span class="topbar__brand-dot"></span>
          BREY <span class="topbar__brand-sub">Exercise Tagging Handbook</span>
        </a>
        <div class="topbar__search">
          <span class="topbar__search-icon">${ICON_SEARCH}</span>
          <input id="search-input" type="text" placeholder="Buscar en el handbook…" autocomplete="off" />
          <span class="topbar__search-kbd">/</span>
          <div class="topbar__results" id="search-results"></div>
        </div>
        <span class="topbar__version">v1.0</span>
      </div>`;
  }

  // ── Sidebar ────────────────────────────────────────────────────────
  function renderSidebar() {
    const mount = document.getElementById("sidebar-mount");
    if (!mount) return;
    let html = `<nav class="sidebar" id="sidebar">`;
    BREY_NAV.forEach((group) => {
      html += `<div class="sidebar__group"><div class="sidebar__group-label">${group.group}</div>`;
      group.items.forEach((item) => {
        const active = item.id === pageId ? " is-active" : "";
        html += `<a class="sidebar__link${active}" href="${item.path}"><span class="sidebar__link-num">${item.num}</span>${item.title}</a>`;
      });
      html += `</div>`;
    });
    html += `</nav><div class="sidebar__backdrop" id="sidebar-backdrop"></div>`;
    mount.innerHTML = html;

    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const menuBtn = document.getElementById("menu-btn");
    function closeSidebar() {
      sidebar.classList.remove("is-open");
      backdrop.classList.remove("is-open");
    }
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("is-open");
        backdrop.classList.toggle("is-open");
      });
    }
    backdrop.addEventListener("click", closeSidebar);
  }

  // ── Breadcrumbs ────────────────────────────────────────────────────
  function renderBreadcrumbs() {
    const mount = document.getElementById("breadcrumbs-mount");
    if (!mount) return;
    const meta = BREY_NAV_FLAT[pageId];
    if (!meta) return;
    mount.innerHTML = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="${depth}modules/00-introduccion/index.html">Handbook</a>
        <span>/</span>
        <span>${meta.group}</span>
        <span>/</span>
        <span class="breadcrumbs__current">${meta.title}</span>
      </nav>`;
  }

  // ── TOC "en esta página" — escanea los h2 reales, nunca se desincroniza
  function renderTOC() {
    const mount = document.getElementById("toc-mount");
    const content = document.getElementById("content");
    if (!mount || !content) return;
    const headings = Array.from(content.querySelectorAll("h2"));
    if (headings.length === 0) return;
    let html = `<div class="toc__label">En esta página</div>`;
    headings.forEach((h, i) => {
      if (!h.id) h.id = "s" + i;
      html += `<a class="toc__link" data-target="${h.id}" href="#${h.id}">${h.textContent}</a>`;
    });
    mount.innerHTML = html;

    const links = Array.from(mount.querySelectorAll(".toc__link"));
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const link = mount.querySelector(`[data-target="${entry.target.id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
              links.forEach((l) => l.classList.remove("is-active"));
              link.classList.add("is-active");
            }
          });
        },
        { rootMargin: "-90px 0px -70% 0px" }
      );
      headings.forEach((h) => observer.observe(h));
    }
  }

  // ── Búsqueda ───────────────────────────────────────────────────────
  function initSearch() {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    if (!input || !results || typeof BREY_SEARCH_INDEX === "undefined") return;
    let activeIndex = -1;
    let currentMatches = [];

    function renderResults(matches) {
      currentMatches = matches;
      activeIndex = -1;
      if (matches.length === 0) {
        results.innerHTML = `<div class="topbar__results-empty">Sin resultados</div>`;
        results.classList.add("is-open");
        return;
      }
      results.innerHTML = matches
        .slice(0, 12)
        .map(
          (m, i) => `
        <a class="topbar__result" data-href="${depth}${m.url}" data-i="${i}">
          <div class="topbar__result-title">${m.title}</div>
          <div class="topbar__result-meta">${m.module}</div>
        </a>`
        )
        .join("");
      results.classList.add("is-open");
    }

    function search(query) {
      const q = query.trim().toLowerCase();
      if (q.length < 2) {
        results.classList.remove("is-open");
        return;
      }
      const matches = BREY_SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.module.toLowerCase().includes(q) ||
          (item.keywords && item.keywords.toLowerCase().includes(q))
      );
      renderResults(matches);
    }

    input.addEventListener("input", (e) => search(e.target.value));
    input.addEventListener("keydown", (e) => {
      const items = Array.from(results.querySelectorAll(".topbar__result"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
      } else if (e.key === "Enter") {
        if (items[activeIndex]) window.location.href = items[activeIndex].dataset.href;
        return;
      } else if (e.key === "Escape") {
        results.classList.remove("is-open");
        input.blur();
        return;
      } else return;
      items.forEach((it, i) => it.classList.toggle("is-active", i === activeIndex));
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
    });
    results.addEventListener("click", (e) => {
      const a = e.target.closest(".topbar__result");
      if (a) window.location.href = a.dataset.href;
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".topbar__search")) results.classList.remove("is-open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== input && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        input.focus();
      }
    });
  }

  function initBackTop() {
    const btn = document.createElement("button");
    btn.className = "back-top";
    btn.setAttribute("aria-label", "Volver arriba");
    btn.innerHTML = svgIcon('<path d="m4.5 15.75 7.5-7.5 7.5 7.5"/>');
    document.body.appendChild(btn);
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderTopbar();
    renderSidebar();
    renderBreadcrumbs();
    renderTOC();
    initSearch();
    initBackTop();
    if (typeof mermaid !== "undefined") {
      mermaid.initialize({
        startOnLoad: true,
        theme: "dark",
        themeVariables: {
          background: "#0a1120",
          primaryColor: "#1a2436",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#f97316",
          lineColor: "rgba(255,255,255,0.35)",
          secondaryColor: "#0a1120",
          tertiaryColor: "#0a1120",
          fontFamily: "ui-monospace, monospace",
          fontSize: "13px",
        },
      });
    }
  });
})();
