import React from 'react';
import { Target, Utensils, History as HistoryIcon, User } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', icon: Target },
        { id: 'logs', icon: Utensils },
        { id: 'history', icon: HistoryIcon },
        { id: 'profile', icon: User }
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto max-w-md z-[100]">
            <nav className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl shadow-indigo-900/10 p-2 flex items-center gap-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
              ${activeTab === tab.id
                                ? 'text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white/50 scale-110 -translate-y-2'
                                : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
                            }
            `}
                    >
                        {/* Background for active tab */}
                        {activeTab === tab.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl -z-10 animate-in fade-in zoom-in duration-300"></div>
                        )}

                        <tab.icon strokeWidth={2.5} className={`w-6 h-6 transition-transform duration-300 ${activeTab === tab.id ? 'scale-90' : 'group-hover:scale-110'}`} />

                        {/* Active Indicator Dot (optional, removed for cleaner look but kept logic ready) */}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Navigation;
