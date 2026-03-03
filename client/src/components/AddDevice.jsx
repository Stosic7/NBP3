import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const AddDevice = ({ fetchDevices, user }) => {
  const [formData, setFormData] = useState({
    type: "laptop",
    manufacturer: "",
    model: "",
    specs: "",
    condition: "excellent",
    buyPrice: "",
    sellPrice: "",
    receiveDate: "",
    serialNumber: "",
    status: "available",
    warranty: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        buyPrice: parseFloat(formData.buyPrice) || 0,
        sellPrice: parseFloat(formData.sellPrice) || 0,
      };
      await fetch("http://localhost:5001/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      fetchDevices();
      setFormData({
        type: "laptop",
        manufacturer: "",
        model: "",
        specs: "",
        condition: "excellent",
        buyPrice: "",
        sellPrice: "",
        receiveDate: "",
        serialNumber: "",
        status: "available",
        warranty: "",
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full p-4 border border-gray-200 rounded-xl " +
    "focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all " +
    "bg-white text-gray-900 " +
    "dark:bg-white dark:text-black dark:border-gray-300 " +
    "dark:placeholder-gray-500";

  return (
    <>
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold text-base">Uređaj uspešno dodat!</p>
                <p className="text-sm text-green-100">
                  Uređaj je sačuvan u sistemu.
                </p>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-b-2xl"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-12 max-w-2xl mx-auto"
      >
        <motion.h2
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
        >
          Add New Device
        </motion.h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className={fieldClass}
            >
              <option value="laptop">Laptop</option>
              <option value="phone">Phone</option>
              <option value="component">Component</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Manufacturer
            </label>
            <input
              type="text"
              placeholder="e.g. Dell"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. XPS 13"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className={fieldClass}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Buy Price ($)
            </label>
            <input
              type="number"
              placeholder="500"
              value={formData.buyPrice}
              onChange={(e) =>
                setFormData({ ...formData, buyPrice: e.target.value })
              }
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Sell Price ($)
            </label>
            <input
              type="number"
              placeholder="700"
              value={formData.sellPrice}
              onChange={(e) =>
                setFormData({ ...formData, sellPrice: e.target.value })
              }
              className={fieldClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Specifications
            </label>
            <textarea
              rows="3"
              placeholder="RAM, Storage, CPU..."
              value={formData.specs}
              onChange={(e) =>
                setFormData({ ...formData, specs: e.target.value })
              }
              className={fieldClass + " resize-none"}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Serial Number
            </label>
            <input
              type="text"
              placeholder="SN123456"
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={fieldClass}
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
              <span>{loading ? "Dodavanje..." : "Add Device"}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default AddDevice;
