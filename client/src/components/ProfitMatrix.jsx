import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package } from 'lucide-react';

const ProfitMatrix = ({ darkMode, devices }) => {
  const matrixData = useMemo(() => {
    if (!devices) return [];
    
    const buckets = {
      0: { _id: 0, count: 0, totalProfit: 0, devices: [] },
      50: { _id: 50, count: 0, totalProfit: 0, devices: [] },
      150: { _id: 150, count: 0, totalProfit: 0, devices: [] },
      300: { _id: 300, count: 0, totalProfit: 0, devices: [] },
      1000: { _id: 1000, count: 0, totalProfit: 0, devices: [] }
    };

    devices.forEach(d => {
      if (d.status === 'sold') {
        const profit = d.sellPrice - d.buyPrice;
        let bucketId = 1000;
        
        if (profit < 50) bucketId = 0;
        else if (profit < 150) bucketId = 50;
        else if (profit < 300) bucketId = 150;
        else if (profit < 1000) bucketId = 300;

        buckets[bucketId].count += 1;
        buckets[bucketId].totalProfit += profit;
        buckets[bucketId].devices.push({ manufacturer: d.manufacturer, model: d.model, profit });
      }
    });

    return Object.values(buckets)
      .filter(b => b.count > 0)
      .map(b => {
        b.devices.sort((x, y) => y.profit - x.profit);
        return b;
      })
      .sort((a, b) => a._id - b._id);
  }, [devices]);

  const getBucketLabel = (id) => {
    if (id === 0) return 'Niska marža (0 - 50€)';
    if (id === 50) return 'Dobra marža (50 - 150€)';
    if (id === 150) return 'Visoka marža (150 - 300€)';
    if (id === 300) return 'Ekstra profit (300 - 1000€)';
    return 'Premium klasa (>1000€)';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Matrica Profitabilnosti
        </h2>
        <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
          Segmentacija prodate opreme prema ostvarenoj dobiti
        </p>
      </div>

      {matrixData.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className={`w-16 h-16 mx-auto mb-4 opacity-30 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Trenutno nema podataka o profitu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matrixData.map((bucket, index) => (
            <motion.div
              key={bucket._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-3xl shadow-xl border ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-gray-100'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">
                    Kategorija
                  </span>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getBucketLabel(bucket._id)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <Package className="w-4 h-4" /> Prodata količina
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {bucket.count} kom
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <DollarSign className="w-4 h-4" /> Ukupan profit grupe
                  </span>
                  <span className="font-bold text-green-500">
                    €{bucket.totalProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <span className={`text-xs font-semibold mb-3 block ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  NAJPRODAVANIJI U KLASI:
                </span>
                <ul className="space-y-2">
                  {bucket.devices.slice(0, 3).map((device, i) => (
                    <li key={i} className={`text-sm flex justify-between ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <span>{device.manufacturer} {device.model}</span>
                      <span className="text-green-500 font-medium">+€{device.profit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfitMatrix;