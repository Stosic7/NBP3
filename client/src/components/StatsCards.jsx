import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, Package } from 'lucide-react';

const StatsCards = ({ devices, darkMode }) => {
  const totalDevices = devices.length;
  const soldDevices = devices.filter(d => d.status === 'sold').length;
  const profit = devices.reduce((acc, d) => acc + (d.sellPrice - d.buyPrice), 0);
  const avgProfit = profit / totalDevices || 0;

  const stats = [
    { value: totalDevices, label: 'Total Devices', icon: Package, color: 'from-emerald-500 to-green-600' },
    { value: `$${profit.toLocaleString()}`, label: 'Total Profit', icon: DollarSign, color: 'from-blue-500 to-indigo-600' },
    { value: `${((soldDevices/totalDevices)*100).toFixed(1)}%`, label: 'Sold Rate', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
    { value: `$${avgProfit.toFixed(0)}`, label: 'Avg Profit', icon: Clock, color: 'from-orange-500 to-red-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.12 }}
          className={`glass-card p-10 rounded-3xl group hover:-translate-y-4 transition-all duration-700 ${darkMode ? 'hover:border-purple-400/50 hover:shadow-purple-500/20' : 'hover:border-blue-400/50 hover:shadow-blue-500/20'}`}
          whileHover={{ scale: 1.08 }}
        >
          <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl ${stat.color} shadow-2xl group-hover:scale-110 transition-all duration-300`}>
            <stat.icon className="w-10 h-10 text-white drop-shadow-lg" />
            <div className="w-3 h-3 rounded-full bg-white/30 animate-ping" />
          </div>
          <div className={`text-4xl font-black mb-2 ${darkMode ? 'text-white drop-shadow-2xl' : 'text-gray-900 drop-shadow-2xl'}`}>{stat.value}</div>
          <div className={`${darkMode ? 'text-slate-400 font-bold text-lg' : 'text-gray-700 font-bold text-lg'}`}>{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
