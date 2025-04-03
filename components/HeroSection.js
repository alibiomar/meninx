import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CarImage from '../public/car-hero.jpg';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const highlightFeatures = [
    { text: "Pas de frais cachés" },
    { text: "Assistance routière 24/7" },
    { text: "Ramassage et retour flexibles" }
  ];
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
  const trustedBrands = [
    { name: "Mercedes", logo: "/logos/mercedes.svg" },
    { name: "BMW", logo: "/logos/bmw.svg" },
    { name: "Porsche", logo: "/logos/porsche.svg" },
    { name: "Toyota", logo: "/logos/toyota.svg" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative bg-black overflow-hidden" id="home">
      {/* Fond dégradé animé */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600 rounded-full filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-20 w-40 h-40 bg-red-300 rounded-full filter blur-xl animate-blob animation-delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-red-300 rounded-full filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-16 left-40 w-36 h-36 bg-red-500 rounded-full filter blur-xl animate-blob animation-delay-1000"></div>
      </div>
      
      {/* Superposition de texture en grille */}
      <div className="absolute inset-0 opacity-10 bg-grid-white/[0.05]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="relative z-10 pb-5 pt-16 lg:pt-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center h-screen lg:gap-16">
              {/* Section de contenu */}
              <div className="lg:w-1/2">
                <motion.div 
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  transition={{ staggerChildren: 0.2 }}
                  className="space-y-8"
                >
                  <motion.span 
                    variants={fadeInUp}
                    className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full
                    hover:scale-105 transition-transform duration-300 shadow-lg shadow-red-900/30"
                  >
                    Service de location de voitures haut de gamme
                  </motion.span>
                  
                  <motion.h1 
                    variants={fadeInUp}
                    className="text-5xl font-bold text-white sm:text-6xl md:text-7xl tracking-tight"
                  >
                    Conduisez votre rêve&nbsp;
                    <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent
                    animate-text-shine bg-[length:200%_auto]">
                    Aujourd'hui
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    variants={fadeInUp}
                    className="text-xl text-gray-300 leading-relaxed max-w-2xl"
                  >
                    Véhicules haut de gamme à louer avec des accessoires exclusifs pour améliorer votre expérience de conduite

                  </motion.p>
                  
                  {/* Liste des fonctionnalités */}
                  <motion.div 
                    variants={fadeInUp}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                  >
                    {highlightFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 text-gray-300 border-l-4 border-red-500 pl-3
                        hover:bg-white/5 transition-all duration-300 p-3 rounded-lg group"
                      >
                        <CheckCircle 
                          size={20} 
                          className="text-red-500 flex-shrink-0 group-hover:animate-bounce" 
                        />
                        <span className="text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </motion.div>
                  
                  {/* Boutons d'action */}
                  <motion.div 
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: [1, 1.15, 1], // Slight breathing effect
                        }}
                        transition={{
                          duration: 3, // Slower breathing effect
                          repeat: Infinity, // Loop forever
                          repeatType: "reverse", // Smooth transition back and forth
                          ease: "easeInOut", // Natural feel
                        }}
                        href="#location"
                        onClick={(e) => scrollToSection(e, '#location')}
                        className="flex items-center justify-center px-8 py-4 bg-red-600 text-white font-bold rounded-lg 
                        hover:bg-red-700 transition-all duration-300 group shadow-lg shadow-red-900/30"
                      >
                        <Calendar className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                        Louer maintenant
                        <div className="ml-3 w-0 h-5 border-r border-white/30 group-hover:w-5 transition-all duration-300" />
                      </motion.a>


                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#accessoires"
                      onClick={(e) => scrollToSection(e, '#accessoires')}
                      className="flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-lg 
                      hover:bg-white/20 transition-all duration-300 group shadow-lg shadow-white/10"
                    >
                      Parcourir les accessoires
                      <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Section image */}
              <div className="lg:w-1/2 mt-16 lg:mt-0">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square rounded-3xl overflow-hidden transform translate-z-0 
                  hover:shadow-2xl hover:shadow-red-900/20 transition-shadow duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
                  <Image
                    src={CarImage}
                    alt="Véhicule de location de luxe"
                    layout="fill"
                    objectFit="cover"
                    className="scale-105 hover:scale-100 transition-transform duration-700"
                    priority
                  />
                  {/* Accent lumineux */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
                </motion.div>
                
                {/* Marques de confiance */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-col items-center space-y-4"
                >
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Véhicules haut de gamme disponibles
                  </p>
                  <div className="flex justify-center space-x-8">
                    {trustedBrands.map((brand, index) => (
                      <motion.div 
                        key={index} 
                        whileHover={{ scale: 1.1 }}
                        className="relative h-8 w-8  transition-all 
                        hover:drop-shadow-[0_0_12px_rgba(59_130_246_0.3)]"
                      >
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          layout="fill"
                          objectFit="contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute left-0 right-0 bottom-0 h-1 bg-red-700 opacity-80"
      />
    </section>
  );
}