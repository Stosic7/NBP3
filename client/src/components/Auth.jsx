import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Camera, X } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Slika je prevelika. Maksimalna veličina je 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, avatar: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Greška pri autentifikaciji');
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-slate-800/90 rounded-3xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
          {isLogin ? 'Dobrodošli nazad' : 'Kreirajte profil'}
        </h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-6 text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col items-center mb-6">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
              />
              <div className="relative group cursor-pointer" onClick={() => !formData.avatar && fileInputRef.current?.click()}>
                <div className={`w-28 h-28 rounded-full border-4 ${formData.avatar ? 'border-purple-500' : 'border-slate-600 border-dashed'} flex items-center justify-center overflow-hidden bg-slate-900 transition-all group-hover:border-purple-400`}>
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  )}
                </div>
                {formData.avatar && (
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(); }} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-400 text-sm mt-3 font-medium">
                {formData.avatar ? 'Slika uspešno dodata' : 'Kliknite da dodate sliku profila'}
              </p>
            </motion.div>
          )}

          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="Ime i prezime" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="email" placeholder="Email adresa" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="password" placeholder="Lozinka" required minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
          </div>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all mt-4">
            {isLogin ? 'Prijavi se' : 'Registruj se'}
          </motion.button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-slate-400 hover:text-white transition-colors text-sm">
            {isLogin ? 'Nemate nalog? Registrujte se' : 'Već imate nalog? Prijavite se'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;