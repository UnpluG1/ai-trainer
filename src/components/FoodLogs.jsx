import React, { useState } from 'react';
import { Plus, RefreshCw, Utensils, Trash2, Flame, Scan } from 'lucide-react';
import { addDoc, collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { callGemini } from '../services/gemini';

const FoodLogs = ({ user, foodLogs }) => {
    const [inputText, setInputText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const addFoodWithAI = async () => {
        if (!inputText.trim() || !user) return;
        setIsAnalyzing(true);
        const res = await callGemini(
            `วิเคราะห์อาหาร: ${inputText}`,
            "คุณคือโภชนากรไทย วิเคราะห์ชื่ออาหารและคืนค่าเป็น JSON โดยใช้ key ดังนี้: name (ชื่ออาหารภาษาไทย), kcal (ตัวเลข), protein (ตัวเลข), carbs (ตัวเลข), fat (ตัวเลข)",
            true
        );
        if (res) {
            try {
                const food = JSON.parse(res);
                await addDoc(collection(db, 'users', user.uid, 'foodLogs'), {
                    ...food,
                    date: new Date().toLocaleDateString(),
                    timestamp: Date.now(),
                    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                });
                setInputText("");
            } catch (e) { console.error(e); }
        }
        setIsAnalyzing(false);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-8">
            {/* Input Section */}
            <div className="sticky top-20 z-40">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-slate-100">
                        <div className="pl-4 text-slate-400">
                            <Scan className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="What did you eat today?"
                            className="w-full bg-transparent p-4 outline-none text-slate-700 font-semibold placeholder:text-slate-400"
                        />
                        <button
                            onClick={addFoodWithAI}
                            disabled={isAnalyzing || !inputText}
                            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:scale-100"
                        >
                            {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"></div>
                    <Flame className="w-8 h-8 text-orange-500 mb-3" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Calories</p>
                    <p className="text-4xl font-black text-slate-800">{foodLogs.reduce((a, b) => a + b.kcal, 0)}</p>
                </div>
                <div className="glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    <div className="text-indigo-600 font-black text-2xl mb-3">PRO</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Protein</p>
                    <p className="text-4xl font-black text-slate-800">{foodLogs.reduce((a, b) => a + b.protein, 0)}<span className="text-sm text-slate-400 ml-1">g</span></p>
                </div>
            </div>

            {/* Log List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Meals</h4>
                    <span className="text-xs font-bold text-slate-300 bg-slate-100 px-2 py-1 rounded-md">{foodLogs.length} items</span>
                </div>

                {foodLogs.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <Utensils className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 text-sm font-medium">No meals logged yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {foodLogs.map(log => (
                            <div key={log.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-500 shadow-inner">
                                        {log.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg leading-tight">{log.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{log.kcal} kcal</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteDoc(doc(db, 'users', user.uid, 'foodLogs', log.id))}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-rose-500 transition-all active:scale-90"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodLogs;
