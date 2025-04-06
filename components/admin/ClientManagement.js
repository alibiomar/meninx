import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaSpinner } from 'react-icons/fa';

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('customer_name, customer_email, customer_phone');

    if (!error && data) {
      const clientCountMap = data.reduce((acc, curr) => {
        const key = curr.customer_email;
        if (!acc[key]) {
          acc[key] = { ...curr, count: 0 };
        }
        acc[key].count += 1;
        return acc;
      }, {});

      const uniqueClients = Object.values(clientCountMap);
      setClients(uniqueClients);
    } else {
      console.error('Error fetching clients:', error);
    }
    setLoading(false);
  };

  const filteredClients = clients
    .filter((client) =>
      client.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.customer_phone?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.customer_name.localeCompare(b.customer_name);
      } else if (sortOption === 'most_redundant') {
        return b.count - a.count;
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-900">Gestion des Clients</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom, email ou téléphone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
        >
          <option value="alphabetical">Trier par ordre alphabétique</option>
          <option value="most_redundant">Trier par plus de réservations</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-red-600 text-3xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre de réservations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client, index) => (
                <tr key={index} className={`hover:bg-gray-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.customer_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.customer_phone || 'Non fourni'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}