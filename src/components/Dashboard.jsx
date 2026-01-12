import React from 'react';
import { Activity, BrainCircuit, ChevronRight, RefreshCw, MessageSquareQuote, Moon, Zap, AlertCircle, Dumbbell } from 'lucide-react';

const Dashboard = ({ dailyData, saveDailyData, isConsulting, getTrainerAnalysis, trainerAdvice, foodLogs = [], profile, workoutPlan }) => {
    const [localData, setLocalData] = React.useState(dailyData);
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    // Calculate Nutrition Totals
    const totalCalories = foodLogs.reduce((sum, item) => sum + (Number(item.kcal) || 0), 0);
    const totalProtein = foodLogs.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);

    // Get Targets (Default to 2000/120 if not set)
    const targetCalories = profile?.targets?.calories || 2000;
    const targetProtein = profile?.targets?.protein || 120;

    const calProgress = Math.min((totalCalories / targetCalories) * 100, 100);
    const proProgress = Math.min((totalProtein / targetProtein) * 100, 100);

    // Workout Plan Logic
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    const todaysWorkout = workoutPlan?.find(day => day.day === todayName);

    // Sync local state when external dailyData changes (e.g. initial load)
    React.useEffect(() => {
        if (dailyData) setLocalData(dailyData);
    }, [dailyData]);

    const handleChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await saveDailyData(localData);
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Nutrition Overview */}
            <section className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-green-500" />
                        <span>Nutrition Today</span>
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded-full uppercase tracking-widest">
                        Target: {targetCalories} kcal
                    </span>
                </div>

                <div className="space-y-6">
                    {/* Calories */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-600">Calories</span>
                            <span className={totalCalories > targetCalories ? "text-rose-500" : "text-slate-800"}>
                                {totalCalories} <span className="text-slate-300">/ {targetCalories}</span>
                            </span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${totalCalories > targetCalories ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                                style={{ width: `${calProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Protein */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-600">Protein</span>
                            <span className="text-indigo-600">
                                {totalProtein}g <span className="text-slate-300">/ {targetProtein}g</span>
                            </span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-1000"
                                style={{ width: `${proProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

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
                                    value={localData.weight}
                                    onChange={e => handleChange('weight', Number(e.target.value))}
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
                                    value={localData.sleepHours}
                                    onChange={e => handleChange('sleepHours', Number(e.target.value))}
                                    className="bg-transparent border-none p-0 text-4xl font-black w-20 text-center focus:ring-0 text-white drop-shadow-sm"
                                />
                                <span className="text-sm font-medium text-slate-400">hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass-panel bg-white/5 border-white/10 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water</span>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleChange('waterIntake', Math.max(0, localData.waterIntake - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">-</button>
                                <span className="text-2xl font-black w-8 text-center">{localData.waterIntake}</span>
                                <button onClick={() => handleChange('waterIntake', localData.waterIntake + 1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">+</button>
                            </div>
                            <span className="text-[10px] text-slate-400">glasses</span>
                        </div>
                        <div className="glass-panel bg-white/5 border-white/10 p-5 rounded-3xl flex flex-col items-center justify-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout</span>
                            <input
                                type="text"
                                placeholder="Type"
                                value={localData.workoutType}
                                onChange={e => handleChange('workoutType', e.target.value)}
                                className="bg-transparent border-b border-white/20 w-full text-center text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-400"
                            />
                            <div className="flex items-center gap-1 w-full">
                                <input
                                    type="number"
                                    value={localData.workoutDuration}
                                    onChange={e => handleChange('workoutDuration', Number(e.target.value))}
                                    className="bg-transparent border-b border-white/20 w-1/2 text-center text-sm font-bold focus:outline-none focus:border-indigo-400"
                                />
                                <span className="text-[10px] text-slate-400">min</span>
                            </div>
                            <select
                                value={localData.workoutIntensity}
                                onChange={e => handleChange('workoutIntensity', e.target.value)}
                                className="bg-white/10 border-none rounded-lg text-[10px] text-slate-300 w-full p-1 mt-1 text-center outline-none"
                            >
                                <option value="Low" className="text-slate-800">Low Intensity</option>
                                <option value="Medium" className="text-slate-800">Medium</option>
                                <option value="High" className="text-slate-800">High Intensity</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-wide">
                                    <Zap className="w-4 h-4" /> Energy
                                </div>
                                <span className="text-2xl font-black">{localData.energyLevel}/5</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={localData.energyLevel}
                                onChange={e => handleChange('energyLevel', Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2 text-purple-300 text-sm font-bold uppercase tracking-wide">
                                    <AlertCircle className="w-4 h-4" /> Stress
                                </div>
                                <span className="text-2xl font-black">{localData.stressLevel}/5</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={localData.stressLevel}
                                onChange={e => handleChange('stressLevel', Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                            />
                        </div>

                        {/* Body Measurements Toggle */}
                        <div className="bg-slate-800/50 rounded-2xl p-4 space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> Body Stats (in)
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase">Waist</label>
                                    <input
                                        type="number"
                                        placeholder="-"
                                        value={localData.waist || ''}
                                        onChange={e => handleChange('waist', Number(e.target.value))}
                                        className="w-full bg-slate-800 border-none rounded-lg text-center font-bold text-white text-sm py-2 focus:ring-1 focus:ring-pink-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase">Hip</label>
                                    <input
                                        type="number"
                                        placeholder="-"
                                        value={localData.hip || ''}
                                        onChange={e => handleChange('hip', Number(e.target.value))}
                                        className="w-full bg-slate-800 border-none rounded-lg text-center font-bold text-white text-sm py-2 focus:ring-1 focus:ring-pink-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase">Chest</label>
                                    <input
                                        type="number"
                                        placeholder="-"
                                        value={localData.chest || ''}
                                        onChange={e => handleChange('chest', Number(e.target.value))}
                                        className="w-full bg-slate-800 border-none rounded-lg text-center font-bold text-white text-sm py-2 focus:ring-1 focus:ring-pink-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full mt-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${saveSuccess
                            ? 'bg-green-500 text-white shadow-green-500/50'
                            : 'bg-white text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : saveSuccess ? 'Saved Automatically!' : 'Save Daily Log'}
                    </button>
                    {saveSuccess && <p className="text-center text-[10px] text-green-400 font-bold mt-2 uppercase tracking-widest animate-pulse">Changes saved successfully</p>}
                </div>
            </section>

            {/* Today's Workout Card */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

                <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2 mb-6 relative z-10">
                    <span className="bg-indigo-600 text-white p-2 rounded-xl">
                        <Dumbbell className="w-5 h-5" />
                    </span>
                    <span>Today's Plan</span>
                </h3>

                {todaysWorkout ? (
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-black text-2xl text-slate-700 uppercase tracking-tight">{todayName}</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full uppercase tracking-widest">{todaysWorkout.type}</span>
                        </div>

                        {todaysWorkout.exercises?.length > 0 ? (
                            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                {todaysWorkout.exercises.map((ex, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                            <span className="font-bold text-slate-700">{ex.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-400 text-xs bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{ex.sets} x {ex.reps}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-400 font-medium bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
                                Rest Day - Recover & Sleep well 💤
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-400 text-sm font-bold mb-4">No plan for today yet.</p>
                        <button className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b-2 border-indigo-100 hover:border-indigo-500 transition-all">Go to Plan Tab to create one</button>
                    </div>
                )}
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
