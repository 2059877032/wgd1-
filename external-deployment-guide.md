# 将个人网站部署到 GitHub Pages 或 Vercel

## 先给结论

对于你当前这份个人网站，**推荐优先使用 Vercel**。它更适合 Vite + React 项目，部署时不需要处理 GitHub Pages 常见的“仓库子路径”问题；连接 GitHub 后，每次推送代码还会自动重新部署。[1][2]

> 你的网站目前在 Manus 环境中使用了 `/manus-storage/...` 资源路径来展示证书、PPT、主视觉等文件。这个路径依赖 Manus 的资源服务，**直接推送到 GitHub Pages 或 Vercel 后，图片、证书、PPT 可能无法加载**。因此，外部部署前必须先将这些资源迁移为可由目标平台访问的静态文件或公开资源链接。

| 方式 | 推荐度 | 适用场景 | 你需要注意的重点 |
|---|---:|---|---|
| Manus 内置发布 | 最高 | 只需获得作业访问链接 | 直接在项目管理界面发布；资源兼容性最好。 |
| Vercel | 高 | 需要 GitHub 项目与 `vercel.app` 链接 | 迁移 `/manus-storage` 资源；输出目录设为 `dist/public`。 |
| GitHub Pages | 中 | 老师特别希望看到 GitHub 仓库或 Pages 链接 | 除迁移资源外，还需处理仓库子路径 `base`。 |

## 0. 外部部署前必须做的准备

当前项目使用 Vite 构建，执行 `pnpm build` 后，静态页面输出在：

```text
dist/public/
```

这个目录包含可部署的 `index.html`、CSS 与 JavaScript bundle。但网站源代码中的若干图片和文件来自 `/manus-storage/...`，例如证书图片、PPT 封面、PPTX/PDF 和档案主视觉。外部平台不会提供该路径的代理服务。

外部部署前建议完成以下资源迁移：

1. 将网站使用的图片、证书、PPTX 和 PDF 收集到一个本地 `media/` 文件夹。
2. 将资源放入外部项目的静态目录，例如 Vite 项目中的 `client/public/media/`。
3. 将代码内的 `/manus-storage/文件名` 替换为 `/media/文件名`。如果使用 GitHub Pages 的仓库子路径，还应改为基于 Vite `BASE_URL` 的相对路径。
4. 重新运行 `pnpm build`，在本地检查证书、PPT 和图片是否仍可打开。

如果你希望保持当前项目不动，我也可以另做一份**外部部署专用副本**，将所有展示素材打包并替换资源地址。

## 1. 首选：部署到 Vercel

Vercel 对 Vite 项目有自动识别支持；连接 Git 仓库后，生产分支的提交会生成生产部署，其他分支或拉取请求可生成预览链接。[1][2]

### 第一步：将项目放到 GitHub

你可以在项目管理界面进入 **设置 → GitHub**，将代码导出为一个 GitHub 仓库；也可以下载整个项目 ZIP 后，在自己的电脑上解压并上传至新仓库。

仓库中应保留以下内容：

```text
client/
server/
shared/
package.json
pnpm-lock.yaml
vite.config.ts
```

不要只上传 `dist/public`，因为 Vercel 需要从源码执行构建。

### 第二步：在 Vercel 导入仓库

