// 渲染 VIX 历史走势图
function renderVIXHistoryChart(vixHistory) {
    const chartId = 'vixChart_' + Date.now();

    setTimeout(() => {
        const chartDom = document.getElementById(chartId);
        if (chartDom && typeof echarts !== 'undefined' && vixHistory && vixHistory.values && vixHistory.values.length > 0) {
            const chart = echarts.init(chartDom);

            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#1e2129',
                    borderColor: '#5c7cff',
                    textStyle: { color: '#eef2ff', fontSize: 12 },
                    formatter: function (params) {
                        return `${params[0].axisValue}<br/>VIX：<b>${params[0].value.toFixed(2)}</b>`;
                    }
                },
                grid: {
                    left: '8%',
                    right: '5%',
                    top: 40,
                    bottom: 30,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: vixHistory.dates,
                    axisLabel: {
                        color: '#8a8fb0',
                        fontSize: 10,
                        rotate: vixHistory.dates.length > 100 ? 45 : 0,
                        interval: Math.floor(vixHistory.dates.length / 8)
                    },
                    axisLine: { lineStyle: { color: '#2c3142' } }
                },
                yAxis: {
                    type: 'value',
                    name: 'VIX 波动率指数',
                    nameTextStyle: { color: '#8a8fb0', fontSize: 12 },
                    axisLabel: { color: '#b9c3ff', fontSize: 11 },
                    splitLine: { lineStyle: { color: '#23272f', type: 'dashed' } }
                },
                series: [{
                    type: 'line',
                    data: vixHistory.values,
                    smooth: true,
                    lineStyle: { width: 2, color: '#5c7cff', shadowBlur: 8, shadowColor: '#5c7cff' },
                    symbol: 'circle',
                    symbolSize: 3,
                    itemStyle: { color: '#5c7cff', borderColor: '#0f1119', borderWidth: 1 },
                    areaStyle: {
                        opacity: 0.2,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#5c7cff' },
                                { offset: 1, color: 'rgba(92,124,255,0)' }
                            ]
                        }
                    },
                    // 阈值线放在 series 里面
                    markLine: {
                        data: [
                            { yAxis: 20, name: '恐慌', lineStyle: { color: '#f97316', width: 1, type: 'dashed' }, label: { color: '#f97316', show: true, formatter: '{b}', position: 'end' }},
                            { yAxis: 30, name: '极度恐慌', lineStyle: { color: '#ef4444', width: 1, type: 'dashed' }, label: { color: '#ef4444', show: true, formatter: '{b}', position: 'end' }}
                        ],
                        label: { show: true, formatter: '{b}', color: '#eef2ff', fontSize: 10, position: 'end' },
                        symbol: 'none'
                    }
                }]
            };

            chart.setOption(option);
            window.addEventListener('resize', () => chart.resize());
        }
    }, 100);

    return `
        <div class="bg-macro-card rounded-2xl border border-macro-border p-5 mt-5">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-white">VIX 历史走势图</h3>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-macro-muted/60">数据日期：${vixHistory?.dates?.slice(-1)[0] || '--'}</span>
                    <span class="text-[10px] bg-macro-hover px-2 py-0.5 rounded text-macro-accent">FRED</span>
                </div>
            </div>
            <div id="${chartId}" class="w-full h-80"></div>
            <div class="mt-3 text-xs text-macro-muted/70 leading-relaxed">
                <span class="text-orange-400">●</span> 恐慌阈值（20）：VIX高于20表明市场开始担忧，波动加剧<br/>
                <span class="text-red-400">●</span> 极度恐慌（30）：VIX高于30通常伴随市场大幅下跌，往往是中期底部信号
            </div>
        </div>
    `;
}