import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const AddDevice = ({ fetchDevices }) => {
  const [formData, setFormData] = useState({
    type: 'laptop',
    manufacturer: '',
    model: '',
    specs: '',
    condition: 'excellent',
    buyPrice: 0,
    sellPrice: 0,
    receiveDate: '',
    serialNumber: '',
    status: 'available',
    warranty: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      fetchDevices();
      setFormData({
        type: 'laptop', manufacturer: '', model: '', specs: '', condition: 'excellent',
        buyPrice: 0, sellPrice: 0, receiveDate: '', serialNumber: '', status: 'available', warranty: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-12 max-w-2xl mx-auto"
    >
      <motion.h2 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
      >
        Add New Device
      </motion.h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="laptop">Laptop</option>
            <option value="phone">Phone</option>
            <option value="component">Component</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
          <input
            type="text"
            placeholder="e.g. Dell"
            value={formData.manufacturer}
            onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
          <input
            type="text"
            placeholder="e.g. XPS 13"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
          <select 
            value={formData.condition} 
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buy Price ($)</label>
          <input
            type="number"
            placeholder="500"
            value={formData.buyPrice}
            onChange={(e) => setFormData({...formData, buyPrice: parseFloat(e.target.value) || 0})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sell Price ($)</label>
          <input
            type="number"
            placeholder="700"
            value={formData.sellPrice}
            onChange={(e) => setFormData({...formData, sellPrice: parseFloat(e.target.value) || 0})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Specifications</label>
          <textarea
            rows="3"
            placeholder="RAM, Storage, CPU..."
            value={formData.specs}
            onChange={(e) => setFormData({...formData, specs: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Serial Number</label>
          <input
            type="text"
            placeholder="SN123456"
            value={formData.serialNumber}
            onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            value={formData.status} 
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-3 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-6 h-6" />
            <span>{loading ? 'Adding...' : 'Add Device'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddDevice;
