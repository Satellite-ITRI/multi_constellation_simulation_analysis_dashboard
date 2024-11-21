# 使用 Node.js v20.18.0 作為基礎鏡像
FROM node:20.18.0

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有源代碼
COPY . .

# 暴露端口 3000
EXPOSE 3000

# 啟動開發服務器
CMD ["npm", "run", "dev"]
