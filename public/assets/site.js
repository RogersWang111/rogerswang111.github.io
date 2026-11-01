/* =========================================================
   无人之境 · 页面交互
   ---------------------------------------------------------
   评论使用 giscus（GitHub Discussions）。填写下方配置后，
   将 enabled 改为 true，即可启用 GitHub 登录评论。
   ========================================================= */

window.SITE_CONFIG = {
 giscus: {
  enabled: true,
  repo: "RogersWang111/rogerswang111.github.io",
  repoId: "R_kgDOVZQ1lQ",       // 换成 giscus.app 给你的
  category: "Comments",
  categoryId: "DIC_kwDOVZQ1lc4DKIJF", // 换成 giscus.app 给你的
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  inputPosition: "top",
  theme: "light",
  lang: "zh-CN"
}
};

(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupStatusPagination() {
    var feed = document.querySelector("[data-status-feed]");
    var pager = document.querySelector("[data-status-pager]");
    if (!feed || !pager) return;

    var entries = Array.prototype.slice.call(feed.querySelectorAll(".status-entry"));
    var pageSize = 5;
    var pageCount = Math.ceil(entries.length / pageSize);
    var page = 0;
    var prev = pager.querySelector("[data-status-prev]");
    var next = pager.querySelector("[data-status-next]");
    var label = pager.querySelector("[data-status-page]");

    if (pageCount <= 1) {
      pager.hidden = true;
      entries.forEach(function (entry) {
        entry.classList.add("is-visible");
      });
      return;
    }

    pager.hidden = false;

    function render() {
      entries.forEach(function (entry, index) {
        var visible = Math.floor(index / pageSize) === page;
        entry.hidden = !visible;
        if (visible) entry.classList.add("is-visible");
      });

      label.textContent =
        String(page + 1).padStart(2, "0") + " / " + String(pageCount).padStart(2, "0");
      prev.disabled = page === 0;
      next.disabled = page === pageCount - 1;
    }

    prev.addEventListener("click", function () {
      if (page > 0) {
        page -= 1;
        render();
      }
    });

    next.addEventListener("click", function () {
      if (page < pageCount - 1) {
        page += 1;
        render();
      }
    });

    render();
  }

  function setupWechatQr() {
    var open = document.querySelector("[data-wechat-open]");
    var modal = document.querySelector("[data-wechat-modal]");
    if (!open || !modal) return;

    var close = modal.querySelector("[data-wechat-close]");
    var lastFocus = null;

    function closeModal() {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocus) lastFocus.focus();
    }

    function openModal() {
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      if (close) close.focus();
    }

    open.addEventListener("click", openModal);
    if (close) close.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  function setupGiscus() {
    var mount = document.getElementById("giscus-container");
    if (!mount) return;

    var placeholder = document.getElementById("comments-placeholder");
    var giscus = config.giscus || {};
    var fields = [giscus.repo, giscus.repoId, giscus.category, giscus.categoryId];
    var isConfigured = giscus.enabled && fields.every(function (value) {
      return typeof value === "string" && value.trim() && value.indexOf("YOUR_") === -1;
    });

    if (!isConfigured) {
      return;
    }

    if (placeholder) placeholder.hidden = true;
    mount.innerHTML = '<div class="comment-loader">正在连接 GitHub Discussions…</div>';

    var script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    var attributes = {
      "data-repo": giscus.repo,
      "data-repo-id": giscus.repoId,
      "data-category": giscus.category,
      "data-category-id": giscus.categoryId,
      "data-mapping": giscus.mapping || "pathname",
      "data-strict": giscus.strict || "0",
      "data-reactions-enabled": giscus.reactionsEnabled || "1",
      "data-emit-metadata": "0",
      "data-input-position": giscus.inputPosition || "top",
      "data-theme": giscus.theme || "light",
      "data-lang": giscus.lang || "zh-CN",
      "data-loading": "lazy"
    };

    Object.keys(attributes).forEach(function (name) {
      script.setAttribute(name, attributes[name]);
    });

    script.addEventListener("error", function () {
      mount.innerHTML =
        '<div class="comment-loader">GitHub 评论加载失败，请检查网络后刷新页面。</div>';
    });

    mount.replaceChildren(script);
  }

  setupHeader();
  setupStatusPagination();
  setupWechatQr();
  setupGiscus();
  setupReveal();
})();
