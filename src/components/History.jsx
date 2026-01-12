import React from 'react';
import { TrendingUp, Calendar, Zap, Moon } from 'lucide-react';
import WeightGraph from './WeightGraph';

const History = ({ historyLogs }) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-8">
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-3 mb-8">
                    <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    Weight Trends
                </h3>
                <WeightGraph data={historyLogs} />
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
                                    <p className="font-black text-slate-800 text-lg mb-1">{log.weight} <span className="text-sm text-slate-400 font-bold">kg</span></p>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase">
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
