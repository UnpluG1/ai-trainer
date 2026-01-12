import React, { useState } from 'react';
import { Calendar, Dumbbell, Play, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { callGemini } from '../services/gemini';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const WorkoutPlanner = ({ user, profile }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [weeklyPlan, setWeeklyPlan] = useState(null);
    const [preferences, setPreferences] = useState({
        days: 3,
        equipment: 'Bodyweight',
        focus: 'Full Body'
    });

    const generatePlan = async () => {
        setIsGenerating(true);
        const prompt = `
            Create a weekly workout plan for a ${profile.age} year old ${profile.gender} who wants to "${profile.goal}".
            Current stats: Height ${profile.height}m.
            Preferences: ${preferences.days} days/week, Equipment: ${preferences.equipment}, Focus: ${preferences.focus}.
            
            Return ONLY a valid JSON object with this key: "weekly_plan".
            "weekly_plan" should be an array of objects for each workout day (or rest day).
            Each object format: { "day": "Monday", "type": "Upper Body", "exercises": [{"name": "Pushups", "sets": "3", "reps": "12"}] }.
            For Rest days, exercises should be empty array.
        `;

        const res = await callGemini(prompt, "You are a professional fitness coach. Return strictly JSON.", true);
        if (res) {
            try {
                const plan = JSON.parse(res);
                setWeeklyPlan(plan.weekly_plan);
                await savePlan(plan.weekly_plan);
            } catch (e) {
                console.error("JSON Parse Error", e);
                alert("AI Error. Please try again.");
            }
        }
        setIsGenerating(false);
    };

    const savePlan = async (plan) => {
        if (!user) return;
        await setDoc(doc(db, 'users', user.uid, 'plans', 'current'), {
            plan,
            createdAt: Date.now(),
            preferences
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full"></div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 relative z-10">
                    <Calendar className="w-8 h-8 text-indigo-600" />
                    Workout Plan
                </h2>
                <p className="text-slate-400 text-sm font-bold mt-1">AI-Generated Weekly Schedule</p>
            </div>

            {/* Generator Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-700">Setup your plan</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Days / Week</label>
                        <select
                            value={preferences.days}
                            onChange={e => setPreferences({ ...preferences, days: e.target.value })}
                            className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} Days</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Equipment</label>
                        <select
                            value={preferences.equipment}
                            onChange={e => setPreferences({ ...preferences, equipment: e.target.value })}
                            className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none"
                        >
                            <option value="Bodyweight">Bodyweight Only</option>
                            <option value="Dumbbells">Dumbbells</option>
                            <option value="Full Gym">Full Gym</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-indigo-500/30"
                >
                    {isGenerating ? <RefreshCw className="animate-spin" /> : <Play className="fill-current" />}
                    {isGenerating ? 'Designing Plan...' : 'Generate New Plan'}
                </button>
            </div>

            {/* Plan Display */}
            <div className="space-y-4">
                {weeklyPlan?.map((day, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-black text-indigo-600 uppercase tracking-wider text-sm">{day.day}</span>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-400 px-2 py-1 rounded-lg">{day.type}</span>
                        </div>
                        {day.exercises?.length > 0 ? (
                            <ul className="space-y-2">
                                {day.exercises.map((ex, j) => (
                                    <li key={j} className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-700">{ex.name}</span>
                                        <span className="text-slate-400 font-medium text-xs">{ex.sets} x {ex.reps}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium italic">
                                <CheckCircle2 className="w-4 h-4" /> Rest & Recover
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutPlanner;
