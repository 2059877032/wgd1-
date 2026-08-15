# 王果典个人在线简历

这是可部署到 GitHub Pages 的 Vite + React 静态网站版本。

## 本地运行

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

构建文件输出到 `dist/`。

## GitHub Pages

本仓库按 `wgd1-` 配置，发布地址为：

```text
https://2059877032.github.io/wgd1-/
```

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布。请先在仓库的 **Settings → Pages** 中将发布来源设置为 **GitHub Actions**。

所有证书、PPT、PDF 和图片已放在 `client/public/media/`，因此不依赖外部平台的内部资源路径。
