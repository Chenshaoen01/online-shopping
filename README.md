# 毛孩物坊 — 寵物用品購物網站（前台）

個人作品集專案，一個寵物用品購物網站的前台。使用者可以瀏覽商品、加入購物車、
選擇超商門市取貨、建立訂單並串接綠界（ECPay）付款。

- **線上 demo**：https://online-shopping-gules-pi.vercel.app
- **測試帳號**：可自行註冊，或使用 Google 登入

> 本網站僅為個人作品，無商業用途。付款流程使用綠界測試環境，不會產生實際交易。

---

## 專案組成

這個作品集由三個各自獨立的專案組成：

| 角色 | 儲存庫 | 技術 | 部署 |
|---|---|---|---|
| **前台（本專案）** | `online-shopping` | Next.js 14 App Router | Vercel |
| 後台管理 | `online-shopping-admin` | React 18 + CRA | Vercel |
| 後端 API | `online-shopping-api` | Express 4 + MySQL | Render |

圖片存放於 Cloudflare R2。

---

## 功能

- 首頁輪播、推薦商品、常見問答（皆由後台維護）
- 商品分類瀏覽、分頁、商品詳情與圖片燈箱
- 會員註冊 / 登入，以及 Google 登入（OAuth 2.0，ID token）
- 購物車：加入、刪除、下架商品提示
- 結帳：超商門市查詢（可依門市名稱或縣市 / 鄉鎮市區篩選）、收件人資料
- 訂單列表與明細、綠界付款導向
- 全站 RWD

---

## 本機啟動

需要 Node.js 18 以上。

```bash
npm install
cp .env.example .env.development   # 依實際環境調整內容
npm run dev
```

開啟 http://localhost:3010

> **注意 port 是 3010**，不是 Next.js 預設的 3000 —— 因為 3000 留給本機的 API 專案。

### 環境變數

| 變數 | 用途 |
|---|---|
| `NEXT_PUBLIC_API_URL` | 後端 API 位址 |
| `NEXT_PUBLIC_FILE_URL` | 圖片檔案位址（R2） |
| `NEXT_PUBLIC_SITE_URL` | 站台網址，供 sitemap 與 robots 產生絕對路徑 |

正式環境的值放在 `.env.production`（已納入版控），Vercel 會在建置時自動讀取。

### 其他指令

```bash
npm run build   # 產生正式版本
npm run start   # 以正式版本啟動（port 3010）
npm run lint    # ESLint（next/core-web-vitals）
```

---

## 專案結構

```
src/
├── api/                    共用的資料存取層
│   ├── client.js           瀏覽器端 fetch（自動帶 CSRF token、統一錯誤處理）
│   ├── server.js           Server Component 用（轉手 cookie、checkLogin）
│   └── files.js            圖片網址與 fallback
├── app/                    App Router
│   ├── layout.js           全站 layout 與 Provider
│   ├── loading.js          載入中畫面
│   ├── error.js            錯誤邊界
│   ├── not-found.js        404
│   ├── sitemap.js          動態產生 sitemap.xml
│   ├── robots.js           產生 robots.txt
│   └── ...                 各頁面（Server Component 取資料，Client Component 負責互動）
├── components/             跨頁面共用元件
│   ├── CartContext.js      購物車狀態
│   └── LoadingProvider.js  載入遮罩（計數式）
├── utils/                  純函式工具
└── middleware.js           未登入路由攔截
```

---

## 技術選型

| 選擇 | 理由 |
|---|---|
| **Next.js App Router** | 商品頁需要被搜尋引擎索引，Server Component 讓資料在伺服器端取得並直接輸出 HTML；`generateMetadata` 也能為每個商品產生各自的標題與 OG 標籤 |
| **手刻 CSS + Tailwind** | 想自己處理 RWD 斷點與版型，而不是套用現成 UI library 的樣式。Tailwind 只用來處理間距、排版這類重複性高的部分，元件外觀寫在 `globals.css` |
| **Swiper** | 輪播需求（首頁 banner、手機版商品列表），自行實作觸控與 loop 成本過高 |
| **MicroModal / AlertifyJS** | 燈箱與提示視窗，體積小、不綁定框架 |

---

## 設計取捨

以下幾點是刻意的選擇，而不是還沒做。

### API 走同源 rewrite，而不是直接跨網域呼叫

`next.config.mjs` 把 `/admin-api/:path*` 代理到 Render 上的 API：

```js
async rewrites() {
  return [{ source: '/admin-api/:path*', destination: 'https://<api-host>/:path*' }]
}
```

登入狀態是用 HttpOnly cookie 存 JWT。如果前台直接打跨網域的 API，cookie 必須設成
`SameSite=None; Secure` 才送得出去，還要處理 CORS 與各家瀏覽器對第三方 cookie 的限制。
透過 rewrite 讓瀏覽器眼中的 API 與前台同源，這些問題就不存在。

### 資料不做快取，維持 `cache: "no-cache"`

Next.js 的 `revalidate` 可以大幅減少 API 請求，也能避開 Render 免費方案的冷啟動。
但那會讓後台改動最多要等數分鐘才反映在前台，與這個專案「現場 demo、改了要馬上看得到」
的使用情境衝突，因此維持不快取。代價是 API 請求數較多、首次載入較慢。

### `csrfToken` 放在 `localStorage`

比較安全的做法是存在記憶體、重新整理後重新取得。這裡沒有這樣做，因為
JWT 本身在 HttpOnly cookie 裡，CSRF token 的作用是「證明請求來自本站頁面」——
即使外洩，攻擊者仍需要有辦法在本站執行腳本，而那個前提本身已經是更嚴重的問題。
後台專案採用相同結論。

### 只有 `<img>` 換成 `next/image`

版面主體（商品卡、購物車縮圖、首頁輪播）是用 CSS `background-image` 做等比裁切，
換成 `next/image` 等於重寫版型。因此只轉換了真正的 `<img>` 標籤。
其中 4 個 SVG 圖示使用 `unoptimized` —— SVG 是向量格式沒有壓縮空間，
而 Next.js 的圖片最佳化服務預設拒絕 SVG（可內嵌腳本），與其放寬安全設定不如直接跳過。

商品圖片燈箱也使用 `unoptimized`，理由不同：主圖是以 CSS `background-image` 顯示的原始網址，
燈箱若走最佳化服務會產生另一個網址，等於同一張圖下載兩次、而且點開時要等第二次下載完成。
維持同一個網址才能直接命中瀏覽器快取，點開即顯示。

### middleware 只檢查 cookie 是否存在

`middleware.js` 不呼叫 API 驗證 JWT，只確認 cookie 在不在。
middleware 不是安全邊界 —— 真正的驗證在 API 端，它只負責「明顯未登入就別讓他進來」
的快速攔截。JWT 過期的情況由 `apiFetch` 收到 401 / 403 後導回登入頁處理。
這樣每次進入購物車或訂單頁可以少一次 API 往返。

### `reactStrictMode` 維持 `false`

打開後 effect 在開發模式會執行兩次，用意是凸顯沒有 cleanup 的副作用。
專案中的輪詢洩漏與 hook 相依陣列問題已經另外清理過，開啟的邊際效益不高。

---

## SEO

- 每個商品頁透過 `generateMetadata` 產生自己的標題、描述與 OG 圖
- `sitemap.js` 動態產生，包含所有上架商品與分類頁（而非手動維護的靜態檔）
- `robots.js` 產生 `robots.txt`，排除購物車與訂單頁
- `<html lang="zh-Hant-TW">`
- 已完成 Google Search Console 驗證
