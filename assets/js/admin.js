(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("sidebar-open");
  const closeBtn = document.getElementById("sidebar-close");
  const collapseBtn = document.getElementById("sidebar-collapse");
  const views = document.querySelectorAll("[data-view-panel]");
  const navLinks = document.querySelectorAll("[data-view]");
  const notifBtn = document.getElementById("notif-btn");
  const notifMenu = document.getElementById("notif-menu");
  const profileBtn = document.getElementById("profile-btn");
  const profileMenu = document.getElementById("profile-menu");
  const skeleton = document.getElementById("skeleton-overlay");
  const loginForm = document.getElementById("login-form");
  const charts = {};

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email");
      const pass = document.getElementById("login-password");
      const err = document.getElementById("login-error");
      if (!email.value.trim() || !pass.value.trim()) {
        if (err) err.classList.remove("hidden");
        return;
      }
      window.location.href = "admin.html";
    });
    return;
  }

  function closeMenus() {
    if (notifMenu) notifMenu.classList.add("hidden");
    if (profileMenu) profileMenu.classList.add("hidden");
  }

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("translate-x-full");
    if (overlay) overlay.classList.remove("hidden");
    document.body.classList.add("nav-open");
  }

  function closeSidebar() {
    if (!sidebar) return;
    if (window.innerWidth < 1024) {
      sidebar.classList.add("translate-x-full");
      if (overlay) overlay.classList.add("hidden");
      document.body.classList.remove("nav-open");
    }
  }

  if (openBtn) openBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", function () {
      sidebar.classList.toggle("lg:w-20");
      sidebar.classList.toggle("lg:w-72");
      document.querySelectorAll(".nav-label").forEach(function (el) {
        el.classList.toggle("lg:hidden");
      });
    });
  }

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      notifMenu.classList.toggle("hidden");
      if (profileMenu) profileMenu.classList.add("hidden");
    });
  }

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      profileMenu.classList.toggle("hidden");
      if (notifMenu) notifMenu.classList.add("hidden");
    });
  }

  document.addEventListener("click", closeMenus);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenus();
      closeSidebar();
    }
  });

  function showView(name) {
    views.forEach(function (panel) {
      panel.classList.toggle("hidden", panel.getAttribute("data-view-panel") !== name);
    });
    navLinks.forEach(function (link) {
      const active = link.getAttribute("data-view") === name;
      link.classList.toggle("bg-sky-700", active);
      link.classList.toggle("text-white", active);
      link.classList.toggle("text-slate-700", !active);
      link.classList.toggle("hover:bg-sky-50", !active);
    });
    closeSidebar();
    window.location.hash = name;
    setTimeout(function () {
      initCharts(name);
      resizeCharts();
    }, 50);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showView(link.getAttribute("data-view"));
    });
  });

  document.querySelectorAll("[data-jump]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showView(btn.getAttribute("data-jump"));
    });
  });

  document.querySelectorAll("[data-filter]").forEach(function (el) {
    el.addEventListener("change", function () {
      const note = el.closest("section")?.querySelector("[data-filter-note]");
      if (note) {
        note.classList.remove("hidden");
        note.textContent = "نمایش فیلترشده (داده ساختگی) — " + el.options[el.selectedIndex].text;
      }
    });
  });

  function chartDefaults() {
    Chart.defaults.font.family = "Vazirmatn, Tahoma, sans-serif";
    Chart.defaults.color = "#334155";
  }

  function makeLine(id, labels, data, color) {
    const canvas = document.getElementById(id);
    if (!canvas || charts[id]) return;
    charts[id] = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "مقدار",
          data: data,
          borderColor: color,
          backgroundColor: color + "33",
          fill: true,
          tension: 0.35,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  function makeBar(id, labels, a, b, ca, cb) {
    const canvas = document.getElementById(id);
    if (!canvas || charts[id]) return;
    charts[id] = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          { label: "سری ۱", data: a, backgroundColor: ca, borderRadius: 8 },
          { label: "سری ۲", data: b, backgroundColor: cb, borderRadius: 8 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", rtl: true, labels: { textAlign: "right" } } }
      }
    });
  }

  function makeDoughnut(id, labels, data, colors) {
    const canvas = document.getElementById(id);
    if (!canvas || charts[id]) return;
    charts[id] = new Chart(canvas, {
      type: "doughnut",
      data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", rtl: true } }
      }
    });
  }

  function makeRadar(id) {
    const canvas = document.getElementById(id);
    if (!canvas || charts[id]) return;
    charts[id] = new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["فروش", "مالی", "منابع انسانی", "عملیات", "رضایت مشتری", "نقدینگی"],
        datasets: [{
          label: "عملکرد سازمان",
          data: [82, 74, 68, 79, 71, 76],
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          borderColor: "#7c3aed",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { suggestedMin: 0, suggestedMax: 100 } }
      }
    });
  }

  function initCharts(view) {
    if (typeof Chart === "undefined") return;
    chartDefaults();
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];
    if (view === "sales") {
      makeLine("sales-trend", months, [420, 510, 480, 620, 590, 710], "#2563eb");
      makeDoughnut("sales-mix", ["محصول الف", "محصول ب", "خدمات", "سایر"], [38, 27, 22, 13], ["#2563eb", "#0ea5e9", "#38bdf8", "#94a3b8"]);
    }
    if (view === "finance") {
      makeBar("finance-bar", months, [180, 210, 190, 240, 230, 260], [140, 155, 160, 170, 165, 175], "#059669", "#fb7185");
      makeLine("finance-cash", months, [40, 55, 32, 70, 48, 88], "#059669");
    }
    if (view === "hr") {
      makeDoughnut("hr-units", ["فروش", "مالی", "عملیات", "پشتیبانی"], [42, 18, 31, 24], ["#d97706", "#f59e0b", "#fbbf24", "#fde68a"]);
      makeBar("hr-attend", months, [96, 94, 95, 93, 97, 96], [4, 6, 5, 7, 3, 4], "#d97706", "#fecaca");
    }
    if (view === "ceo") {
      makeRadar("ceo-radar");
    }
  }

  function resizeCharts() {
    Object.keys(charts).forEach(function (id) {
      charts[id].resize();
    });
  }

  if (skeleton) {
    setTimeout(function () {
      skeleton.classList.add("hidden");
    }, 700);
  }

  const initial = (window.location.hash || "#home").replace("#", "");
  const valid = ["home", "sales", "finance", "hr", "ceo", "settings"];
  showView(valid.indexOf(initial) >= 0 ? initial : "home");
})();
