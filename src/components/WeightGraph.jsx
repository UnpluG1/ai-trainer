import React from 'react';

const WeightGraph = ({ data }) => {
    const graphData = [...data].reverse().slice(-7);

    if (graphData.length === 0) return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <p className="text-sm font-medium">Not enough data to check trends</p>
            <div className="w-full max-w-[150px] h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="w-1/3 h-full bg-slate-300 rounded-full"></div>
            </div>
        </div>
    );

    const maxWeight = Math.max(...graphData.map(d => d.weight)) + 1;
    const minWeight = Math.min(...graphData.map(d => d.weight)) - 1;
    const range = maxWeight - minWeight || 1;

    return (
        <div className="flex items-end justify-between h-48 gap-3 px-2 mt-4">
            {graphData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl shadow-slate-900/20 whitespace-nowrap">
                            {d.weight} kg
                        </div>
                        <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div>
                    </div>

                    {/* Bar */}
                    <div className="w-full relative group-hover:scale-x-110 transition-transform duration-300" style={{ height: `${((d.weight - minWeight) / range) * 100}%`, minHeight: '15%' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/50"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default WeightGraph;