1. 打开 [Vercel](https://vercel.com/) 并使用 GitHub 登录。
2. 点击 **Add New → Project**。
3. 在 GitHub 仓库列表中找到你的个人网站仓库，点击 **Import**。
4. 在项目配置页使用以下设置：

| 配置项 | 建议值 |
|---|---|
| Framework Preset | `Vite` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist/public` |
| Node.js Version | `22.x` 或与你本地一致的版本 |

5. 点击 **Deploy**。
6. 部署完成后，Vercel 会给出类似 `https://你的项目名.vercel.app` 的访问链接。该链接就是作业提交时可填写的网址。

### 第三步：部署后检查

打开链接并逐一确认：首页图片、证书弹窗、PPT 在线查看、PPT 下载、小游戏试玩、电话/微信/邮箱联系入口是否正常。

如果只发现证书、PPT 或图片失效，通常说明还有 `/manus-storage/` 地址尚未迁移。请不要只修改页面文字；应将对应资源一起上传到 `client/public/media/` 并替换链接。

### 可选：处理未来的子页面

当前网站主要是单页结构，通常不需要额外路由配置。若以后增加独立路径，例如 `/projects/game`，可在项目根目录增加 `vercel.json`：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

这会让 Vercel 将 SPA 的深层链接交回 `index.html` 处理。[2]

## 2. 部署到 GitHub Pages

GitHub Pages 也可以部署 Vite 静态网站，但它要求通过 GitHub Actions 构建与发布，并且仓库站点通常运行在 `https://用户名.github.io/仓库名/` 这样的子路径下。[1]

### 第一步：决定网址形式

| 仓库名称 | 最终网址 | Vite 的 `base` |
|---|---|---|
| `用户名.github.io` | `https://用户名.github.io/` | `/` |
| `personal-portfolio` | `https://用户名.github.io/personal-portfolio/` | `/personal-portfolio/` |

若使用普通仓库名 `personal-portfolio`，请在 `vite.config.ts` 的 `defineConfig` 中增加：

```ts
export default defineConfig({
  base: "/personal-portfolio/",
  // 其余配置保持不变
})
```

其中 `personal-portfolio` 必须替换成你的真实仓库名。若仓库名是 `用户名.github.io`，则不需要加 `base`，默认 `/` 即可。[1]

> GitHub Pages 不提供 Manus 的 `/manus-storage` 服务。开始这一步之前，务必先完成“外部部署前必须做的准备”中的资源迁移。

### 第二步：新增 GitHub Actions 工作流

在仓库根目录新建文件：

```text
.github/workflows/deploy.yml
```

然后写入以下内容。注意：你的项目构建输出是 `dist/public`，不是 Vite 默认示例中的 `dist`。

```yaml
name: Deploy personal portfolio to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm build
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/public
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

### 第三步：开启 Pages

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中，把 **Source** 选择为 **GitHub Actions**。
3. 将上述文件提交并推送到 `main` 分支。
4. 打开仓库的 **Actions**，等待工作流变成绿色成功状态。
5. 在 **Settings → Pages** 中复制生成的网址，通常是：

```text
https://你的GitHub用户名.github.io/你的仓库名/
```

## 3. 如何选择

| 你的目标 | 建议 |
|---|---|
| 只需要最稳定、最快取得作业链接 | 使用 Manus 内置发布。 |
| 想让老师看到 GitHub 项目，同时获得简洁链接 | 选择 **Vercel**。 |
| 老师明确要求 GitHub Pages | 使用 **GitHub Pages**，并处理 `base` 与资源迁移。 |

就当前项目而言，**Vercel 是外部部署的较优选择**：它不需要 GitHub Pages 的仓库子路径配置；但仍必须先迁移 `/manus-storage` 资源。GitHub Pages 适合“代码必须公开在 GitHub、并明确要求 Pages”的场景。

## 4. 最终提交前检查清单

- [ ] 网站网址可在未登录的浏览器窗口打开。
- [ ] 首页图片、证书、PPT 封面和小游戏视觉正常显示。
- [ ] 证书查看、PPT 查看和小游戏外链均能打开。
- [ ] 手机浏览器中目录、身份书本和联系方式没有遮挡。
- [ ] 作业压缩包包含源码；若老师要求可运行 HTML，还包含完整构建目录而不只是单个 `index.html`。
- [ ] 在作业说明中写明：技术栈（React、TypeScript、Vite、Tailwind CSS）、公开网址和响应式适配情况。

## 参考资料

[1]: https://vite.dev/guide/static-deploy "Vite：部署静态站点"
[2]: https://vercel.com/docs/frameworks/frontend/vite "Vercel：Vite 项目部署"
