import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSpinner } from 'react-icons/fa';

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalReservations: 0,
    activeCars: 0,
    totalRevenue: 0,
  });
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { count: totalReservations } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true });

        const { count: activeCars } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true })
          .eq('available', true);

        const { data: revenueData } = await supabase
          .from('reservations')
          .select('total_price')
          .eq('payment_status', 'payé');
        const totalRevenue = revenueData?.reduce((sum, res) => sum + (res.total_price || 0), 0) || 0;

        const { data: resData } = await supabase
          .from('reservations')
          .select('created_at')
          .order('created_at', { ascending: true });

        const monthlyData = resData.reduce((acc, res) => {
          const month = new Date(res.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(monthlyData).map(([name, value]) => ({ name, reservations: value }));

        setMetrics({ totalReservations, activeCars, totalRevenue });
        setReservationData(chartData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-red-600 text-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-3xl font-extrabold text-gray-900">Tableau de bord analytique</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-100 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-lg hover:scale-105 transition duration-300">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Réservations totales</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalReservations}</p>
          </div>
        </div>
        <div className="p-6 bg-green-100 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-lg hover:scale-105 transition duration-300">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Voitures disponibles</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeCars}</p>
          </div>
        </div>
        <div className="p-6 bg-yellow-100 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-lg hover:scale-105 transition duration-300">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Revenus totaux</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalRevenue.toFixed(2)} TND</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tendances des réservations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reservationData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="reservations" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
