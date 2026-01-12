import React, { useState } from 'react';
import { TrendingUp, Calendar, Zap, Moon, Activity, Ruler } from 'lucide-react';
import TrendGraph from './TrendGraph';

const History = ({ historyLogs }) => {
    const [metric, setMetric] = useState('weight');
    const metrics = {
        weight: { label: 'Weight', unit: 'kg', color: 'indigo' },
        waist: { label: 'Waist', unit: 'in', color: 'rose' },
        hip: { label: 'Hip', unit: 'in', color: 'amber' },
        chest: { label: 'Chest', unit: 'in', color: 'emerald' },
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-8">
            <section className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-${metrics[metric].color}-500 to-${metrics[metric].color}-300`}></div>

                <div className="flex flex-col gap-4 mb-6">
                    <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-3">
                        <div className={`bg-${metrics[metric].color}-50 p-2.5 rounded-2xl text-${metrics[metric].color}-600`}>
                            {metric === 'weight' ? <TrendingUp className="w-6 h-6" /> : <Ruler className="w-6 h-6" />}
                        </div>
                        {metrics[metric].label} History
                    </h3>

                    {/* Metric Selector */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {Object.keys(metrics).map(m => (
                            <button
                                key={m}
                                onClick={() => setMetric(m)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${metric === m
                                        ? `bg-${metrics[m].color}-500 text-white border-${metrics[m].color}-500 shadow-lg shadow-${metrics[m].color}-500/30`
                                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                    }`}
                            >
                                {metrics[m].label}
                            </button>
                        ))}
                    </div>
                </div>

                <TrendGraph
                    data={historyLogs}
                    dataKey={metric}
                    unit={metrics[metric].unit}
                    color={metrics[metric].color}
                />
            </section>

            <section className="space-y-4">
                <h4 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    History Log <span className="w-full h-[1px] bg-slate-100"></span>
                </h4>

                <div className="space-y-3">
                    {historyLogs.map((log, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all">
                                    <span className="font-black text-xs uppercase tracking-widest flex flex-col items-center leading-tight">
                                        <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-xl">{new Date(log.date).getDate()}</span>
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-black text-slate-800 text-lg">{log[metric] || '-'} <span className="text-sm text-slate-400 font-bold">{metrics[metric].unit}</span></p>
                                        {metric !== 'weight' && <span className="text-[10px] font-bold text-slate-300 uppercase">{metrics[metric].label}</span>}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase mt-1">
                                        <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> {log.sleepHours}h</span>
                                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {log.energyLevel}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default History;
