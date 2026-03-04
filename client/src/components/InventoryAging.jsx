import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, PackageSearch } from 'lucide-react';

const InventoryAging = ({ darkMode, devices }) => {
  const agingData = useMemo(() => {
    if (!devices) return [];
    
    return devices
      .filter(d => d.status !== 'sold' && d.status !== 'reserved')
      .map(d => {
        const rDate = d.receiveDate ? new Date(d.receiveDate) : new Date();
        const diffTime = Math.abs(new Date() - rDate);
        const daysInStock = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return { ...d, daysInStock };
      })
      .sort((a, b) => b.daysInStock - a.daysInStock)
      .slice(0, 15);
  }, [devices]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-black mb-2 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Clock className="w-8 h-8 text-orange-500" /> Analiza Zaliha
          </h2>
          <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
            Prikaz uređaja koji najduže čekaju na prodaju.
          </p>
        </div>
      </div>

      <div className={`rounded-3xl shadow-xl overflow-hidden border ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-gray-100'}`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className={darkMode ? 'bg-slate-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Uređaj</th>
              <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Datum Prijema</th>
              <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Zarobljen Kapital</th>
              <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Dani na Stanju</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-slate-700 bg-slate-800/50' : 'divide-gray-100 bg-white'}`}>
            {agingData.length === 0 ? (
              <tr>
                <td colSpan="4" className={`px-6 py-16 text-center ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <PackageSearch className="w-16 h-16 opacity-30" />
                    <p className="text-lg font-medium">Trenutno nema dostupnih uređaja na stanju.</p>
                  </div>
                </td>
              </tr>
            ) : (
              agingData.map((item, index) => (
                <motion.tr 
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.manufacturer} {item.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                      {new Date(item.receiveDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-500">
                      €{item.buyPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${item.daysInStock > 30 ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {item.daysInStock > 30 && <AlertTriangle className="w-4 h-4" />}
                      {item.daysInStock} dana
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryAging;