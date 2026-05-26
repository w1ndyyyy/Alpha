// 利率概览
function renderRatesOverview(data) {
    // 使用10年期的日期
    const commonDate = data.rate10YDate || '--';
    
    // 生成唯一图表ID
    const chartId = 'yieldCurveChart_' + Date.now();
    
    // 延迟初始化图表
    setTimeout(() => {
        const chartDom = document.getElementById(chartId);
        if (chartDom && typeof echarts !== 'undefined') {
            initYieldCurveChart(chartId, data);
        }
    }, 200);
    
    return `
        <div class="space-y-6">
            <!-- 第一张卡片：利率概览 -->
            <div class="bg-macro-card rounded-2xl border border-macro-border p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-white">美债收益率</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-macro-muted/60">数据日期：${commonDate}</span>
                        <span class="text-[10px] bg-macro-hover px-2 py-0.5 rounded text-macro-accent">FRED</span>
                    </div>
                </div>
                
                <!-- 一行六列 -->
                <div class="grid grid-cols-6 gap-4">
                    <!-- 2年期 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">2年期国债</div>
                        <div class="text-2xl font-bold text-white">${data.rate2Y}%</div>
                    </div>
                    
                    <!-- 5年期 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">5年期国债</div>
                        <div class="text-2xl font-bold text-white">${data.rate5Y}%</div>
                    </div>
                    
                    <!-- 10年期 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">10年期国债</div>
                        <div class="text-2xl font-bold text-white">${data.rate10Y}%</div>
                    </div>
                    
                    <!-- 30年期 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">30年期国债</div>
                        <div class="text-2xl font-bold text-white">${data.rate30Y}%</div>
                    </div>
                    
                    <!-- 10Y-2Y 利差 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">10Y-2Y利差</div>
                        <div class="text-2xl font-bold ${data.rate10Yminus2Y >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${data.rate10Yminus2Y}bp
                        </div>
                    </div>
                    
                    <!-- 30Y-10Y 利差 -->
                    <div class="bg-macro-bg/40 rounded-xl p-4 text-center">
                        <div class="text-sm text-macro-muted mb-1">30Y-10Y利差</div>
                        <div class="text-2xl font-bold ${data.rate30Yminus10Y >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${data.rate30Yminus10Y}bp
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 第二张卡片：美债收益率曲线（独立卡片） -->
            <div class="bg-macro-card rounded-2xl border border-macro-border p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-white">美债收益率曲线</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-macro-muted/60">数据日期：${commonDate}</span>
                        <span class="text-[10px] bg-macro-hover px-2 py-0.5 rounded text-macro-accent">FRED</span>
                    </div>
                </div>
                
                <!-- ECharts 图表容器 -->
                <div id="${chartId}" class="w-full h-96"></div>
                
                <!-- 曲线解读 -->
                <div class="mt-4 p-3 bg-macro-bg/30 rounded-lg">
                    <div class="text-xs text-macro-muted">
                        ${data.rate10Yminus2Y > 0 ? 
                            '曲线解读：收益率曲线正常（正斜率），长期利率高于短期利率，表明市场对经济前景预期乐观。' : 
                            '曲线解读：收益率曲线倒挂（负斜率），短期利率高于长期利率，历史上通常是经济衰退的预警信号。'
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// js/render.js

// 初始化完整收益率曲线图表（1个月到30年）
function initYieldCurveChart(chartId, data) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }
    
    const chart = echarts.init(chartDom);
    
    // 完整期限数据（从短期到长期，共11个点）
    const maturities = ['1月', '3月', '6月', '1年', '2年', '3年', '5年', '7年', '10年', '20年', '30年'];
    
    // 对应的收益率值（使用 data 中的利率数据）
    const yields = [
        parseFloat(data.rate1M) || null,
        parseFloat(data.rate3M) || null,
        parseFloat(data.rate6M) || null,
        parseFloat(data.rate1Y) || null,
        parseFloat(data.rate2Y) || null,
        parseFloat(data.rate3Y) || null,
        parseFloat(data.rate5Y) || null,
        parseFloat(data.rate7Y) || null,
        parseFloat(data.rate10Y) || null,
        parseFloat(data.rate20Y) || null,
        parseFloat(data.rate30Y) || null
    ];
    
    // 过滤掉 null 值，保留有效数据点
    const validData = [];
    const validMaturities = [];
    for (let i = 0; i < maturities.length; i++) {
        if (yields[i] !== null && !isNaN(yields[i])) {
            validData.push(yields[i]);
            validMaturities.push(maturities[i]);
        }
    }
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: '#1e2129',
            borderColor: '#5c7cff',
            textStyle: { color: '#eef2ff', fontSize: 12 },
            formatter: function(params) {
                return `${params[0].axisValue}<br/>收益率：<b>${params[0].value.toFixed(2)}%</b>`;
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            top: 40,
            bottom: 25,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: validMaturities,
            axisLabel: {
                color: '#8a8fb0',
                fontSize: 11,
                rotate: validMaturities.length > 8 ? 25 : 0,
                interval: 0
            },
            axisLine: { lineStyle: { color: '#2c3142' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            name: '收益率 (%)',
            nameTextStyle: { color: '#8a8fb0', fontSize: 12 },
            axisLabel: { color: '#b9c3ff', fontSize: 11 },
            splitLine: { lineStyle: { color: '#23272f', type: 'dashed' } }
        },
        series: [{
            type: 'line',
            data: validData,
            smooth: true,
            lineStyle: {
                width: 3,
                color: '#5c7cff',
                shadowBlur: 10,
                shadowColor: '#5c7cff'
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
                color: '#5c7cff',
                borderColor: '#0f1119',
                borderWidth: 2
            },
            areaStyle: {
                opacity: 0.15,
                color: '#5c7cff'
            },
            label: {
                show: true,
                position: 'top',
                color: '#eef2ff',
                fontSize: 10,
                formatter: '{c}%'
            }
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 收益率曲线
function renderYieldCurve(data) {
    return `
        <div class="bg-macro-card rounded-2xl border border-macro-border p-5">
            <h2 class="text-lg font-semibold text-white mb-4">📈 收益率曲线</h2>
            <div id="yieldCurveChart" class="w-full h-96"></div>
            <div class="text-center text-xs text-macro-muted mt-4">数据来源：美国财政部</div>
        </div>
    `;
}

// 美联储观察
function renderFedWatch(data) {
    return `
        <div class="space-y-5">
            <div class="bg-macro-card rounded-2xl border border-macro-border p-5">
                <h2 class="text-lg font-semibold text-white mb-4">🏦 美联储观察</h2>
                <div class="space-y-3">
                    <div class="flex justify-between py-2 border-b border-macro-border/50">
                        <span class="text-macro-muted">当前联邦基金利率</span>
                        <span class="font-bold text-white">${data.fedFunds}%</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-macro-border/50">
                        <span class="text-macro-muted">下次会议降息概率</span>
                        <span class="font-bold ${data.rateCutProbability > 50 ? 'text-green-400' : 'text-red-400'}">${data.rateCutProbability}%</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-macro-muted">下次会议时间</span>
                        <span class="text-white">${data.nextFOMCMeeting}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}