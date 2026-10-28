/* =========================================================
   无人之境 · 页面交互
   ---------------------------------------------------------
   评论使用 giscus（GitHub Discussions）。填写下方配置后，
   将 enabled 改为 true，即可启用 GitHub 登录评论。
   ========================================================= */

window.SITE_CONFIG = {
  giscus: {
    enabled: false,
    repo: "",              // 例如 "yourname/your-repo"
    repoId: "",            // 例如 "R_kgDO..."
    category: "Comments",  // Discussions 分类名称
    categoryId: "",        // 例如 "DIC_kwDO..."
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
  setupGiscus();
  setupReveal();
})();
