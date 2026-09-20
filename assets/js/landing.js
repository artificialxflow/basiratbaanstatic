(function () {
  const menuBtn = document.getElementById("menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const toast = document.getElementById("toast");
  const form = document.getElementById("consult-form");

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add("hidden");
    document.body.classList.remove("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    mobileNav.classList.remove("hidden");
    document.body.classList.add("nav-open");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      const open = !mobileNav.classList.contains("hidden");
      if (open) closeMenu();
      else openMenu();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden", "bg-emerald-700", "bg-rose-700");
    toast.classList.add(isError ? "bg-rose-700" : "bg-emerald-700", "toast-enter");
    setTimeout(function () {
      toast.classList.add("hidden");
    }, 3200);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const fields = ["name", "org", "email", "phone", "topic", "message"];
      let valid = true;
      fields.forEach(function (id) {
        const el = document.getElementById(id);
        const err = document.getElementById(id + "-error");
        if (!el) return;
        const empty = !String(el.value || "").trim();
        if (empty) {
          valid = false;
          el.classList.add("border-rose-500");
          if (err) err.classList.remove("hidden");
        } else {
          el.classList.remove("border-rose-500");
          if (err) err.classList.add("hidden");
        }
      });
      if (!valid) {
        showToast("لطفاً همه فیلدهای الزامی را تکمیل کنید.", true);
        return;
      }
      form.reset();
      showToast("درخواست مشاوره ثبت شد. به‌زودی با شما تماس می‌گیریم.");
    });
  }
})();
