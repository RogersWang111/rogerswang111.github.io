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
- Leaflet + OpenStreetMap（足迹地图）
- giscus（GitHub 登录评论）

`pnpm-workspace.yaml` 中的 `minimumReleaseAge: 0` 用于允许 CI 安装锁文件里刚发布的依赖，避免 pnpm 11 默认的 24 小时发布冷却期阻塞构建。依赖版本仍由 `pnpm-lock.yaml` 固定。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `content/site.json` | 网站标题、简介、GitHub / 公众号链接、SEO 描述等 |
| `content/about/about.md` | 个人介绍 |
| `content/projects/*.md` | 四个栏目（学习、收藏、足迹、随想）的标题与简介 |
| `content/entries/*.md` | 学习、收藏、随想的具体内容 |
| `content/places/*.md` | 足迹地点（经纬度、图片、感想） |
| `content/statuses/*.md` | 个人状态 |
| `src/pages/index.astro` | 首页模板 |
| `src/pages/study.astro` 等 | 四个栏目页 |
| `src/pages/[entry].astro` | 内容和足迹地点共用详情页模板 |
| `src/pages/footprint.astro` | 足迹地图页 |
| `src/layouts/` | 页面布局 |
| `src/components/` | 页头、页脚、栏目页和「别处」入口 |
| `public/assets/` | 样式、脚本、图片、地图与 favicon |
| `public/assets/vendor/leaflet/` | 本地 Leaflet 地图脚本 |
| `public/media/` | Pages CMS 上传的图片与文件 |
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
4. 在左侧编辑「网站设置」「个人介绍」「栏目设置」「内容」「足迹地点」「状态」。
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
- GitHub 主页链接
- 公众号二维码图片
- 公众号公开文章链接（可选）和公众号名称

修改标题后，首页会自动使用新的文字；标题第三个字仍然会使用蓝色强调。

公众号推荐使用二维码：上传后，「别处」里的公众号卡片可以点击，访客扫码关注。微信公众号后台的登录地址（带 `token` 的 `mp.weixin.qq.com/cgi-bin/...` 页面）不是公开链接，不能放在网站上——它只对已登录的后台会话有效，也会暴露登录凭据。二维码为空时才使用「公众号公开文章链接」；两者都为空则显示不可点击的「二维码待上传」卡片。

### 个人介绍

`content/about/about.md` 的正文可以通过 Pages CMS 的富文本编辑器填写。正文为空时，首页会显示「等待补充」的留白状态；填写后会自动替换为正文排版。

### 栏目设置

`content/projects/` 下每个 Markdown 文件对应首页四个栏目中的一个：

- `slug`：栏目标识，例如 `study`、`collection`、`footprint`、`thoughts`；创建后不要改。
- `title`、`english`：中文标题和英文名。
- `order`：栏目在首页的排序。
- `description`：栏目简介。
- `statusLine`：栏目页上的状态文字。

四个栏目分别是：学习、收藏、足迹、随想。栏目页和对应内容会自动关联。

### 学习、收藏、随想内容

`content/entries/` 下每个文件是一条内容，三个栏目共用同一种内容格式：

```md
---
category: study          # study / collection / thoughts
urlSlug: reading-notes   # 只用于生成文件名，小写英文、数字、短横线
title: 最近在读什么
date: 2026-11-01
summary: 一句话摘要，会显示在列表里。
cover: media/cover.jpg   # 可选
resources:               # 可选，附件
  - media/notes.pdf
draft: false
---

正文可以写文字、插入图片，也可以留空。
```

在 Pages CMS 的「内容」里新建条目，选择所属栏目，填写标题、日期、摘要，然后用富文本编辑器写正文。点击「附件」可以一次上传多个 PDF、ZIP 等文件；发布后，内容页底部会出现下载列表。

首页每个栏目显示最近三条；栏目页显示全部内容；点击标题进入内容页。

### 足迹与地图

`content/places/` 下每个文件是一处足迹：

```md
---
urlSlug: hangzhou
title: 杭州
location: 浙江 · 杭州
date: 2026-10-20
lat: 30.2741
lng: 120.1551
summary: 一句话说明。
cover: media/hangzhou.jpg  # 可选，封面
gallery:                   # 可选，图片集
  - media/hangzhou-01.jpg
  - media/hangzhou-02.jpg
draft: false
---

旅行感想可以写在这里。
```

`lat` / `lng` 是纬度和经度，例如上海约为 `31.23, 121.47`，杭州约为 `30.27, 120.15`。地图页分为「中国」和「世界」两页，用地图下方的左右箭头翻页；两个视图共用同一批地点，新增地点后会自动出现在地图和地点列表中。首页「足迹」里的「打开地图」进入地图页。点击蓝色标注会打开对应地点页，地点页显示封面、图片集、日期和正文。

地图底图使用 OpenStreetMap；如果外部瓦片暂时加载失败，会显示一张本地绘制的世界轮廓底图（Natural Earth），标注和地点列表仍然可用。

### 状态

`content/statuses/` 下每个文件就是一条状态：

```md
---
date: 2026-10-27
---

搬进新地方。无人之境，先从一片空白开始。
```

在 Pages CMS 中新建状态，填写日期和正文即可。`date` 决定排序；打开「草稿」后不会发布。首页状态一次显示 5 条，超过 5 条时会出现左右翻页按钮。

### 示例内容

仓库里保留了 3 条示例内容、2 个示例足迹和 6 条示例状态，方便你直接看到列表、详情页、附件和地图标记的效果。正式使用时，在 Pages CMS 中替换或删除它们即可。

### 图片与文件

在 Pages CMS 的图片字段或富文本编辑器中上传图片，文件会进入 `public/media/`，正文中使用相对路径 `media/xxx.jpg`。Astro 构建时会一并发布。

附件字段允许上传 PDF、ZIP 等文件，同样放在 `public/media/` 下。不要上传包含隐私信息的文件；这个仓库和网站都是公开的。

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

**内容页出现 404？**

检查内容条目的栏目和 `urlSlug` 是否为小写英文、数字或短横线，并确认构建日志中已经生成对应的 `.html` 文件。栏目页缺失时，检查 `content/projects/` 里是否仍有四个栏目文件。

**地图只显示轮廓，没有街道？**

地图底图来自 OpenStreetMap，需要浏览器能访问外部瓦片。网络较慢或被拦截时，会自动退回本地绘制的世界轮廓，标注、地点列表和详情页仍然可用。

**状态没有出现左右翻页？**

状态少于或等于 5 条时不会显示翻页按钮；新增到第 6 条后会自动出现。

**评论没有出现？**

确认 `public/assets/site.js` 中 `enabled` 为 `true`，四个 giscus 参数都已填写，且访问的是 GitHub Pages 地址而不是本地 `file://` 页面。

## 说明

所有内容都保存在 Git 仓库里，不依赖外部数据库。Pages CMS 只是编辑层；即使以后不再使用它，也可以直接编辑 `content/` 下的 Markdown/JSON 文件。
