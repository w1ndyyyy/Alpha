// 宏观数据 (包含 WTI, 标普500, 10Y 利率, OAS, VIX 及油价历史)
async function fetchMacroData() {
    await new Promise(resolve => setTimeout(resolve, 280));
    const base = {
        wti: 96.60,
        sp500: 7473.47,
        tenYear: 4.56,
        oas: 2.78,
        // vix: 16.7,
        lastUpdate: new Date().toLocaleString()
    };
    const wiggle = (val, rangePercent = 0.006) => {
        let delta = val * (Math.random() * rangePercent * 2 - rangePercent);
        return parseFloat((val + delta).toFixed(2));
    };
    const newWti = wiggle(base.wti, 0.012);
    const newSp = wiggle(base.sp500, 0.004);
    const newYield = wiggle(base.tenYear, 0.02);
    const newOas = wiggle(base.oas, 0.015);
    // const newVix = wiggle(base.vix, 0.05);
    const currentWti = newWti;
    const historyDates = [];
    const historyPrices = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        historyDates.push(`${date.getMonth() + 1}/${date.getDate()}`);
        let historicalFactor = 1 + (Math.sin(i * 0.8) * 0.025) + (Math.random() * 0.01 - 0.005);
        historyPrices.push(parseFloat((currentWti * historicalFactor).toFixed(2)));
    }

    // 获取 CNN 恐慌贪婪指数
    const cnnData = await fetchFearGreedFromCNN();

    // 并行获取利率数据
    const ratesData = await fetchAllRates();

    // 计算利差（基点，即 bp = 百分比差值 × 100）
    const rate10Yminus2Y = ratesData.rate10Y && ratesData.rate2Y
        ? ((ratesData.rate10Y - ratesData.rate2Y) * 100).toFixed(1)
        : 0;
    const rate30Yminus10Y = ratesData.rate30Y && ratesData.rate10Y
        ? ((ratesData.rate30Y - ratesData.rate10Y) * 100).toFixed(1)
        : 0;

    // 计算日变化（基点）
    const rate2YChange = ratesData.rate2Y && ratesData.rate2YPRev
        ? ((ratesData.rate2Y - ratesData.rate2YPRev) * 100).toFixed(1)
        : 0;
    const rate5YChange = ratesData.rate5Y && ratesData.rate5YPRev
        ? ((ratesData.rate5Y - ratesData.rate5YPRev) * 100).toFixed(1)
        : 0;
    const rate10YChange = ratesData.rate10Y && ratesData.rate10YPRev
        ? ((ratesData.rate10Y - ratesData.rate10YPRev) * 100).toFixed(1)
        : 0;
    const rate30YChange = ratesData.rate30Y && ratesData.rate30YPRev
        ? ((ratesData.rate30Y - ratesData.rate30YPRev) * 100).toFixed(1)
        : 0;

    // 获取 VIX 原始值
    const vixValue = ratesData.vix;
    console.log('VIX 原始值:', vixValue); // 调试日志

    // 计算 VIX 标签和颜色
    let vixLabel = '正常';
    let vixColor = 'text-green-400';

    if (vixValue > 30) {
        vixLabel = '极度恐慌';
        vixColor = 'text-red-400';
    } else if (vixValue > 20) {
        vixLabel = '恐慌';
        vixColor = 'text-orange-400';
    } else if (vixValue < 12) {
        vixLabel = '极度平静';
        vixColor = 'text-blue-400';
    }
    console.log('vixColor:', vixColor); // 调试日志

    return {
        wti: newWti,
        sp500: newSp,
        tenYear: newYield,
        oas: newOas,
        // vix: newVix,
        // CNN 数据映射
        fearGreedScore: cnnData.fear_and_greed.score,
        fearGreedRating: cnnData.fear_and_greed.rating,      // 'extreme fear', 'fear', 'neutral', 'greed', 'extreme greed'
        fearGreedPrevious: cnnData.fear_and_greed.previous_close,
        fearGreedPreviousWeek: cnnData.fear_and_greed.previous_1_week,
        fearGreedPreviousMonth: cnnData.fear_and_greed.previous_1_month,
        // 七项子指标
        fearGreedIndicators: {
            marketMomentum: cnnData.market_momentum_sp500?.score,
            stockPriceStrength: cnnData.stock_price_strength?.score,
            putCallRatio: cnnData.put_call_options?.score,
            marketVolatility: cnnData.market_volatility_vix?.score,
            junkBondDemand: cnnData.junk_bond_demand?.score,
            safeHavenDemand: cnnData.safe_haven_demand?.score
        },
        lastUpdate: new Date().toLocaleString(),
        wtiHistory: { dates: historyDates, prices: historyPrices },

        // 利率数据（来自 FRED）
        rate1M: ratesData.rate1M?.toFixed(2) || '--',
        rate3M: ratesData.rate3M?.toFixed(2) || '--',
        rate6M: ratesData.rate6M?.toFixed(2) || '--',
        rate1Y: ratesData.rate1Y?.toFixed(2) || '--',
        rate2Y: ratesData.rate2Y?.toFixed(2) || '--',
        rate2YChange: rate2YChange,
        rate2YDate: ratesData.rate2YDate || '--',
        rate3Y: ratesData.rate3Y?.toFixed(2) || '--',
        rate5Y: ratesData.rate5Y?.toFixed(2) || '--',
        rate5YChange: rate5YChange,
        rate5YDate: ratesData.rate5YDate || '--',
        rate7Y: ratesData.rate7Y?.toFixed(2) || '--',
        rate10Y: ratesData.rate10Y?.toFixed(2) || '--',
        rate10YChange: rate10YChange,
        rate10YDate: ratesData.rate10YDate || '--',
        rate20Y: ratesData.rate20Y?.toFixed(2) || '--',
        rate30Y: ratesData.rate30Y?.toFixed(2) || '--',
        rate30YChange: rate30YChange,
        rate30YDate: ratesData.rate30YDate || '--',

        // 利差（基点）
        rate10Yminus2Y: rate10Yminus2Y,
        rate30Yminus10Y: rate30Yminus10Y,

        // 美联储利率
        fedFunds: ratesData.fedFunds?.toFixed(2) || '--',

        // VIX 数据（来自 FRED）
        vix: vixValue?.toFixed(2) || '--',
        // vixPrevious: ratesData.vixPrev?.toFixed(2) || '--',
        vixDate: ratesData.vixDate || '--',
        vixLabel: vixLabel,
        vixColor: vixColor,
    };
}

async function fetchFearGreedFromCNN() {
    const response = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();

    // 打印到控制台，方便调试
    console.log('CNN 恐慌贪婪指数:', data);

    return data;
}