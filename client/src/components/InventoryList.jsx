import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit3, X, Info, ShoppingCart, Tag, Monitor, Loader2, CheckCircle, AlertTriangle, Save } from 'lucide-react';

const InventoryList = ({ devices, fetchDevices, darkMode, user, loading }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [editDevice, setEditDevice] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const filteredDevices = devices.filter(device => 
    device.model.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === 'all' || device.status === filterStatus) &&
    (filterType === 'all' || device.type === filterType)
  );

  const statuses = ['all', 'available', 'reserved', 'sold'];
  const types = ['all', 'laptop', 'phone', 'component'];

  const deleteDevice = async () => {
    if (!deleteId) return;
    try {
      await fetch(`http://localhost:5001/api/devices/${deleteId}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      fetchDevices();
      setDeleteId(null);
      setNotification({ type: 'success', message: 'Uređaj je uspešno obrisan.' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Greška prilikom brisanja uređaja.' });
    }
  };

  const buyDevice = async (id) => {
    if (isBuying) return;
    setIsBuying(true);
    try {
      const response = await fetch(`http://localhost:5001/api/devices/${id}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Došlo je do greške prilikom kupovine.');
      }

      await fetchDevices();
      setSelectedDevice(null);
      setNotification({ type: 'success', message: 'Uređaj je uspešno kupljen i prebačen u prodate!' });
    } catch (error) {
      setSelectedDevice(null);
      setNotification({ type: 'error', message: error.message });
    } finally {
      setIsBuying(false);
    }
  };

  const openEditModal = (device) => {
    setEditDevice(device);
    setEditFormData({
      type: device.type,
      manufacturer: device.manufacturer,
      model: device.model,
      specs: device.specs || '',
      condition: device.condition,
      buyPrice: device.buyPrice,
      sellPrice: device.sellPrice,
      serialNumber: device.serialNumber || '',
      status: device.status
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5001/api/devices/${editDevice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editFormData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Greška prilikom čuvanja izmena.');
      }

      await fetchDevices();
      setEditDevice(null);
      setNotification({ type: 'success', message: 'Uređaj je uspešno izmenjen!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = `w-full p-4 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`;
  const labelClass = `block text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`backdrop-blur-md rounded-3xl shadow-2xl border p-8 ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white/50'}`}
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-400' : 'bg-white/50 border-gray-200 text-gray-900'}`}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-4 border rounded-xl focus:ring-4 focus:ring-blue-500/20 ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white/50 border-gray-200'}`}
        >
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-4 py-4 border rounded-xl focus:ring-4 focus:ring-blue-500/20 ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white/50 border-gray-200'}`}
        >
          {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {loading && devices.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-24">
          <div className={`w-64 h-2 rounded-full overflow-hidden mb-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className={`text-lg font-bold animate-pulse ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Učitavanje inventara...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-slate-800/50' : 'bg-gradient-to-r from-gray-50 to-gray-100'}>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Type</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Model</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Price</th>
                <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
              <AnimatePresence>
                {filteredDevices.map((device, index) => (
                  <motion.tr
                    key={device._id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors duration-200 ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>{device.type}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>{device.model}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        device.status === 'sold' ? 'bg-red-100 text-red-800' :
                        device.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-green-500 font-semibold">
                      ${device.sellPrice}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => setSelectedDevice(device)} className={`p-2 rounded-xl transition-all ${darkMode ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-600 hover:bg-blue-100 hover:text-blue-900'}`}>
                        <Info className="w-4 h-4" />
                      </button>
                      {device.user === user?._id && (
                        <>
                          <button onClick={() => openEditModal(device)} className={`p-2 rounded-xl transition-all ${darkMode ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900'}`}>
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(device._id)} className={`p-2 rounded-xl transition-all ${darkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-100 hover:text-red-900'}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && filteredDevices.length === 0 && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 text-lg"
        >
          No devices found
        </motion.p>
      )}

      <AnimatePresence>
        {selectedDevice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`max-w-2xl w-full p-8 rounded-[2.5rem] shadow-2xl relative ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
            >
              <button 
                onClick={() => setSelectedDevice(null)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Monitor className="w-8 h-8" />
                </div>
                <div>
                  <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedDevice.manufacturer} {selectedDevice.model}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-sm font-bold ${
                    selectedDevice.status === 'sold' ? 'bg-red-500/10 text-red-500' :
                    selectedDevice.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <Tag className="w-4 h-4" /> {selectedDevice.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 mb-8 p-6 rounded-3xl ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                <div>
                  <span className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Tip Uređaja</span>
                  <p className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{selectedDevice.type}</p>
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Stanje</span>
                  <p className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{selectedDevice.condition}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Specifikacije</span>
                  <p className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {typeof selectedDevice.specs === 'object' && selectedDevice.specs !== null
                      ? Object.entries(selectedDevice.specs).map(([k, v]) => `${k}: ${v}`).join(', ')
                      : selectedDevice.specs || 'Nema dodatih specifikacija.'}
                  </p>
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Cena</span>
                  <p className="text-3xl font-black text-green-500">${selectedDevice.sellPrice}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedDevice.status === 'available' && selectedDevice.user !== user?._id && (
                  <button 
                    onClick={() => buyDevice(selectedDevice._id)}
                    disabled={isBuying}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 font-black rounded-2xl text-white transition-all shadow-lg ${isBuying ? 'bg-gray-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98] shadow-green-500/30'}`}
                  >
                    {isBuying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />} 
                    {isBuying ? 'Kupovina...' : 'Kupi Uređaj'}
                  </button>
                )}
                {selectedDevice.status === 'available' && selectedDevice.user === user?._id && (
                  <div className={`flex-1 text-center py-4 font-bold rounded-2xl ${darkMode ? 'text-orange-400 bg-orange-500/10' : 'text-orange-500 bg-orange-50'}`}>
                    Ovo je vaš uređaj
                  </div>
                )}
                {selectedDevice.status === 'sold' && (
                  <div className={`flex-1 text-center py-4 font-bold rounded-2xl ${darkMode ? 'text-slate-400 bg-slate-500/10' : 'text-slate-500 bg-slate-50'}`}>
                    Uređaj je već prodat
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editDevice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`max-w-3xl w-full p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative my-auto ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
            >
              <button 
                onClick={() => setEditDevice(null)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className={`text-3xl font-black mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Izmeni Uređaj
              </h3>

              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="laptop">Laptop</option>
                    <option value="phone">Phone</option>
                    <option value="component">Component</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Manufacturer</label>
                  <input
                    type="text"
                    value={editFormData.manufacturer}
                    onChange={(e) => setEditFormData({ ...editFormData, manufacturer: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Model</label>
                  <input
                    type="text"
                    value={editFormData.model}
                    onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Condition</label>
                  <select
                    value={editFormData.condition}
                    onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
                    className={inputClass}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Buy Price ($)</label>
                  <input
                    type="number"
                    value={editFormData.buyPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, buyPrice: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Sell Price ($)</label>
                  <input
                    type="number"
                    value={editFormData.sellPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, sellPrice: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Specifications</label>
                  <textarea
                    rows="3"
                    value={editFormData.specs}
                    onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Serial Number</label>
                  <input
                    type="text"
                    value={editFormData.serialNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, serialNumber: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className={inputClass}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => setEditDevice(null)}
                    className={`flex-1 py-4 font-bold rounded-2xl transition-all ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Otkaži
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 font-black rounded-2xl text-white transition-all shadow-lg ${isSaving ? 'bg-blue-500/50 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/30'}`}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                    {isSaving ? 'Čuvanje...' : 'Sačuvaj Izmene'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full p-8 rounded-3xl shadow-2xl relative ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
            >
              <button 
                onClick={() => setDeleteId(null)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Brisanje uređaja</h3>
              <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Da li ste sigurni da želite da obrišete ovaj uređaj? Ova akcija se ne može poništiti.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className={`flex-1 py-4 font-bold rounded-xl transition-all ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Otkaži
                </button>
                <button 
                  onClick={deleteDevice}
                  className="flex-1 py-4 font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                >
                  Obriši
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`flex flex-col items-center p-10 rounded-[2.5rem] shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} text-center max-w-sm w-full relative`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${notification.type === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-400 to-rose-600 text-white'}`}>
                {notification.type === 'success' ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
              </div>
              <h3 className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {notification.type === 'success' ? 'Uspešno!' : 'Greška'}
              </h3>
              <p className={`text-lg font-medium mb-8 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className={`w-full py-4 text-lg font-black rounded-2xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/30'}`}
              >
                U redu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryList;