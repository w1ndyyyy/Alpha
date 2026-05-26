// 渲染函数 (市场总览板块)
function renderDashboardHTML(data) {
    return `
            <div class="fade-in space-y-5">
                <!-- 第一行：恐慌贪婪指数占较窄宽度，右边放其他模块 -->
                <div class="flex gap-4 flex-wrap glowing-card">
                    <!-- 恐慌贪婪指数卡片 - 设置固定较窄宽度 -->
                    <div class="w-48">
                        ${renderFearGreedCard(data)}
                    </div>
                    <!-- VIX 恐慌指数卡片 -->
                    <div class="w-48 bg-macro-card rounded-xl flex flex-col border border-macro-border">
                        <div class="flex justify-between items-center px-3 pt-2 pb-0">
                            <div class="flex items-center gap-1">
                                <span class="text-xs font-medium text-white">VIX波动率指数</span>
                            </div>
                            <span class="text-[8px] text-macro-muted bg-macro-hover px-1.5 py-0.5 rounded">CBOE</span>
                        </div>
                        <div class="flex-1 flex flex-col justify-center items-center text-center pb-3">
                            <div class="text-4xl font-bold ${data.vixColor}">${data.vix}</div>
                            <div class="text-base ${data.vixColor} mt-1">${data.vixLabel}</div>
                        </div>
                    </div>
                    <!-- 右侧预留空间 -->
                    <div class="flex-1 grid grid-cols-2 gap-4">
                        <div class="bg-macro-card rounded-xl border border-macro-border p-3 flex items-center justify-center text-macro-muted text-sm">
                            模块 A
                        </div>
                        <div class="bg-macro-card rounded-xl border border-macro-border p-3 flex items-center justify-center text-macro-muted text-sm">
                            模块 B
                        </div>
                    </div>
                </div>

                <div class="bg-macro-card rounded-2xl border border-macro-border p-5 shadow-lg glowing-card">
                    <div class="flex justify-between items-center border-b border-macro-border pb-3 mb-3">
                        <h2 class="text-lg font-semibold text-white">📌 MACRO STATE · 宏观状态</h2>
                        <span class="text-xs bg-macro-active px-2 py-1 rounded-full text-macro-accent">中性 · neutral</span>
                    </div>
                    <div class="space-y-3 text-sm text-macro-text/90">
                        <p><span class="font-bold text-white">● 主线</span><br>地缘风险溢价回落，WTI原油 <span class="text-macro-gold font-semibold">$${data.wti}</span>，通胀预期下行，利率敏感资产反弹。</p>
                        <p><span class="font-bold text-white">● 反证</span><br>VIX指数 ${data.vix}，高收益债利差 (OAS ${data.oas}%) 未明显收紧，油价若跌破95关口反弹可延续。</p>
                    </div>
                </div>
                
                <div class="bg-macro-card rounded-2xl border border-macro-border p-5 glowing-card">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-base font-semibold flex items-center gap-2">🛢️ WTI 原油价格走势 (近7日)</h3>
                        <span class="text-xs text-macro-muted">ECharts 实时渲染</span>
                    </div>
                    <div id="wtiTrendChart" class="chart-container"></div>
                </div>
                
                <div class="bg-macro-card rounded-2xl border border-macro-border p-5">
                    <h3 class="text-base font-semibold mb-4 flex items-center gap-2">📈 3个重要变化</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-macro-bg/60 p-3 rounded-xl border border-macro-border/40">
                            <div class="text-xs text-macro-muted">高收益债 OAS</div>
                            <div class="text-xl font-bold text-macro-gold">${data.oas}%</div>
                            <div class="text-[10px] text-emerald-400">变化 -2.0bp</div>
                        </div>
                        <div class="bg-macro-bg/60 p-3 rounded-xl border border-macro-border/40">
                            <div class="text-xs text-macro-muted">比特币</div>
                            <div class="text-xl font-bold text-white">$76,812</div>
                            <div class="text-[10px] text-amber-400">+1.36%</div>
                        </div>
                        <div class="bg-macro-bg/60 p-3 rounded-xl border border-macro-border/40">
                            <div class="text-xs text-macro-muted">10Y 国债收益率</div>
                            <div class="text-xl font-bold text-white">${data.tenYear}%</div>
                            <div class="text-[10px] text-blue-400">日 -1.0bp</div>
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-macro-border/50 flex justify-between text-xs text-macro-muted">
                        <span>💧 流动性压力 5.5/10 · 偏紧</span>
                        <span>📊 WTI波动率 ${data.vix}</span>
                    </div>
                </div>
                <div class="text-center text-[11px] text-macro-muted/70 bg-macro-card/40 p-3 rounded-xl border border-macro-border/30">
                    ✅ 宏观数据通过 JS 接口获取 | Google Fonts + Tailwind + ECharts
                </div>
            </div>
        `;
}

// 初始化或更新 ECharts 图表 (仅在市场总览板块需要)
function renderOrUpdateWtiChart(data) {
    const chartDom = document.getElementById('wtiTrendChart');
    if (!chartDom) return;
    if (!wtiChart) {
        wtiChart = echarts.init(chartDom);
    }
    let xAxisData = [];
    let seriesData = [];
    if (data.wtiHistory && data.wtiHistory.dates && data.wtiHistory.prices) {
        xAxisData = data.wtiHistory.dates;
        seriesData = data.wtiHistory.prices;
    } else {
        const dummyDates = [];
        const dummyPrices = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dummyDates.push(`${d.getMonth() + 1}/${d.getDate()}`);
            dummyPrices.push(parseFloat((data.wti + (Math.sin(i) * 0.5)).toFixed(2)));
        }
        xAxisData = dummyDates;
        seriesData = dummyPrices;
    }
    const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', backgroundColor: '#1e2129', borderColor: '#5c7cff', textStyle: { color: '#eef2ff' } },
        grid: { left: '8%', right: '5%', top: 20, bottom: 10, containLabel: true },
        xAxis: { type: 'category', data: xAxisData, axisLabel: { color: '#8a8fb0', fontSize: 10 }, axisLine: { lineStyle: { color: '#2c3142' } } },
        yAxis: { type: 'value', name: 'USD / 桶', nameTextStyle: { color: '#8a8fb0' }, splitLine: { lineStyle: { color: '#23272f' } }, axisLabel: { color: '#b9c3ff' } },
        series: [{
            name: 'WTI 原油', type: 'line', data: seriesData, smooth: true, symbol: 'circle', symbolSize: 6,
            lineStyle: { width: 2.5, color: '#ffd966' },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(255, 217, 102, 0.3)' }, { offset: 1, color: 'rgba(255, 217, 102, 0.02)' }
                ])
            },
            itemStyle: { color: '#ffd966' }
        }]
    };
    wtiChart.setOption(option, true);
    window.addEventListener('resize', () => wtiChart?.resize());
}