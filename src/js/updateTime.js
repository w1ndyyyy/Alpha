// 实时刷新侧边栏时间
function updateSidebarTime() {
    const dateLabel = document.getElementById('dateLabel');
    if (dateLabel) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        dateLabel.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

// 启动定时器（每秒刷新）
let timeInterval;
function startTimeUpdater() {
    updateSidebarTime(); // 立即执行一次
    timeInterval = setInterval(updateSidebarTime, 1000); // 每秒更新
}

// 停止定时器（页面关闭时可选）
function stopTimeUpdater() {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
}