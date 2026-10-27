# 无人之境 · 汪荣杰的个人空间

一个纯静态的个人网站，使用 HTML、CSS 和 JavaScript 手写，无需构建工具。

## 页面结构

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：个人介绍、项目入口、个人状态、GitHub 留言 |
| `study.html` | 学习 |
| `collection.html` | 收藏 |
| `footprint.html` | 足迹 |
| `thoughts.html` | 随想 |
| `assets/style.css` | 全站样式 |
| `assets/site.js` | 状态渲染、giscus 评论加载、页面动效 |
| `assets/blue-print.jpg` | 首页与项目页使用的蓝色墨迹素材 |
| `assets/favicon.svg` | 网站图标 |

网站分为三个部分：**关于 / 项目 / 状态**。项目包含学习、收藏、足迹、随想四个独立页面。视觉上采用纸页、钴蓝墨迹和宋体小字，整体保持大量留白。

## 本地预览

直接双击 `index.html` 可以查看大部分内容，但 GitHub 评论在 `file://` 下无法正常工作。建议启动本地服务器：

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 修改个人介绍

打开 `index.html`，搜索「个人介绍内容待补充」。在 `about-blank` 区域中，把占位文字替换为你的个人介绍即可。

## 发布个人状态

状态数据位于 `assets/site.js` 顶部的 `statuses` 数组。每条状态格式如下：

```js
{
  date: "2026-10-27",
  text: "想说的话。"
}
```

数组按最新在前排列。修改并提交到 GitHub 后，重新部署即可更新。状态目前是静态内容，不提供网页端发布后台；评论则会实时同步到 GitHub，不需要重新部署。

## 开启 GitHub 登录评论（giscus）

评论使用 [giscus](https://giscus.app/zh-CN)，基于 GitHub Discussions。访客用 GitHub 账号登录后即可评论，你可以在 GitHub 的 Discussions 中管理和删除评论。

### 1. 准备仓库

1. 在 GitHub 创建一个**公开仓库**（GitHub Pages 也需要公开仓库，除非使用付费方案）。
2. 将本目录所有文件推送到仓库。
3. 打开仓库的 **Settings → General → Features**，勾选 **Discussions**。
4. 在 Discussions 中创建一个分类，名称例如 `Comments`，类型选择 **Announcements**。
5. 安装 giscus App：<https://github.com/apps/giscus>，并授权给这个仓库。

### 2. 获取配置

1. 打开 <https://giscus.app/zh-CN>。
2. 填写仓库名，选择刚创建的 `Comments` 分类。
3. 页面映射选择 **pathname**。
4. 主题选择 **light**，语言选择 **简体中文**。
5. 复制页面给出的 `data-repo-id` 和 `data-category-id`。

### 3. 填入站点

打开 `assets/site.js`，修改 `giscus` 配置：

```js
giscus: {
  enabled: true,
  repo: "你的用户名/仓库名",
  repoId: "R_xxxxxxxx",
  category: "Comments",
  categoryId: "DIC_xxxxxxxx",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  inputPosition: "top",
  theme: "light",
  lang: "zh-CN"
}
```

保存后重新部署。首页「说点什么」下方会出现 GitHub 登录与评论框。

> 注意：只填写仓库名是不够的，`repoId` 和 `categoryId` 也必须填写；同时 `enabled` 必须为 `true`。

### 4. 部署到 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Deploy from a branch**。
3. 选择 `main` 分支和 `/ (root)` 目录，保存。
4. 等 GitHub 生成网址后，访问该网址检查评论是否加载。

之后每次修改状态或文案，只需提交到 `main` 分支，GitHub Pages 会自动更新。

## 自定义

- 主色、字体、间距：修改 `assets/style.css` 顶部 `:root` 中的变量。
- 首页标题：搜索 `cover-title`。
- 蓝色墨迹：替换 `assets/blue-print.jpg`，或在 `assets/style.css` 中调整 `.ink-panel` 的背景。
- 项目列表与子页面：修改 `index.html` 中的 `.project-row` 和对应的 HTML 文件。
- 站点文案：`index.html` 和四个子页面中的页脚、描述。
