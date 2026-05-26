// 渲染S1信号看板 (表格形式，展示 volumeRatio, turnoverRate, fourAverageOscillator, signal)
function renderStockBoardHTML(stockData) {
    // stockData 格式: { "GLW": { volumeRatio, turnoverRate, fourAverageOscillator, signal? } ... }
    const symbols = Object.keys(stockData).sort();
    if (symbols.length === 0) return `<div class="text-macro-muted">暂无数据</div>`;

    // 生成表格
    let tableRows = '';
    for (const symbol of symbols) {
        const item = stockData[symbol];
        const signal = item.signal ? item.signal : '—';
        let signalColor = 'text-macro-muted';  // 默认灰色（没有值）
        if (signal === 'Buy') {
            signalColor = 'text-green-400';     // 绿色
        } else if (signal === 'Sell') {
            signalColor = 'text-red-400';       // 红色
        } else {
            continue;
        }
        // const signalColor = signal === 'Buy' || signal === 'Strong Buy' ? 'text-green-400' : 'text-macro-gold';
        tableRows += `
                <tr class="border-b border-macro-border/50 hover:bg-macro-hover/40 transition">
                    <td class="px-4 py-3 font-semibold text-macro-text">${symbol}</td>
                    <td class="px-4 py-3 text-macro-text">${item.volumeRatio ? item.volumeRatio.toFixed(4) : '—'}</td>
                    <td class="px-4 py-3 text-macro-text">${item.turnoverRate ? item.turnoverRate.toFixed(2) : '—'}%</td>
                    <td class="px-4 py-3 text-macro-text">${item.fourAverageOscillator ? item.fourAverageOscillator.toFixed(4) : '—'}</td>
                    <td class="px-4 py-3 ${signalColor} font-medium">${signal}</td>
                </tr>
            `;
    }

    return `
            <div class="fade-in space-y-5">
                <div class="bg-macro-card rounded-2xl border border-macro-border p-5">
                    <div class="flex justify-between items-center border-b border-macro-border pb-3 mb-3">
                        <h2 class="text-lg font-semibold text-white">S1信号股票</h2>
                        <span class="text-xs bg-macro-active px-2 py-1 rounded-full text-macro-accent">今日数据</span>
                    </div>
                    <div class="data-table-wrapper">
                        <table class="data-table w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-macro-hover/60 border-b border-macro-border">
                                    <th class="text-left px-4 py-2 text-macro-muted font-medium">代码</th>
                                    <th class="text-left px-4 py-2 text-macro-muted font-medium">量比</th>
                                    <th class="text-left px-4 py-2 text-macro-muted font-medium">换手率 (%)</th>
                                    <th class="text-left px-4 py-2 text-macro-muted font-medium">四线平均震荡</th>
                                    <th class="text-left px-4 py-2 text-macro-muted font-medium">信号</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4 text-[11px] text-macro-muted/70 pt-3 border-t border-macro-border/30 flex justify-between">
                        <span>📌指标说明: volumeRatio=量比, turnoverRate=换手率(%), fourAverageOscillator=四线平均震荡指标, signal=信号建议</span>
                        <!--<span>📌 数据基于给定 JSON 结构动态刷新</span>-->
                        <!--<span>🔄 每次刷新产生微小波动 (模拟真实)</span>-->
                    </div>
                </div>
            </div>
        `;
}