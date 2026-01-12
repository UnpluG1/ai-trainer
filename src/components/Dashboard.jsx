import React from 'react';
import { Activity, BrainCircuit, ChevronRight, RefreshCw, MessageSquareQuote, Moon, Zap, AlertCircle } from 'lucide-react';

const Dashboard = ({ dailyData, updateDailyField, isConsulting, getTrainerAnalysis, trainerAdvice }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* Daily Stats Card */}
            <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3">
                        <span className="bg-indigo-500/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 text-indigo-300">
                            <Activity className="w-6 h-6" />
                        </span>
                        <span>Daily Log</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass-panel bg-white/5 border-white/10 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight</span>
                            <div className="flex items-baseline gap-1">
                                <input
                                    type="number"
                                    value={dailyData.weight}
                                    onChange={e => updateDailyField('weight', Number(e.target.value))}
                                    className="bg-transparent border-none p-0 text-4xl font-black w-24 text-center focus:ring-0 text-white drop-shadow-sm"
                                />
                                <span className="text-sm font-medium text-slate-400">kg</span>
                            </div>
                        </div>

                        <div className="glass-panel bg-white/5 border-white/10 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sleep</span>
                            <div className="flex items-baseline gap-1">
                                <input
                                    type="number"
                                    value={dailyData.sleepHours}
                                    onChange={e => updateDailyField('sleepHours', Number(e.target.value))}
                                    className="bg-transparent border-none p-0 text-4xl font-black w-20 text-center focus:ring-0 text-white drop-shadow-sm"
                                />
                                <span className="text-sm font-medium text-slate-400">hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-wide">
                                    <Zap className="w-4 h-4" /> Energy
                                </div>
                                <span className="text-2xl font-black">{dailyData.energyLevel}/5</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={dailyData.energyLevel}
                                onChange={e => updateDailyField('energyLevel', Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2 text-purple-300 text-sm font-bold uppercase tracking-wide">
                                    <AlertCircle className="w-4 h-4" /> Stress
                                </div>
                                <span className="text-2xl font-black">{dailyData.stressLevel}/5</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={dailyData.stressLevel}
                                onChange={e => updateDailyField('stressLevel', Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Trainer Card */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-[100%] z-0 transition-transform group-hover:scale-110 duration-700"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                                <BrainCircuit className="text-indigo-600 w-6 h-6" />
                                <span>AI Insights</span>
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Smart Health Analysis</p>
                        </div>
                        <button
                            onClick={getTrainerAnalysis}
                            disabled={isConsulting}
                            className="bg-black text-white p-4 rounded-2xl active:scale-90 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:scale-100"
                        >
                            {isConsulting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>

                    {trainerAdvice ? (
                        <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-100 text-sm leading-relaxed text-slate-600 font-medium animate-in fade-in slide-in-from-bottom-2 whitespace-pre-wrap">
                            {trainerAdvice}
                        </div>
                    ) : (
                        <div className="py-12 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-3xl">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <MessageSquareQuote className="w-8 h-8" />
                            </div>
                            <p className="text-slate-400 text-sm font-bold">Tap the arrow to analyze your day</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
