import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { LogOut, RefreshCw, Sparkles } from 'lucide-react';

import { auth, db, appId } from './services/firebase';
import { callGemini } from './services/gemini';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FoodLogs from './components/FoodLogs';
import History from './components/History';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [dailyData, setDailyData] = useState({
    weight: 75,
    sleepHours: 7,
    stressLevel: 3,
    energyLevel: 3,
    soreness: 'none',
  });

  const [foodLogs, setFoodLogs] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [trainerAdvice, setTrainerAdvice] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLocale = new Date().toLocaleDateString();

    const dailyRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', todayStr);
    const unsubDaily = onSnapshot(dailyRef, (snap) => {
      if (snap.exists()) setDailyData(snap.data());
    });

    const historyCol = collection(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs');
    const unsubHistory = onSnapshot(historyCol, (snap) => {
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistoryLogs(logs.sort((a, b) => b.date.localeCompare(a.date)));
    });

    const foodCol = collection(db, 'artifacts', appId, 'users', user.uid, 'foodLogs');
    const unsubFood = onSnapshot(foodCol, (snap) => {
      const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(l => l.date === todayLocale);
      setFoodLogs(logs.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => { unsubDaily(); unsubHistory(); unsubFood(); };
  }, [user]);

  const updateDailyField = async (field, value) => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', todayStr);
    const newData = { ...dailyData, [field]: value, date: todayStr };
    setDailyData(newData);
    await setDoc(dailyRef, newData, { merge: true });
  };

  const getTrainerAnalysis = async () => {
    if (!user) return;
    setIsConsulting(true);
    const context = `
      ข้อมูลร่างกาย: น้ำหนัก ${dailyData.weight}kg, นอน ${dailyData.sleepHours} ชม., พลังงาน ${dailyData.energyLevel}/5, ความเครียด ${dailyData.stressLevel}/5.
      อาหารวันนี้: ${foodLogs.map(f => f.name).join(', ')} (${foodLogs.reduce((a, b) => a + b.kcal, 0)} kcal).
    `;
    const advice = await callGemini(
      context,
      "คุณคือเทรนเนอร์ AI มืออาชีพ วิเคราะห์สถานะร่างกายและการกินวันนี้ แนะนำการออกกำลังกายที่เหมาะสม และวิธีฟื้นฟูร่างกาย ตอบสั้นๆ เป็นกันเอง ภาษาไทย"
    );
    setTrainerAdvice(advice);
    setIsConsulting(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-indigo-500 w-8 h-8" />
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Auth />;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 text-slate-800 relative shadow-2xl overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden max-w-md mx-auto">
        <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="px-6 py-6 sticky top-0 z-50 flex justify-between items-center bg-slate-50/80 backdrop-blur-xl border-b border-indigo-100/50">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-1">
            Trainer<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pro</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            Online
          </p>
        </div>
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-400 opacity-80" />
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6 relative z-10">
        {activeTab === 'dashboard' && (
          <Dashboard
            dailyData={dailyData}
            updateDailyField={updateDailyField}
            isConsulting={isConsulting}
            getTrainerAnalysis={getTrainerAnalysis}
            trainerAdvice={trainerAdvice}
          />
        )}

        {activeTab === 'logs' && (
          <FoodLogs user={user} foodLogs={foodLogs} />
        )}

        {activeTab === 'history' && (
          <History historyLogs={historyLogs} />
        )}

        {activeTab === 'profile' && (
          <Profile user={user} signOut={() => signOut(auth)} />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;