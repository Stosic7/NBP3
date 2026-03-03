import { motion } from 'framer-motion';
import { LogOut, Mail, Shield, Zap, Package, Award, TrendingUp, ChevronRight } from 'lucide-react';

const Profile = ({ darkMode, user, onLogout }) => {
  if (!user) return null;

  const safePoints = user.points || 0;
  const safeLevel = user.level || 1;
  const experienceToNextLevel = safeLevel * 1000;
  const progress = (safePoints / experienceToNextLevel) * 100 || 0;

  const stats = [
    { label: 'Ukupno Bodova', value: safePoints, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Dodati Uređaji', value: user.devicesCount || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Trenutni Rank', value: safePoints > 500 ? 'Expert' : 'Novice', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2.5rem] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-white'}`}
      >
        <div className="h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -bottom-16 left-12 flex items-end gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className={`w-40 h-40 rounded-3xl border-8 object-cover shadow-2xl ${darkMode ? 'border-slate-800' : 'border-white'} bg-slate-200`} 
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg border-4 border-inherit">
                LVL {Math.floor(safePoints / 1000) + 1}
              </div>
            </motion.div>
            <div className="mb-4">
              <h2 className={`text-5xl font-black mb-2 drop-shadow-lg ${darkMode ? 'text-white' : 'text-white'}`}>
                {user.name}
              </h2>
              <div className="flex items-center gap-3 text-white/90 font-medium">
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                  <Shield className="w-4 h-4" /> Administrator
                </span>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                  <TrendingUp className="w-4 h-4" /> {safePoints > 500 ? 'Top 5%' : 'Novi Član'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-24 px-12 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
              >
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
                <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className={`p-8 rounded-[2rem] mb-12 ${darkMode ? 'bg-slate-900/50' : 'bg-blue-50/50'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Progres do sledećeg nivoa</span>
              <span className="text-purple-500 font-black">{Math.floor(progress)}%</span>
            </div>
            <div className={`h-4 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
              />
            </div>
            <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Još {experienceToNextLevel - safePoints} bodova do Levela {Math.floor(safePoints / 1000) + 2}!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, x: 5 }} 
              whileTap={{ scale: 0.98 }} 
              className="flex-1 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-5 rounded-2xl font-black shadow-xl"
            >
              Uredi Profil <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={onLogout}
              className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-8 py-5 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all border-2 border-transparent hover:border-red-400"
            >
              <LogOut className="w-5 h-5" /> Odjavi se
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;