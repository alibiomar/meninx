import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      text: "Service exceptionnel et véhicules toujours impeccables. La procédure de location est rapide et l'équipe très professionnelle. Je recommande !",
      author: "Marie Dupont",
      role: "Client Fidèle",
      date: "15 Mars 2024",
      rating: 5,
      plan: "Location Longue Durée"
    },
    {
      id: 2,
      text: "Parfait pour les voyages d'affaires. Voitures récentes et bien entretenues. Le service de livraison sur place est très pratique.",
      author: "Pierre Martin",
      role: "Propriétaire d'Entreprise",
      date: "22 Avril 2024",
      rating: 4,
      plan: "Forfait Affaires"
    },
    {
      id: 3,
      text: "Expérience de location sans souci. Tarifs transparents et conditions flexibles. Idéal pour les vacances en famille.",
      author: "Sophie Leroy",
      role: "Client Occasionnel",
      date: "30 Mai 2024",
      rating: 5,
      plan: "Forfait Vacances"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction] = useState(1);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -30 : 30, opacity: 0 }),
  };

  return (
    <section className="py-16 bg-gray-50" id="temoignages">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Avis Clients
          </h2>
          <p className="text-gray-600">
            Ce que nos clients disent de notre service
          </p>
        </div>

        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="mb-4 text-sm text-red-600 font-medium">
                {testimonials[activeIndex].plan}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <User size={40} className="text-gray-400 p-2 bg-gray-100 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < testimonials[activeIndex].rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "{testimonials[activeIndex].text}"
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="font-medium text-gray-900">
                  {testimonials[activeIndex].author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonials[activeIndex].date}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === activeIndex ? 'bg-red-600' : 'bg-gray-300 scale-75'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}