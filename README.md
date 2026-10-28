# 无人之境 · 汪荣杰的个人空间

一个使用 Astro 构建的静态个人网站。最终产物仍然是纯静态 HTML/CSS/JS，托管在 GitHub Pages；内容通过 [Pages CMS](https://pagescms.org/) 在浏览器里编辑，保存后自动提交、构建并发布。

## 工作方式

```text
Pages CMS 编辑
    ↓ 自动 commit
GitHub 仓库 content/
    ↓ push 到 main
GitHub Actions
    ↓ pnpm build
GitHub Pages
```

不需要下载代码或手动上传。每次保存都会生成一条 Git 提交，所以历史版本和回滚都在 GitHub 中。

## 技术栈

- Astro 5，静态输出
- pnpm
- Pages CMS
- GitHub Actions + GitHub Pages
- giscus（GitHub 登录评论）

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `content/site.json` | 网站标题、简介、SEO 描述等 |
| `content/about/about.md` | 个人介绍 |
| `content/projects/*.md` | 项目页面 |
| `content/statuses/*.md` | 个人状态 |
| `src/pages/index.astro` | 首页模板 |
| `src/pages/[slug].astro` | 项目详情页模板 |
| `src/layouts/` | 页面布局 |
| `src/components/` | 页头、页脚 |
| `public/assets/` | 样式、脚本、图片、favicon |
| `public/media/` | Pages CMS 上传的图片 |
| `.pages.yml` | Pages CMS 编辑配置 |
| `.github/workflows/deploy.yml` | GitHub Pages 自动部署 |

## 本地开发

需要 Node.js 20+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

浏览器打开终端提示的本地地址。

构建和预览生产版本：

```bash
pnpm build
pnpm preview
```

## 第一次部署到 GitHub Pages

1. 在 GitHub 创建一个**公开仓库**，将本目录提交并推送到 `main` 分支。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 推送一次提交，或在 **Actions** 页面手动运行 `Deploy to GitHub Pages`。
5. 部署完成后，Pages 会给出网站地址。

不要选择 **Deploy from a branch**，否则不会运行 Astro 构建。工作流默认监听 `main` 分支；如果你的默认分支是 `master`，需要同步修改 `.github/workflows/deploy.yml`。

## 使用 Pages CMS 编辑内容

1. 打开 <https://app.pagescms.org>，用 GitHub 登录。
2. 安装 Pages CMS 的 GitHub App，并授权给这个仓库。参考：[GitHub App 指南](https://pagescms.org/docs/guides/installing/github-app/)。
3. 选择仓库，Pages CMS 会读取根目录的 `.pages.yml`。
4. 在左侧编辑「网站设置」「个人介绍」「项目」「状态」。
5. 点击保存后，Pages CMS 会自动提交到 GitHub，GitHub Actions 随即重新构建并发布。

一般 1 分钟左右可以在网站上看到修改，具体取决于 GitHub Actions 和 Pages 的构建时间。

### 网站设置

`content/site.json` 管理：

- 主标题和英文副标题
- 空间名称
- 首屏短句
- 简介说明
- 页脚说明
- SEO 描述

修改标题后，首页会自动使用新的文字；标题第三个字仍然会使用蓝色强调。

### 个人介绍

`content/about/about.md` 的正文可以通过 Pages CMS 的富文本编辑器填写。正文为空时，首页会显示「等待补充」的留白状态；填写后会自动替换为正文排版。

### 项目

`content/projects/` 下每个 Markdown 文件对应一个项目页面，例如 `study.md` 会生成 `/study.html`。

- `slug`：网址标识，例如 `study`；创建后尽量不要修改。
- `title`、`english`：中文标题和英文名。
- `order`：在首页的排序。
- `description`：项目简介。
- `statusLine`、`updated`：页面上的状态信息。
- `body`：项目正文；为空时显示「这一页还空着」。

新增项目后会自动出现在首页，也会自动进入上一间/下一间的切换。

### 状态

`content/statuses/` 下每个文件就是一条状态：

```md
---
date: 2026-10-27
---

搬进新地方。无人之境，先从一片空白开始。
```

在 Pages CMS 中新建状态，填写日期和正文即可。`date` 决定排序；打开「草稿」后不会发布。

### 图片

在 Pages CMS 的富文本编辑器中上传图片，文件会进入 `public/media/`，正文中使用相对路径 `media/xxx.jpg`。Astro 构建时会一并发布。

## 开启 GitHub 评论（giscus）

页面底部的留言区使用 [giscus](https://giscus.app/zh-CN)，评论存储在 GitHub Discussions 中，访客用 GitHub 账号登录后评论。

1. 在公开仓库中开启 **Discussions**。
2. 创建一个分类，例如 `Comments`，类型选择 **Announcements**。
3. 安装 [giscus GitHub App](https://github.com/apps/giscus) 并授权该仓库。
4. 打开 <https://giscus.app/zh-CN>，填写仓库名、分类、路径映射 `pathname`、语言 `zh-CN`。
5. 复制页面给出的 `data-repo-id` 和 `data-category-id`。
6. 打开 `public/assets/site.js`，填写：

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

保存并部署后，留言区会替换为 GitHub 评论框。评论的审核、回复和删除都在 GitHub Discussions 中完成，不需要重新部署。

## 常见问题

**修改后网站没有变化？**

先看仓库的 **Actions** 页面。如果构建失败，打开对应步骤查看日志；如果构建成功，等待 Pages 部署完成并强制刷新浏览器缓存。

**GitHub Actions 没有运行？**

检查工作流监听的分支是否与仓库默认分支一致，以及 **Settings → Pages → Source** 是否已设为 **GitHub Actions**。

**项目页出现 404？**

检查项目的 `slug` 是否为小写英文、数字或短横线，并确认构建日志中已经生成对应的 `.html` 文件。

**评论没有出现？**

确认 `public/assets/site.js` 中 `enabled` 为 `true`，四个 giscus 参数都已填写，且访问的是 GitHub Pages 地址而不是本地 `file://` 页面。

## 说明

所有内容都保存在 Git 仓库里，不依赖外部数据库。Pages CMS 只是编辑层；即使以后不再使用它，也可以直接编辑 `content/` 下的 Markdown/JSON 文件。
