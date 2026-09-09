# 纸间 APK → COS（apk.dmxczx.top）上传说明

## 产物

- 本地路径：`dist/zhijian-1.0.0.apk`（由 `assembleRelease` 复制而来）
- 目标公网 URL：`https://apk.dmxczx.top/zhijian-1.0.0.apk`
- 下载页：`docs/download.html`（纸感样式，按钮指向上述 URL）

## 上传步骤（有 COS 权限的同学）

与 Declutter 同一桶 / 同一 CDN 域名 `apk.dmxczx.top`：

```bash
# 示例：腾讯云 COSCLI（按团队实际配置替换桶名与地域）
coscli cp dist/zhijian-1.0.0.apk cos://<bucket-of-apk.dmxczx.top>/zhijian-1.0.0.apk
# 对象 ACL 需公有读（或桶策略允许匿名 GET）
```

或在腾讯云控制台：对象存储 → 对应桶 → 上传 `zhijian-1.0.0.apk` → 权限公有读。

上传后验证：

```bash
curl -I https://apk.dmxczx.top/zhijian-1.0.0.apk
# 期望 HTTP 200，Content-Type 含 apk/octet-stream
```

本构建环境无 COS SecretId/SecretKey，无法代传。


## 临时公网（已有）

仓库为 **private**，GitHub Release 资源需登录 Gantenks 账号或被授权协作者才能下载：

https://github.com/Gantenks/zhijian/releases/download/v1.0.0/zhijian-1.0.0.apk

手机端无登录时，请优先走 COS 公有读链接。本地产物：`dist/zhijian-1.0.0.apk`（约 99MB，已 apksigner 校验）。
