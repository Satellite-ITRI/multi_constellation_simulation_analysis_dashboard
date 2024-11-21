#!/bin/bash

# 設定容器名稱
CONTAINER_NAME="nextjs_dev_container"
IMAGE_NAME="nextjs_dev_image"
PORT=3000

# 顏色設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查是否存在舊容器並停止刪除
echo -e "${YELLOW}檢查並清理舊容器...${NC}"
if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
    echo "停止舊容器..."
    docker stop ${CONTAINER_NAME}
    echo "刪除舊容器..."
    docker rm ${CONTAINER_NAME}
fi

# 檢查是否存在舊鏡像並刪除
echo -e "${YELLOW}檢查並清理舊鏡像...${NC}"
if [ "$(docker images -q ${IMAGE_NAME})" ]; then
    echo "刪除舊鏡像..."
    docker rmi ${IMAGE_NAME}
fi

# 安裝依賴
echo -e "${YELLOW}安裝項目依賴...${NC}"
npm install

# 建立 Docker 鏡像
echo -e "${YELLOW}建立 Docker 鏡像...${NC}"
docker build -t ${IMAGE_NAME} .

# 運行容器
echo -e "${YELLOW}啟動開發容器...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:${PORT} \
    -v $(pwd):/app \
    -v /app/node_modules \
    --env NODE_ENV=development \
    ${IMAGE_NAME}

# 等待幾秒鐘讓容器完全啟動
sleep 5

# 檢查容器是否正常運行
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo -e "${GREEN}開發環境已成功啟動！${NC}"
    echo -e "${GREEN}應用程序運行在 http://localhost:${PORT}${NC}"
    
    # 顯示容器日誌
    echo -e "${YELLOW}容器日誌輸出：${NC}"
    docker logs ${CONTAINER_NAME}
else
    echo "容器啟動失敗，請檢查錯誤日誌"
    exit 1
fi

# 提供一些有用的命令提示
echo -e "\n${YELLOW}有用的命令：${NC}"
echo "查看容器日誌: docker logs -f ${CONTAINER_NAME}"
echo "停止容器: docker stop ${CONTAINER_NAME}"
echo "重啟容器: docker restart ${CONTAINER_NAME}"
echo "進入容器: docker exec -it ${CONTAINER_NAME} bash"
