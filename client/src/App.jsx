import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, Search, Filter, BarChart3, User as UserIcon, Settings, Sun, Moon, Award, DollarSign, Clock } from 'lucide-react';
import Auth from './components/Auth';
import ProfitMatrix from './components/ProfitMatrix';
import InventoryAging from './components/InventoryAging';
import InventoryList from './components/InventoryList';
import AddDevice from './components/AddDevice';
import Dashboard from './components/Dashboard';
import StatsCards from './components/StatsCards';
import Profile from './components/Profile';
import AdvancedStats from './components/AdvancedStats';
import Leaderboard from './components/Leaderboard';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const fetchUser = useCallback(async (currentToken) => {
    if (!currentToken) return;
    try {
      const res = await fetch('http://localhost:5001/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:5001/api/devices', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.token) {
      setLoading(true);
      Promise.all([
        fetchDevices(),
        fetchUser(user.token)
      ]);
    }
  }, [user?.token, fetchDevices, fetchUser]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const tabs = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'stats', icon: Search, label: 'Analytics' },
    { id: 'inventory', icon: Home, label: 'Inventory' },
    { id: 'add', icon: Plus, label: 'Add Device' },
    { id: 'leaderboard', icon: Award, label: 'Leaderboard' },
    { id: 'profit', icon: DollarSign, label: 'Profit Matrix' },
    { id: 'aging', icon: Clock, label: 'Stock Aging' },
    { id: 'profile', icon: UserIcon, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            <AdvancedStats devices={devices} darkMode={darkMode} />
            <StatsCards devices={devices} darkMode={darkMode} />
            <Dashboard devices={devices} darkMode={darkMode} />
          </>
        );
      case 'stats':
        return <AdvancedStats devices={devices} darkMode={darkMode} />;
      case 'inventory':
        return <InventoryList devices={devices} fetchDevices={fetchDevices} darkMode={darkMode} user={user} loading={loading} />;
      case 'add':
        return <AddDevice fetchDevices={fetchDevices} darkMode={darkMode} user={user} />;
      case 'leaderboard':
        return <Leaderboard darkMode={darkMode} devices={devices} />;
      case 'profit':
        return <ProfitMatrix darkMode={darkMode} devices={devices} />;
      case 'aging':
        return <InventoryAging darkMode={darkMode} devices={devices} />;
      case 'profile':
        return <Profile darkMode={darkMode} user={user} onLogout={handleLogout} setUser={setUser} />;
      case 'settings':
        return (
          <motion.div className="glass-card p-16 rounded-3xl max-w-2xl mx-auto text-center">
            <h2 className={`text-4xl font-black mb-8 ${darkMode ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent'}`}>
              Settings
            </h2>
            <div className="space-y-6 text-left max-w-md mx-auto">
              <div>
                <label className={`block text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Theme</label>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setDarkMode(false)}
                    className={`flex-1 p-4 rounded-2xl font-bold transition-all ${!darkMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl' : 'bg-white/50 dark:bg-slate-700/50 text-gray-800 dark:text-slate-200'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Light
                  </motion.button>
                  <motion.button
                    onClick={() => setDarkMode(true)}
                    className={`flex-1 p-4 rounded-2xl font-bold transition-all ${darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl' : 'bg-white/50 dark:bg-slate-700/50 text-gray-800 dark:text-slate-200'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Dark
                  </motion.button>
                </div>
              </div>
              <motion.button className="btn-primary w-full py-8 text-xl" whileTap={{ scale: 0.98 }}>
                Save Settings
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50'} transition-all duration-1000 relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 right-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-xl animate-ping" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-500/5 rounded-full blur-lg animate-ping delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        <div className="flex items-center justify-between mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-6xl font-black bg-gradient-to-r ${darkMode ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-gray-900 via-blue-600 to-purple-600'} bg-clip-text text-transparent drop-shadow-2xl`}
          >
            TechStock
          </motion.h1>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-4 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-125 ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-white/50'}`}
            whileHover={{ rotate: 360 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`lg:w-96 ${darkMode ? 'bg-slate-800/90' : 'bg-white/95'} rounded-3xl shadow-2xl border border-white/50 p-10 sticky top-12 h-fit hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-700`}
          >
            <nav className="space-y-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-5 p-6 rounded-3xl transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id
                    ? `bg-gradient-to-r from-blue-500/95 to-purple-600/95 text-white shadow-2xl shadow-blue-500/30 transform scale-[1.03] border-2 border-white/30`
                    : `${darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-purple-400/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 hover:border-blue-400/50'} hover:shadow-xl hover:border hover:scale-105`
                  }`}
                  whileHover={{ scale: activeTab === tab.id ? 1.03 : 1.08 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <tab.icon className={`w-7 h-7 transition-transform duration-300 ${activeTab === tab.id ? 'scale-125' : 'group-hover:scale-125'}`} />
                  <span className="font-black tracking-wide text-lg">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 -m-6 rounded-3xl"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          <main className={`flex-1 min-h-[70vh] ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.92 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </div>
  );
}

export default App;