import { motion } from 'framer-motion';
import { BarChart3, Calendar, DollarSign } from 'lucide-react';

const Dashboard = ({ devices, darkMode }) => {
  const monthlyProfit = {};
  devices.forEach(device => {
    if (device.sellDate) {
      const month = new Date(device.sellDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyProfit[month] = (monthlyProfit[month] || 0) + (device.sellPrice - device.buyPrice);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <motion.div className={`glass-card p-10 rounded-3xl h-96 ${darkMode ? 'bg-slate-800/40' : 'bg-white/70'} backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500`}>
        <div className="flex items-center space-x-4 mb-8">
          <div className={`w-16 h-16 ${darkMode ? 'bg-gradient-to-r from-purple-500/80 to-pink-600/80' : 'bg-gradient-to-r from-purple-500/60 to-pink-600/60'} rounded-2xl flex items-center justify-center shadow-2xl`}>
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className={`font-black text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Profit</h3>
            <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Sales overview</p>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(monthlyProfit).map(([month, profit], index) => (
            <motion.div
              key={month}
              initial={{ width: 0, scaleX: 0 }}
              animate={{ width: `${(profit / Math.max(...Object.values(monthlyProfit))) * 95}%`, scaleX: 1 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 400 }}
              className={`h-14 ${darkMode ? 'bg-gradient-to-r from-blue-500/80 to-indigo-600/80 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-r from-blue-500/70 to-indigo-600/70 shadow-xl shadow-blue-500/20'} rounded-2xl flex items-center pl-6 text-white font-bold backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all`}
              whileHover={{ scale: 1.02 }}
            >
              <span>{month}: ${profit.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className={`glass-card p-10 rounded-3xl ${darkMode ? 'bg-slate-800/40' : 'bg-white/70'} backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500`}>
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center p-8 hover:-translate-y-2 transition-all duration-300">
            <div className={`w-20 h-20 ${darkMode ? 'bg-gradient-to-r from-emerald-500/80 to-green-600/80' : 'bg-gradient-to-r from-emerald-500/70 to-green-600/70'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <DollarSign className="w-9 h-9 text-white" />
            </div>
            <div className={`text-4xl font-black ${darkMode ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-lg'} mb-3`}>
              ${devices.reduce((acc, d) => acc + (d.sellPrice - d.buyPrice), 0).toLocaleString()}
            </div>
            <div className={`${darkMode ? 'text-slate-400 font-semibold' : 'text-gray-600 font-bold'}`}>Total Profit</div>
          </div>
          <div className="text-center p-8 hover:-translate-y-2 transition-all duration-300">
            <div className={`w-20 h-20 ${darkMode ? 'bg-gradient-to-r from-orange-500/80 to-red-600/80' : 'bg-gradient-to-r from-orange-500/70 to-red-600/70'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <Calendar className="w-9 h-9 text-white" />
            </div>
            <div className={`text-4xl font-black ${darkMode ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-lg'} mb-3`}>
              {devices.filter(d => d.status === 'sold').length}
            </div>
            <div className={`${darkMode ? 'text-slate-400 font-semibold' : 'text-gray-600 font-bold'}`}>Devices Sold</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
