import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import CarManagement from '@/components/admin/CarManagement';
import ReservationManagement from '@/components/admin/ReservationManagement';
import AccessoryManagement from '@/components/admin/AccessoryManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ClientManagement from '@/components/admin/ClientManagement';
import  LoadingSpinner  from "@/components/ui/LoadingSpinner";
export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setLoading(true);
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
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return null; // or a fallback if needed
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 shadow-md pb-4 bg-white rounded-xl px-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Tableau de bord Admin</h1>
          <button
            onClick={async () => await supabase.auth.signOut()}
            className="inline-flex items-center mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className={`fixed inset-0 bg-white z-50 ${isMenuOpen ? 'block' : 'hidden'} md:static md:flex md:space-x-8 md:bg-transparent md:z-auto`}>
          <div className="md:hidden p-4 flex justify-end">
            <button onClick={() => setIsMenuOpen(false)}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 border-b border-gray-200 md:border-b md:-mb-px">
            {['analytics', 'reservations', 'cars', 'accessories', 'clients'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMenuOpen(false);
                }}
                className={`block py-4 px-4 text-lg md:text-sm font-semibold transition duration-200 ${
                  activeTab === tab
                    ? ' text-white  md:from-red-50 md:to-transparent md:text-red-600 md:border-b-2 md:border-red-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:border-gray-300'
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

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8 md:mt-0">
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
