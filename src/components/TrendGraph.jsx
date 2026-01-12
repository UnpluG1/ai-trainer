import React from 'react';

const TrendGraph = ({ data, dataKey = 'weight', unit = 'kg', color = 'indigo' }) => {
    const graphData = [...data].reverse().slice(-7);

    if (graphData.length === 0) return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <p className="text-sm font-medium">Not enough data to check trends</p>
            <div className="w-full max-w-[150px] h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="w-1/3 h-full bg-slate-300 rounded-full"></div>
            </div>
        </div>
    );

    const values = graphData.map(d => Number(d[dataKey]) || 0);
    const maxVal = Math.max(...values) + 1;
    const minVal = Math.min(...values) - 1;
    const range = maxVal - minVal || 1;

    // Color maps
    const colors = {
        indigo: { from: 'from-indigo-500', to: 'to-purple-500', bg: 'bg-indigo-500' },
        rose: { from: 'from-rose-500', to: 'to-orange-500', bg: 'bg-rose-500' },
        emerald: { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500' },
        amber: { from: 'from-amber-500', to: 'to-yellow-500', bg: 'bg-amber-500' },
    };
    const c = colors[color] || colors.indigo;

    return (
        <div className="flex items-end justify-between h-48 gap-3 px-2 mt-4">
            {graphData.map((d, i) => {
                const val = Number(d[dataKey]) || 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                            <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl shadow-slate-900/20 whitespace-nowrap">
                                {val} {unit}
                            </div>
                            <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div>
                        </div>

                        {/* Bar */}
                        <div className="w-full relative group-hover:scale-x-110 transition-transform duration-300" style={{ height: `${((val - minVal) / range) * 100}%`, minHeight: '15%' }}>
                            <div className={`absolute inset-0 bg-gradient-to-t ${c.from} ${c.to} rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-white/50"></div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TrendGraph;
