import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp, ShoppingBag } from "lucide-react";

const getRankConfig = (index) => {
  if (index === 0)
    return {
      bg: "from-amber-400 via-yellow-300 to-amber-500",
      border: "border-amber-400/60",
      badge: "bg-amber-400 text-amber-900",
      icon: <Trophy className="w-5 h-5" />,
      glow: "shadow-[0_0_30px_rgba(251,191,36,0.4)]",
      label: "1st",
    };
  if (index === 1)
    return {
      bg: "from-slate-400 via-gray-300 to-slate-500",
      border: "border-slate-400/60",
      badge: "bg-slate-400 text-slate-900",
      icon: <Medal className="w-5 h-5" />,
      glow: "shadow-[0_0_20px_rgba(148,163,184,0.4)]",
      label: "2nd",
    };
  if (index === 2)
    return {
      bg: "from-orange-400 via-amber-300 to-orange-500",
      border: "border-orange-400/60",
      badge: "bg-orange-400 text-orange-900",
      icon: <Medal className="w-5 h-5" />,
      glow: "shadow-[0_0_20px_rgba(251,146,60,0.35)]",
      label: "3rd",
    };
  return {
    bg: "from-blue-500/20 to-indigo-500/10",
    border: "border-white/10",
    badge: "bg-white/20 text-white",
    icon: <Star className="w-4 h-4" />,
    glow: "",
    label: `${index + 1}th`,
  };
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-orange-500 to-amber-600",
  "from-indigo-500 to-blue-600",
];

const Leaderboard = ({ darkMode, devices }) => {
  const customers = useMemo(() => {
    if (!devices) return [];
    const customersMap = {};
    
    devices.forEach(d => {
      if (d.status === 'sold' && d.customer && d.customer.email) {
        const email = d.customer.email;
        if (!customersMap[email]) {
          customersMap[email] = {
            _id: email,
            name: d.customer.name,
            totalSpent: 0,
            devicesBought: 0
          };
        }
        customersMap[email].totalSpent += d.sellPrice;
        customersMap[email].devicesBought += 1;
      }
    });

    return Object.values(customersMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }, [devices]);

  const top3 = customers.slice(0, 3);
  const rest = customers.slice(3);
  const maxSpent = customers[0]?.totalSpent || 1;

  return (
    <div className="glass-card rounded-3xl p-8 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-4 py-2 rounded-full mb-4 tracking-widest uppercase">
          <TrendingUp className="w-3 h-3" /> Zasnovano na ukupnoj potrošnji
        </div>
        <h2
          className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${darkMode ? "from-blue-400 via-purple-400 to-pink-400" : "from-gray-900 via-blue-600 to-purple-600"} bg-clip-text text-transparent`}
        >
          Top Kupci
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Najvernije mušterije po ukupnoj vrednosti kupovina
        </p>
      </motion.div>

      {customers.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Trenutno nema podataka o prodatim uređajima i kupcima.</p>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-center gap-4 mb-10 max-w-2xl mx-auto">
            {[top3[1], top3[0], top3[2]].map((customer, visualIndex) => {
              if (!customer)
                return <div key={visualIndex} className="flex-1" />;
              const realIndex =
                visualIndex === 0 ? 1 : visualIndex === 1 ? 0 : 2;
              const config = getRankConfig(realIndex);
              const heights = ["h-28", "h-40", "h-20"];

              return (
                <motion.div
                  key={customer._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: realIndex * 0.15,
                    duration: 0.5,
                    type: "spring",
                  }}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`relative mb-3 ${realIndex === 0 ? "scale-110" : ""}`}
                  >
                    {realIndex === 0 && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl"
                      >
                        👑
                      </motion.div>
                    )}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[realIndex % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg ${config.glow}`}
                    >
                      {getInitials(customer.name)}
                    </div>
                  </div>

                  <p className="font-bold text-sm text-center mb-1 truncate w-full text-white drop-shadow">
                    {customer.name}
                  </p>
                  <p className="text-emerald-400 font-extrabold text-base mb-3">
                    €{customer.totalSpent.toLocaleString()}
                  </p>

                  <div
                    className={`w-full ${heights[visualIndex]} bg-gradient-to-b ${config.bg} rounded-t-2xl flex flex-col items-center justify-center gap-1 border-t-2 ${config.border} ${config.glow}`}
                  >
                    <span className="text-white font-black text-xl drop-shadow">
                      {config.label}
                    </span>
                    <div className="text-white/80">{config.icon}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {rest.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence>
                {rest.map((customer, i) => {
                  const index = i + 3;
                  const config = getRankConfig(index);
                  const barWidth = Math.round(
                    (customer.totalSpent / maxSpent) * 100,
                  );

                  return (
                    <motion.div
                      key={customer._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                      className="group relative rounded-2xl px-5 py-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-9 h-9 rounded-xl ${config.badge} flex items-center justify-center text-xs font-black shrink-0`}
                        >
                          #{index + 1}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                        >
                          {getInitials(customer.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-white">
                            {customer.name}
                          </p>
                          <p className="text-xs truncate text-white/40">
                            {customer._id}
                          </p>
                          <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/10">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{
                                delay: 0.2 + i * 0.05,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-emerald-400 font-extrabold text-sm">
                            €{customer.totalSpent.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <ShoppingBag className="w-3 h-3" />{" "}
                            {customer.devicesBought}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;