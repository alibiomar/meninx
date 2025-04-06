import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Adjust path as needed

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Check if the current route is an admin route and handle loading
  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true);
    const handleRouteChangeComplete = () => {
      setIsAdminRoute(router.pathname.startsWith('/admin'));
      setIsLoading(false);
    };

    // Set initial state
    setIsAdminRoute(router.pathname.startsWith('/admin'));
    setIsLoading(false); // Initial load complete

    // Listen to route changes
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    // Cleanup event listeners
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router.pathname, router.events]);

  // Show spinner while loading
  if (isLoading) {
    return <LoadingSpinner size="large" color="red-600" message="Chargement de l'application..." />;
  }

  return (
    <>
      {/* Only render Navbar if not on an admin route */}
      {!isAdminRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;