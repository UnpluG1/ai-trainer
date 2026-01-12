import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');
        setLoading(true);
        try {
            if (isRegister) await createUserWithEmailAndPassword(auth, email, password);
            else await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setAuthError('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรืออาจมีผู้ใช้นี้อยู่แล้ว');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[3rem] shadow-2xl skew-y-3 origin-top-left scale-110"></div>
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-10 space-y-2">
                    <div className="bg-white p-4 rounded-3xl w-24 h-24 mx-auto shadow-2xl shadow-indigo-500/30 flex items-center justify-center mb-6 animate-bounce-slow">
                        <BrainCircuit className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Trainer Pro</h1>
                    <p className="text-indigo-100 font-medium text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3" /> Personal Fitness AI
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl backdrop-blur-2xl bg-white/90 shadow-2xl shadow-slate-300">
                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-field w-full"
                                placeholder="hello@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-3">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input-field w-full"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {authError && (
                            <div className="bg-rose-50 text-rose-500 text-xs py-3 px-4 rounded-xl border border-rose-100 text-center font-medium animate-in fade-in slide-in-from-top-1">
                                {authError}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : (
                                <>
                                    {isRegister ? 'Create Account' : 'Sign In Now'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-slate-500 text-sm font-semibold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                        {isRegister ? 'Already have an account? Log In' : 'New here? Create Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
