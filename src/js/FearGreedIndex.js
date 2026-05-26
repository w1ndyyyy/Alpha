// js/components.js

function renderFearGreedCard(data) {
    let score = Math.round(data.fearGreedScore || 59);
    score = Math.min(100, Math.max(0, score));
    
    const rating = data.fearGreedRating || 'greed';
    
    const ratingConfig = {
        'extreme fear': { label: '极端恐惧', color: '#8b5cf6' },
        'fear': { label: '恐惧', color: '#3b82f6' },
        'neutral': { label: '中性', color: '#9ca3af' },
        'greed': { label: '贪婪', color: '#f97316' },
        'extreme greed': { label: '极端贪婪', color: '#ef4444' }
    };
    
    const config = ratingConfig[rating] || ratingConfig['neutral'];
    
    const chartId = 'fearGauge_' + Date.now();
    
    setTimeout(() => {
        initFearGauge(chartId, score, config.color);
    }, 50);
    
    return `
        <div class="bg-macro-card rounded-xl border border-macro-border overflow-hidden">
            <!-- 头部：紧凑的一行 -->
            <div class="flex justify-between items-center px-3 pt-2 pb-0">
                <div class="flex items-center gap-1">
                    <span class="text-xs font-medium text-white">CNN恐慌贪婪指数</span>
                </div>
                <span class="text-[8px] text-macro-muted bg-macro-hover px-1.5 py-0.5 rounded">CNN</span>
            </div>
            
            <!-- 半圆仪表盘 - 占满主要区域 -->
            <div id="${chartId}" class="w-full h-36 -mt-4 -mb-2"></div>
            
            <!-- 数值和评级 -->
            <div class="text-center pb-3 -mt-2">
                <div class="text-2xl font-bold" style="color: ${config.color}">${score}</div>
                <div class="text-[10px] uppercase font-medium" style="color: ${config.color}">${config.label}</div>
            </div>
        </div>
    `;
}

// 半圆仪表盘 - 最大化
function initFearGauge(chartId, score, color) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }
    
    const chart = echarts.init(chartDom);
    
    const option = {
        series: [{
            type: 'gauge',
            center: ['50%', '80%'],
            radius: '95%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            progress: {
                show: true,
                width: 14,
                roundCap: true,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: '#8b5cf6' },
                            { offset: 0.25, color: '#3b82f6' },
                            { offset: 0.45, color: '#9ca3af' },
                            { offset: 0.55, color: '#9ca3af' },
                            { offset: 0.75, color: '#f97316' },
                            { offset: 1, color: '#ef4444' }
                        ]
                    }
                }
            },
            axisLine: {
                lineStyle: {
                    width: 14,
                    color: [[1, '#1e2129']]
                }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            pointer: {
                show: true,
                length: '60%',
                width: 5,
                itemStyle: { color: '#ffffff' }
            },
            detail: { show: false },
            title: { show: false },
            data: [{ value: score }]
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}