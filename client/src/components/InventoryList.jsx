import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, Edit3 } from 'lucide-react';

const InventoryList = ({ devices, fetchDevices }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredDevices = devices.filter(device => 
    device.model.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === 'all' || device.status === filterStatus) &&
    (filterType === 'all' || device.type === filterType)
  );

  const statuses = ['all', 'available', 'reserved', 'sold'];
  const types = ['all', 'laptop', 'phone', 'component'];

  const deleteDevice = async (id) => {
    if (confirm('Delete this device?')) {
      await fetch(`http://localhost:5001/api/devices/${id}`, { method: 'DELETE' });
      fetchDevices();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 bg-white/50"
        >
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 bg-white/50"
        >
          {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Model</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Profit</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredDevices.map((device, index) => (
                <motion.tr
                  key={device._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{device.type}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{device.model}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      device.status === 'sold' ? 'bg-green-100 text-green-800' :
                      device.status === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-green-600 font-semibold">
                    ${(device.sellPrice - device.buyPrice).toFixed(0)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-100 rounded-xl transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteDevice(device._id)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-100 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {filteredDevices.length === 0 && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 text-lg"
        >
          No devices found
        </motion.p>
      )}
    </motion.div>
  );
};

export default InventoryList;
