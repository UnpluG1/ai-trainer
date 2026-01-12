import React from 'react';
import { User, LogOut, Settings, Award } from 'lucide-react';

const Profile = ({ user, profile, updateProfile, signOut }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-8">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 flex flex-col items-center">
                <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-28 h-28 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center text-indigo-600 shadow-inner relative z-10 border-4 border-white">
                        <User className="w-12 h-12" />
                    </div>
                </div>

                <h3 className="font-black text-2xl text-slate-800 break-all text-center">{user.email}</h3>
                <div className="mt-2 flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    <Award className="w-3 h-3" /> Premium Member
                </div>

                <div className="w-full mt-8 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Personal Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                            <input
                                type="number"
                                value={profile.height}
                                onChange={(e) => updateProfile('height', Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-center"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={(e) => updateProfile('age', Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-center"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                            <select
                                value={profile.gender}
                                onChange={(e) => updateProfile('gender', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-center appearance-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Goal</label>
                            <select
                                value={profile.goal}
                                onChange={(e) => updateProfile('goal', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-center appearance-none"
                            >
                                <option value="Lose Weight">Lose Weight</option>
                                <option value="Build Muscle">Build Muscle</option>
                                <option value="Maintain">Maintain</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button className="w-full py-4 px-6 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm tracking-wide flex items-center justify-between hover:bg-slate-100 transition-colors">
                            <span className="flex items-center gap-3"><Settings className="w-5 h-5 text-slate-400" /> Account Settings</span>
                            <span className="text-slate-300">→</span>
                        </button>

                        <button onClick={signOut} className="w-full py-4 px-6 rounded-2xl bg-rose-50 text-rose-500 font-bold text-sm tracking-wide flex items-center justify-between hover:bg-rose-100 transition-colors group">
                            <span className="flex items-center gap-3"><LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out</span>
                        </button>
                    </div>
                </div>
            </section>

            <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Trainer Pro v1.0.0
            </p>
        </div>
    );
};

export default Profile;
