// 需要获取的利率系列ID
const RATE_SERIES = {
    // 短期（1年以内）
    rate1M: 'DGS1MO',    // 1个月
    rate3M: 'DGS3MO',    // 3个月
    rate6M: 'DGS6MO',    // 6个月
    rate1Y: 'DGS1',      // 1年
    // 中长期
    rate2Y: 'DGS2',      // 2年
    rate3Y: 'DGS3',      // 3年
    rate5Y: 'DGS5',      // 5年
    rate7Y: 'DGS7',      // 7年
    rate10Y: 'DGS10',    // 10年
    rate20Y: 'DGS20',    // 20年
    rate30Y: 'DGS30',    // 30年

    // VIX 系列
    vix: 'VIXCLS',      // CBOE 波动率指数
};

// 从 FRED 获取单个系列的最新数据
async function fetchFREDSeries(seriesId) {
    // 改为你的 Vercel 代理地址
    const url = `https://v0-api-nine-zeta.vercel.app/fred?series_id=${seriesId}&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.observations && data.observations.length > 0) {
            const latest = data.observations[0];
            // const previous = data.observations[1];
            return {
                current: latest.value === '.' ? null : parseFloat(latest.value),
                // previous: previous && previous.value === '.' ? null : parseFloat(previous.value),
                date: latest.date
            };
        }
        return null;
    } catch (error) {
        console.error(`获取 ${seriesId} 失败:`, error);
        return null;
    }
}

// 获取所有利率数据
async function fetchAllRates() {
    const results = {};

    const promises = Object.entries(RATE_SERIES).map(async ([key, seriesId]) => {
        const data = await fetchFREDSeries(seriesId);
        if (data) {
            results[key] = data.current;
            results[`${key}Prev`] = data.previous;
            results[`${key}Date`] = data.date;
            console.log(`${key} 获取成功:`, data.current);
        }
    });

    await Promise.all(promises);
    return results;
}

// 获取 VIX 历史数据（用于图表）
async function fetchVIXHistory(days = 252) {
    // FRED 默认返回最近 3 年数据，这里获取足够天数
    const limit = Math.min(days + 10, 1000); // FRED 限制单次最多 1000 条
    const url = `https://v0-api-nine-zeta.vercel.app/fred?series_id=VIXCLS&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.observations && data.observations.length > 0) {
            // 过滤掉无效值（VIX 有时会返回 '.' 表示无数据）
            const validObs = data.observations.filter(obs => obs.value !== '.');

            // 按日期升序排列（从旧到新）
            const sorted = validObs.sort((a, b) => new Date(a.date) - new Date(b.date));

            // 取最近 days 天
            const recent = sorted.slice(-days);

            return {
                dates: recent.map(obs => obs.date),
                values: recent.map(obs => parseFloat(obs.value))
            };
        }
        return null;
    } catch (error) {
        console.error('获取 VIX 历史数据失败:', error);
        return null;
    }
}