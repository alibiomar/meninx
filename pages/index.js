import Head from 'next/head';
import HeroSection from '../components/HeroSection';
import LocationSection from '../components/LocationSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import ProductsShowcase from '../components/ProductsShowcase';

export default function Home() {
  return (
    <div>
      <Head>
      <title>MENINX Car - Location de voitures & Accessoires Auto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

      </Head>

      <main>
        <HeroSection />
        <LocationSection />
        <ProductsShowcase />
        <TestimonialsSection />

      </main>
      <Footer />
    </div>
  );
}