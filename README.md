# 纸间

本地优先的中文 iOS 风格日记应用。奶油纸色、软墨字感，把日子写在纸间。

技术栈：**Expo (SDK 57) · TypeScript · Expo Router · AsyncStorage**

仓库：https://github.com/Gantenks/zhijian

---

## 功能

- **时间线**：大标题首页、日记卡片、下拉刷新、左滑删除
- **写 / 编辑**：标题、正文、五档心情、标签、日期
- **详情**：完整阅读，支持编辑与删除
- **日历**：月视图圆点标记，按日浏览与补写
- **搜索**：关键词 + 心情 + 标签筛选
- **设置**：纸感浅色 / 墨色深色 / 跟随系统；恢复示例数据
- **本地优先**：无账号、无后端；数据存于设备 AsyncStorage
- **中文 UI** + 预置示例日记

竞品研究与设计简报见 [RESEARCH.md](./RESEARCH.md)。

---

## 环境要求

- Node.js 20.19+（推荐 20.19.4 或 22 LTS）
- npm 9+
- iOS：Expo Go（App Store）或模拟器
- Android：Expo Go 或模拟器
- Web：现代浏览器

---

## 快速开始

```bash
git clone https://github.com/Gantenks/zhijian.git
cd zhijian
npm install
npx expo start
```

启动后：

| 方式 | 操作 |
|------|------|
| **Expo Go（真机）** | 用 Expo Go 扫描终端二维码 |
| **iOS 模拟器** | 按 `i` |
| **Android 模拟器** | 按 `a` |
| **Web** | 按 `w`，或执行 `npx expo start --web` |

单独脚本：

```bash
npm run web      # Web
npm run ios      # iOS（需 macOS）
npm run android  # Android
```

---

## 项目结构

```
app/                 # Expo Router 路由（薄 UI）
  (tabs)/            # 时间线 · 日历 · 搜索 · 设置
  entry/             # 详情 / 编辑
features/
  diary/             # 日记领域：类型、存储、Context、组件
  paper/             # 纸感主题与大标题
lib/                 # 纯工具：日期、id
android/             # Expo prebuild 原生工程（可 assembleRelease）
docs/download.html   # 纸感 APK 下载页
docs/COS_UPLOAD.md   # 上传到 apk.dmxczx.top 步骤
RESEARCH.md          # 竞品与设计简报
```

---

## 设计要点

- 默认主题：Cream `#F7F1E8` + Ink `#2C2416` + Accent `#8B6914`
- 导航：底部四 Tab，编辑页以 Modal 呈现
- 安全区、大标题、圆角卡片、轻阴影，贴近 iOS 观感

---

## 许可

Private repository · © Gantenks
