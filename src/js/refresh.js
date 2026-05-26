// 图表实例变量
let wtiChart = null;
let yieldCurveChart = null;  // 新增：收益率曲线图表实例
// 局部刷新核心逻辑 (根据 activeView 刷新右侧面板)
async function refreshCurrentView() {
    const panel = document.getElementById('dynamicPanel');
    if (!panel) return;

    // 显示加载中
    panel.innerHTML = `<div class="flex justify-center items-center h-40"><div class="text-macro-muted text-sm animate-pulse">⏳ 正在通过 JS 接口获取数据 ...</div></div>`;

    // 获取宏观数据（利率板块也需要用到）
    const macro = await fetchMacroData();
    currentMacroData = macro;

    // 更新顶部栏（所有视图都可能需要）
    await updateTopBar();

    if (activeView === 'dashboard') {
        const html = renderDashboardHTML(currentMacroData);
        panel.innerHTML = html;
        // 渲染图表
        setTimeout(() => {
            renderOrUpdateWtiChart(currentMacroData);
        }, 60);
    }
    else if (activeView === 'stockBoard') {
        // 获取股票指标数据
        const stocks = await fetchStockData();
        currentStockData = stocks;
        const html = renderStockBoardHTML(currentStockData);
        panel.innerHTML = html;
    }
    else if (activeView === 'ratesOverview') {
        // 利率概览
        const html = renderRatesOverview(currentMacroData);
        panel.innerHTML = html;
    }
    else if (activeView === 'yieldCurve') {
        // 收益率曲线
        const html = renderYieldCurve(currentMacroData);
        panel.innerHTML = html;
        // 渲染收益率曲线图表
        setTimeout(() => {
            const chartDom = document.getElementById('yieldCurveChart');
            if (chartDom && typeof echarts !== 'undefined') {
                // 如果已经有图表实例，先销毁
                if (yieldCurveChart) yieldCurveChart.dispose();
                yieldCurveChart = echarts.init(chartDom);

                // 收益率曲线配置
                const maturities = ['2年', '3年', '5年', '7年', '10年', '30年'];
                const yields = [
                    currentMacroData.rate2Y,
                    currentMacroData.rate3Y || 4.20,
                    currentMacroData.rate5Y,
                    currentMacroData.rate7Y || 4.45,
                    currentMacroData.rate10Y,
                    currentMacroData.rate30Y
                ];

                const option = {
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    grid: { left: '8%', right: '5%', top: 20, bottom: 20, containLabel: true },
                    xAxis: { type: 'category', data: maturities, axisLabel: { color: '#8a8fb0' } },
                    yAxis: { type: 'value', name: '收益率 (%)', nameTextStyle: { color: '#8a8fb0' }, axisLabel: { color: '#b9c3ff' }, splitLine: { lineStyle: { color: '#23272f' } } },
                    series: [{ type: 'line', data: yields, smooth: false, lineStyle: { width: 2, color: '#5c7cff' }, symbol: 'circle', symbolSize: 8, itemStyle: { color: '#5c7cff' }, areaStyle: { opacity: 0.1, color: '#5c7cff' } }]
                };
                yieldCurveChart.setOption(option);
                window.addEventListener('resize', () => yieldCurveChart?.resize());
            }
        }, 100);
    }
    else if (activeView === 'fedWatch') {
        // 美联储观察
        const html = renderFedWatch(currentMacroData);
        panel.innerHTML = html;
    }
}

// 手动刷新按钮 (同时刷新当前板块)
// 手动刷新时，可以选择性更新
async function manualRefresh() {
    if (activeView === 'dashboard') {
        // 刷新市场总览数据
        const macro = await fetchMacroData(true); // 强制刷新
        const fearGreed = await fetchFearGreedData(true);
        dashboardData = { ...macro, ...fearGreed };
    } 
    else if (activeView === 'ratesOverview') {
        // 清除缓存，强制刷新利率数据
        ratesCache = null;
        ratesData = await fetchRatesData();
    }
    
    await refreshCurrentView();
}

// 切换板块: 改变 activeView 并刷新内容
async function switchToView(viewId) {
    if (viewId === activeView) {
        // 相同板块可仍然刷新数据
        await refreshCurrentView();
        return;
    }

    activeView = viewId;
    await refreshCurrentView();

    // 更新侧边栏高亮样式
    const navDashboard = document.getElementById('navDashboard');
    const navStock = document.getElementById('navStockBoard');
    const navRatesOverview = document.getElementById('navRatesOverview');
    const navYieldCurve = document.getElementById('navYieldCurve');
    const navFedWatch = document.getElementById('navFedWatch');

    // 1. 先清除所有高亮（包括父菜单和子菜单）
    const allNavItems = [navDashboard, navStock, navRatesOverview, navYieldCurve, navFedWatch];
    allNavItems.forEach(item => {
        if (item) {
            item.classList.remove('bg-macro-active', 'text-white');
            item.classList.add('text-macro-muted');
        }
    });

    // 2. 根据当前激活视图高亮对应菜单
    if (activeView === 'dashboard') {
        if (navDashboard) {
            navDashboard.classList.add('bg-macro-active', 'text-white');
            navDashboard.classList.remove('text-macro-muted');
        }
    }
    else if (activeView === 'stockBoard') {
        if (navStock) {
            navStock.classList.add('bg-macro-active', 'text-white');
            navStock.classList.remove('text-macro-muted');
        }
    }
    else if (activeView === 'ratesOverview') {
        if (navRatesOverview) {
            navRatesOverview.classList.add('bg-macro-active', 'text-white');
            navRatesOverview.classList.remove('text-macro-muted');
        }
    }
    else if (activeView === 'yieldCurve') {
        if (navYieldCurve) {
            navYieldCurve.classList.add('bg-macro-active', 'text-white');
            navYieldCurve.classList.remove('text-macro-muted');
        }
    }
    else if (activeView === 'fedWatch') {
        if (navFedWatch) {
            navFedWatch.classList.add('bg-macro-active', 'text-white');
            navFedWatch.classList.remove('text-macro-muted');
        }
    }
}