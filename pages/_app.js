import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Check if the current route is an admin route
  useEffect(() => {
    setIsAdminRoute(router.pathname.startsWith('/admin'));
  }, [router.pathname]);

  return (
    <>
      {/* Only render Navbar if not on an admin route */}
      {!isAdminRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;