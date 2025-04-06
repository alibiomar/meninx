import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import CarManagement from '@/components/admin/CarManagement';
import ReservationManagement from '@/components/admin/ReservationManagement';
import AccessoryManagement from '@/components/admin/AccessoryManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ClientManagement from '@/components/admin/ClientManagement';
import { FaSpinner } from 'react-icons/fa';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    };

    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/');
      }
    });

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 shadow-sm pb-4 bg-white rounded-xl px-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Tableau de bord Admin</h1>
          <button
            onClick={async () => await supabase.auth.signOut()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['analytics', 'reservations', 'cars', 'accessories', 'clients'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 text-sm font-semibold transition duration-200 ${
                  activeTab === tab
                    ? 'border-b-2 border-red-600 text-red-600 bg-gradient-to-r from-red-50 to-transparent'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'analytics' && 'Analytiques'}
                {tab === 'reservations' && 'Réservations'}
                {tab === 'cars' && 'Voitures'}
                {tab === 'accessories' && 'Accessoires'}
                {tab === 'clients' && 'Clients'}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'reservations' && <ReservationManagement />}
          {activeTab === 'cars' && <CarManagement />}
          {activeTab === 'accessories' && <AccessoryManagement />}
          {activeTab === 'clients' && <ClientManagement />}
        </div>
      </div>
    </div>
  );
}