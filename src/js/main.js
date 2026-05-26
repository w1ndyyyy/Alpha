// 全局变量
let currentMacroData = null;
let currentStockData = null;
let activeView = "dashboard";   // 'dashboard' 或 'stockBoard'

// 更新顶栏快捷数值 (依赖宏观数据)
async function updateTopBar() {
    if (!currentMacroData) return;
    document.getElementById('quickWti').innerText = `$${currentMacroData.wti}`;
    document.getElementById('quickSpx').innerText = currentMacroData.sp500.toFixed(2);
    document.getElementById('quickTn').innerText = `${currentMacroData.tenYear}%`;
    document.getElementById('dateLabel').innerHTML = `${currentMacroData.lastUpdate}`;
}

// 5. 事件绑定 & 初始化
function bindEvents() {
    // 刷新按钮（只声明一次）
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => refreshCurrentView());

    // 市场总览
    const navDashboard = document.getElementById('navDashboard');
    if (navDashboard) navDashboard.addEventListener('click', () => switchToView('dashboard'));

    // S1信号（股票指标看板）
    const navStock = document.getElementById('navStockBoard');
    if (navStock) navStock.addEventListener('click', () => switchToView('stockBoard'));

    // 利率子菜单
    const navRatesOverview = document.getElementById('navRatesOverview');
    const navYieldCurve = document.getElementById('navYieldCurve');
    const navFedWatch = document.getElementById('navFedWatch');

    if (navRatesOverview) navRatesOverview.addEventListener('click', () => switchToView('ratesOverview'));
    if (navYieldCurve) navYieldCurve.addEventListener('click', () => switchToView('yieldCurve'));
    if (navFedWatch) navFedWatch.addEventListener('click', () => switchToView('fedWatch'));

    // 展开/收起逻辑
    const ratesParent = document.getElementById('ratesParent');
    const ratesSubmenu = document.getElementById('ratesSubmenu');
    const ratesArrow = document.getElementById('ratesArrow');

    if (ratesParent) {
        ratesParent.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = ratesSubmenu.classList.contains('hidden');
            if (isHidden) {
                ratesSubmenu.classList.remove('hidden');
                if (ratesArrow) ratesArrow.style.transform = 'rotate(90deg)';
            } else {
                ratesSubmenu.classList.add('hidden');
                if (ratesArrow) ratesArrow.style.transform = 'rotate(0deg)';
            }
        });
    }
}