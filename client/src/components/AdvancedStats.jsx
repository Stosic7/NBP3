import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Zap, Star, Clock } from 'lucide-react';

const AdvancedStats = ({ devices, darkMode }) => {
  const totalDevices = devices.length;
  const soldDevices = devices.filter(d => d.status === 'sold').length;
  const availableDevices = devices.filter(d => d.status === 'available').length;
  const profit = devices.reduce((acc, d) => acc + (d.sellPrice - d.buyPrice), 0);
  const avgProfit = profit / soldDevices || 0;
  const conversionRate = ((soldDevices / totalDevices) * 100).toFixed(1);

  const stats = [
    { value: totalDevices.toLocaleString(), label: 'Total Inventory', icon: Package, color: 'from-emerald-500 to-teal-600' },
    { value: soldDevices.toLocaleString(), label: 'Sold Items', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
    { value: `${conversionRate}%`, label: 'Conversion', icon: Zap, color: 'from-purple-500 to-violet-600' },
    { value: `$${avgProfit.toLocaleString()}`, label: 'Avg Profit', icon: Star, color: 'from-orange-500 to-amber-600' },
    { value: availableDevices, label: 'Available', icon: Users, color: 'from-green-500 to-emerald-600' },
    { value: `${(profit/totalDevices || 0).toFixed(0)}%`, label: 'ROI', icon: Clock, color: 'from-pink-500 to-rose-600' }
  ];

  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.08 }}
          className={`glass-card p-10 rounded-3xl text-center group hover:-translate-y-3 transition-all duration-500 ${darkMode ? 'hover:border-purple-400/50' : 'hover:border-blue-400/50'}`}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`w-20 h-20 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white/20`}>
            <stat.icon className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <motion.div 
            className={`text-4xl font-black mb-3 ${darkMode ? 'text-white drop-shadow-2xl' : 'text-gray-900 drop-shadow-2xl'}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
          >
            {stat.value}
          </motion.div>
          <div className={`${darkMode ? 'text-slate-400 font-bold' : 'text-gray-700 font-bold text-lg'}`}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AdvancedStats;
