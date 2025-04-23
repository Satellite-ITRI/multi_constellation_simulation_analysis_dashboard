# 專案交接文件：多星座模擬分析儀表板

## 專案簡介
本專案為「多星座模擬分析儀表板」，基於 Next.js 14 + TypeScript 開發，整合 Tailwind CSS、shadcn-ui、Zustand 狀態管理、Auth.js 驗證等技術，提供衛星星座模擬、資料查詢、管理與分析功能。

## 目錄結構說明

- `/app`：主要頁面與路由邏輯，包含模擬、參數設定、查詢、歷史紀錄等子模組。
    - `constellation_simulation/`：星座模擬主功能模組，含 service 及多層次子頁面。
    - `api/`：API 端點相關程式。
    - `globals.css`：全域樣式。
    - `layout.tsx`：全域佈局。
- `/components`：共用元件（UI、功能模組、彈窗、表單等），如 `base/`、`ui/`、`modal/` 等。
- `/constants`：專案常數、模擬參數、假資料等。
- `/hooks`：自訂 React hooks（如響應式、表單、多步驟流程等）。
- `/lib`：工具、狀態管理（如 `store.ts`）、表單 schema、搜尋參數等。
- `/public`：靜態資源（圖片、PDF 報告等）。
- `/types`：TypeScript 型別定義。

## 主要功能
- 星座模擬參數設定與執行
- Handover/Phase 歷史查詢、刪除、下載結果
- 多步驟表單、即時狀態顯示
- 角色驗證與權限管理
- 資料表格、搜尋、篩選、圖表分析

## 安裝與啟動
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 設定環境變數：
   - 複製 `env.example.txt` 為 `.env.local`，補齊必要設定。
3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

## 開發與維護注意事項
- 重要 service 檔案皆有註解，若需擴充 API，請參考 `/app/constellation_simulation/constellation/service.jsx` 範例。
- UI 元件建議放在 `/components/ui/`，可複用設計。
- 狀態管理統一使用 `/lib/store.ts`。
- 若有新模組，請於 README 補充。

## /app/constellation_simulation/input_format.ts 使用方法

`/app/constellation_simulation/input_format.ts` 為本專案所有「模擬參數表單」的欄位結構、驗證規則與預設值集中管理檔案。

### 功能說明
- 定義各種模擬情境（如覆蓋分析、ISL節能、路由評估等）所需的表單欄位格式與預設參數。
- 由 `SimulationForm` 等元件自動讀取 config，動態渲染對應欄位與驗證。
- 欄位型態、選項、驗證規則、顯示/隱藏等皆可於此集中調整。

### 使用方式
1. **新增/修改模擬表單欄位：**
   - 直接於本檔案新增或修改對應的 config 物件（如 `coverage_analysisCoverageConfig`）。
   - 每個 config 物件下的 `fields` 定義欄位細節，`defaultValues` 設定預設參數。
2. **表單元件自動對應：**
   - `SimulationForm` 會依據 config 內容自動產生欄位、驗證與預設值，無須於元件硬編欄位。
3. **欄位說明與註解：**
   - 本檔案已針對各 config 物件與型別定義加上詳細中文註解，方便理解與維護。

### 範例
```typescript
export const coverage_analysisCoverageConfig: PageConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [ ... ],
      gridSpan: 2
    },
    minLatitude: {
      label: '最小緯度',
      type: 'decimal',
      validation: { required: true, min: -90, max: 0 },
      gridSpan: 1
    },
    // ... 其他欄位
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    minLatitude: '-50',
    // ...
  }
};
```

### 注意事項
- 欄位型態支援：`select`、`number`、`text`、`decimal`。
- 若需動態顯示/隱藏欄位，可用 `show: false` 控制。
- 欲擴充新模擬情境，請依現有格式新增 export config。

---
