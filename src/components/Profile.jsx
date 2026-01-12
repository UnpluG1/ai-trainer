import React from 'react';
import { User, LogOut, Settings, Award, RefreshCw } from 'lucide-react';

const Profile = ({ user, profile, currentWeight, saveProfileData, signOut }) => {
    const [localProfile, setLocalProfile] = React.useState({
        ...profile,
        activityLevel: profile?.activityLevel || 'Sedentary',
        targets: profile?.targets || { calories: 2000, protein: 100 }
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    // Sync local state when external profile changes
    React.useEffect(() => {
        if (profile) {
            setLocalProfile(prev => ({
                ...prev,
                ...profile,
                activityLevel: profile.activityLevel || prev.activityLevel || 'Sedentary'
            }));
        }
    }, [profile]);

    const calculateTargets = () => {
        if (!currentWeight || !localProfile.height || !localProfile.age) return null;

        // Mifflin-St Jeor Equation
        let bmr = (10 * currentWeight) + (6.25 * localProfile.height) - (5 * localProfile.age);
        bmr += localProfile.gender === 'Male' ? 5 : -161;

        const activityMultipliers = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Moderately Active': 1.55,
            'Very Active': 1.725,
            'Extra Active': 1.9
        };

        const tdee = Math.round(bmr * (activityMultipliers[localProfile.activityLevel] || 1.2));

        // Goal Adjustment
        let targetCalories = tdee;
        if (localProfile.goal === 'Lose Weight') targetCalories -= 500;
        else if (localProfile.goal === 'Build Muscle') targetCalories += 300;

        // Protein (2g per kg bodyweight)
        const targetProtein = Math.round(currentWeight * 2);

        return { calories: targetCalories, protein: targetProtein, bmr, tdee };
    };

    const calculatedTargets = calculateTargets();

    const handleChange = (field, value) => {
        setLocalProfile(prev => ({ ...prev, [field]: value }));
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Save computed targets to database so other components can use them
        const dataToSave = {
            ...localProfile,
            targets: calculatedTargets ? { calories: calculatedTargets.calories, protein: calculatedTargets.protein } : localProfile.targets
        };
        await saveProfileData(dataToSave);
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center">
                <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center text-indigo-600 shadow-inner relative z-10 border-4 border-white">
                        <User className="w-10 h-10" />
                    </div>
                </div>

                <h3 className="font-black text-xl text-slate-800 break-all text-center">{user.email}</h3>

                {/* Stats Grid */}
                <div className="w-full mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                            <input
                                type="number"
                                value={localProfile.height}
                                onChange={(e) => handleChange('height', Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-100 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                            <input
                                type="number"
                                value={localProfile.age}
                                onChange={(e) => handleChange('age', Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-100 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                            <select
                                value={localProfile.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-center outline-none appearance-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Goal</label>
                            <select
                                value={localProfile.goal}
                                onChange={(e) => handleChange('goal', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-center outline-none appearance-none"
                            >
                                <option value="Lose Weight">Lose Weight</option>
                                <option value="Build Muscle">Build Muscle</option>
                                <option value="Maintain">Maintain</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Activity Level</label>
                        <select
                            value={localProfile.activityLevel}
                            onChange={(e) => handleChange('activityLevel', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-center outline-none"
                        >
                            <option value="Sedentary">Sedentary (Little to no exercise)</option>
                            <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                            <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                            <option value="Very Active">Very Active (6-7 days/week)</option>
                            <option value="Extra Active">Extra Active (Physical job/training)</option>
                        </select>
                    </div>

                    {calculatedTargets && (
                        <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 mt-4">
                            <h4 className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
                                <Award className="w-4 h-4" /> Daily Targets
                            </h4>
                            <div className="flex justify-between items-center text-center">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                                    <p className="text-xl font-black text-slate-800">{calculatedTargets.calories}</p>
                                </div>
                                <div className="w-px h-8 bg-indigo-200/50"></div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Protein</p>
                                    <p className="text-xl font-black text-slate-800">{calculatedTargets.protein}g</p>
                                </div>
                                <div className="w-px h-8 bg-indigo-200/50"></div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">TDEE</p>
                                    <p className="text-xl font-black text-slate-400">{calculatedTargets.tdee}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${saveSuccess
                            ? 'bg-green-500 text-white shadow-green-500/50'
                            : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700'
                            }`}
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : saveSuccess ? 'Settings Saved' : 'Update Profile & Targets'}
                    </button>
                    {saveSuccess && <p className="text-center text-[10px] text-green-400 font-bold -mt-2 uppercase tracking-widest animate-pulse">Targets Updated Automatically</p>}

                    <div className="pt-4 space-y-3 border-t border-slate-100 mt-4">
                        <button onClick={signOut} className="w-full py-4 px-6 rounded-2xl bg-rose-50 text-rose-500 font-bold text-sm tracking-wide flex items-center justify-between hover:bg-rose-100 transition-colors group">
                            <span className="flex items-center gap-3"><LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out</span>
                        </button>
                    </div>
                </div>
            </section>

            <p className="text-slate-400 text-sm">Update your personal stats for better AI accuracy.</p>
            <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest">v1.1.0 (Sync Fix)</p>
            <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Trainer Pro v1.0.0
            </p>
        </div>
    );
};

export default Profile;
