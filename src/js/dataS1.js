function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取股票指标数据 (支持微小波动，模拟实时刷新)
async function fetchStockData() {
    try {
        const today = getTodayDate();
        const response = await fetch(`https://v0-api-nine-zeta.vercel.app/stock-stats?date=${today}`);
        const data = await response.json();

        // 关键：把请求到的数据打印出来看看
        console.log('fetchStockData 收到的原始数据:', data);

        // 直接返回数据（假设返回的就是 { "GLW": {...}, "HON": {...} } 格式）
        return data;
    } catch (error) {
        console.error('请求失败:', error);
        return {};
    }
}