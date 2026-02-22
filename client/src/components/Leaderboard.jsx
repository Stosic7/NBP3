import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/analytics/top-customers');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchTopCustomers();
  }, []);

  if (error) return <div className="p-4 text-red-500 font-medium">Greška: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top Kupci (Leaderboard)</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          Zasnovano na ukupnoj potrošnji
        </span>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rang</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kupac</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kupljeni Uređaji</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ukupno Potrošeno</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr key={customer._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium text-center">
                  {customer.devicesBought}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                  €{customer.totalSpent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Trenutno nema podataka o prodatim uređajima i kupcima.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;