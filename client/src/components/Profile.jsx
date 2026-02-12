import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, Award } from 'lucide-react';

const Profile = ({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`glass-card p-12 rounded-3xl max-w-4xl mx-auto ${darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/80 border-blue-500/20'} backdrop-blur-2xl shadow-2xl border`}
    >
      <div className="text-center mb-16">
        <div className={`w-32 h-32 ${darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} rounded-3xl mx-auto mb-8 shadow-2xl border-4 border-white/20 flex items-center justify-center`}>
          <User className="w-16 h-16 text-white" />
        </div>
        <h2 className={`text-5xl font-black ${darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent'}`}>John Doe</h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} text-xl mt-2`}>Tech Entrepreneur</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <motion.div className={`glass-card p-8 rounded-2xl ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`} whileHover={{ y: -4 }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${darkMode ? 'bg-emerald-500/60' : 'bg-emerald-500/40'} rounded-xl flex items-center justify-center`}>
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-xl">Contact</h3>
            </div>
            <div className="space-y-2">
              <p className={`${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>john@techstock.com</p>
              <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>+381 64 123 4567</p>
            </div>
          </motion.div>

          <motion.div className={`glass-card p-8 rounded-2xl ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`} whileHover={{ y: -4 }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${darkMode ? 'bg-blue-500/60' : 'bg-blue-500/40'} rounded-xl flex items-center justify-center`}>
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl">Location</h3>
            </div>
            <p className={`${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>Niš, Serbia</p>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div className={`glass-card p-8 rounded-2xl ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`} whileHover={{ y: -4 }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${darkMode ? 'bg-orange-500/60' : 'bg-orange-500/40'} rounded-xl flex items-center justify-center`}>
                <CreditCard className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-bold text-xl">Payments</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Sales</span>
                <span className="font-bold text-2xl">$47,892</span>
              </div>
              <div className="flex justify-between">
                <span className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>This Month</span>
                <span className="font-bold text-xl text-emerald-500">$8,420</span>
              </div>
            </div>
          </motion.div>

          <motion.div className={`glass-card p-8 rounded-2xl ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`} whileHover={{ y: -4 }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${darkMode ? 'bg-purple-500/60' : 'bg-purple-500/40'} rounded-xl flex items-center justify-center`}>
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-xl">Achievements</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className={`${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>100+ Devices Sold</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className={`${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>Top Seller 2025</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
