/* =========================================================
   无人之境 · 站点配置与交互
   ---------------------------------------------------------
   1. 修改下方 statuses，即可更新首页「个人状态」
   2. 填写 giscus 配置，即可启用 GitHub 登录评论
   ========================================================= */

window.SITE_CONFIG = {
  statuses: [
    {
      date: "2026-10-27",
      text: "搬进新地方。无人之境，先从一片空白开始。"
    },
    {
      date: "2026-10-24",
      text: "「学习」「收藏」「足迹」「随想」四个房间已经收拾出来，之后会慢慢往里放东西。"
    },
    {
      date: "2026-10-18",
      text: "若你喜欢怪人，其实我很美。这句话放在这里，当作门牌。"
    }
  ],

  giscus: {
    // 填写完成后，将 enabled 改为 true，评论才会加载。
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
  var statuses = Array.isArray(config.statuses) ? config.statuses : [];

  function formatDate(value) {
    var parts = String(value || "").split("-");
    if (parts.length !== 3) return value || "";
    return parts[0] + "." + parts[1] + "." + parts[2];
  }

  function renderStatuses() {
    var feed = document.querySelector("[data-status-feed]");
    var count = document.querySelector("[data-status-count]");
    if (!feed) return;

    if (count) {
      count.textContent = String(statuses.length).padStart(2, "0");
    }

    if (!statuses.length) {
      var empty = document.createElement("p");
      empty.className = "status-empty";
      empty.textContent = "还没有发布状态。";
      feed.appendChild(empty);
      return;
    }

    statuses.forEach(function (status, index) {
      var entry = document.createElement("article");
      entry.className = "status-entry reveal" + (index === 0 ? " is-latest" : "");
      entry.style.setProperty("--delay", Math.min(index * 90, 270) + "ms");

      var meta = document.createElement("div");
      meta.className = "status-meta";

      var time = document.createElement("time");
      time.dateTime = status.date || "";
      time.textContent = formatDate(status.date);

      var number = document.createElement("span");
      number.className = "status-no";
      number.textContent = "NO. " + String(statuses.length - index).padStart(3, "0");

      var text = document.createElement("p");
      text.className = "status-text";
      text.textContent = status.text || "";

      meta.appendChild(time);
      meta.appendChild(number);
      entry.appendChild(meta);
      entry.appendChild(text);
      feed.appendChild(entry);
    });
  }

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

  function setupFooter() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  renderStatuses();
  setupHeader();
  setupGiscus();
  setupReveal();
  setupFooter();
})();
