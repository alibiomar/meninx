import React, { useState, useEffect } from 'react';
import { getCars, checkCarAvailability, createReservation } from '@/lib/supabase';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

// Fonction de notification par email (pour admin et client)
const sendAdminEmail = async (reservationData) => {
  try {
    const response = await fetch('/api/send-admin-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) throw new Error("Échec de l'envoi de la notification à l'administrateur");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendCustomerEmail = async (reservationData) => {
  try {
    const response = await fetch('/api/send-customer-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) throw new Error("Échec de l'envoi de la confirmation au client");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const CarRentalSystem = () => {
  // États
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState(null); // To store reservation ID for confirmation

  // Informations du client
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

  // État de sélection des voitures
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    transmission: 'all',
    category: 'all',
  });

  // Période de location
  const [rentalPeriod, setRentalPeriod] = useState({ startDate: '', endDate: '' });

  // Pagination pour les voitures
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

  // Résumé de la location
  const [rentalSummary, setRentalSummary] = useState({
    days: 0,
    totalPrice: 0,
    isAvailable: true,
  });

  // Charger les données des voitures
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const carsData = await getCars();
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (err) {
        setError('Échec du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Appliquer les filtres lorsque l'état des filtres change
  useEffect(() => {
    const filtered = cars.filter((car) => {
      const priceMatch = car.price_per_day >= filters.priceRange[0] && car.price_per_day <= filters.priceRange[1];
      const transmissionMatch = filters.transmission === 'all' || car.transmission === filters.transmission;
      const categoryMatch = filters.category === 'all' || car.category === filters.category;
      return priceMatch && transmissionMatch && categoryMatch;
    });
    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [filters, cars]);

  // Calculer les détails de la location
  useEffect(() => {
    const calculateRental = async () => {
      if (!selectedCar || !rentalPeriod.startDate || !rentalPeriod.endDate) {
        setRentalSummary({ days: 0, totalPrice: 0, isAvailable: true });
        return;
      }

      const start = new Date(rentalPeriod.startDate);
      const end = new Date(rentalPeriod.endDate);

      if (start >= end) {
        setRentalSummary({ days: 0, totalPrice: 0, isAvailable: true });
        return;
      }

      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = days * selectedCar.price_per_day;

      setRentalSummary((prev) => ({ ...prev, days, totalPrice, isAvailable: true }));

      setLoading(true);
      try {
        const { isAvailable } = await checkCarAvailability(
          selectedCar.id,
          rentalPeriod.startDate,
          rentalPeriod.endDate
        );
        setRentalSummary((prev) => ({ ...prev, isAvailable }));
      } catch (err) {
        setError('Échec de la vérification de la disponibilité de la voiture. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    calculateRental();
  }, [selectedCar, rentalPeriod]);

  // Gestionnaires
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, type) => {
    if (!date) return;
    const formattedDate = date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    if (type === 'start') {
      setRentalPeriod((prev) => ({ ...prev, startDate: formattedDate }));
    } else {
      setRentalPeriod((prev) => ({ ...prev, endDate: formattedDate }));
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const validateCustomerInfo = () => {
    const { name, email, phone } = customerInfo;
    if (!name.trim()) return 'Le nom complet est requis.';
    if (name.length < 2) return 'Le nom doit contenir au moins 2 caractères.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Le format de l'email est invalide.";
    if (!phone.trim() || !/^\+?[1-9]\d{1,14}$/.test(phone))
      return 'Le numéro de téléphone est invalide (ex: +21612345678).';
    return null;
  };

  const validateRentalPeriod = () => {
    const { startDate, endDate } = rentalPeriod;
    if (!startDate) return 'La date de début est requise.';
    if (!endDate) return 'La date de fin est requise.';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) return 'La date de début ne peut pas être antérieure à aujourd’hui.';
    if (end <= start) return 'La date de fin doit être après la date de début.';
    if (rentalSummary.days > 30) return 'La période de location ne peut pas dépasser 30 jours.';
    return null;
  };

  const handleSubmit = async () => {
    const customerError = validateCustomerInfo();
    const periodError = validateRentalPeriod();
    if (customerError) {
      setError(customerError);
      return;
    }
    if (periodError) {
      setError(periodError);
      return;
    }
    if (!rentalSummary.isAvailable) {
      setError('Cette voiture n’est pas disponible pour les dates sélectionnées.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationData = {
        car_id: selectedCar.id,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        start_date: rentalPeriod.startDate,
        end_date: rentalPeriod.endDate,
        total_price: rentalSummary.totalPrice,
        status: 'en attente', // Set to 'en attente' initially
        payment_status: 'en attente',
        car_details: { make: selectedCar.make, model: selectedCar.model, year: selectedCar.year },
      };

      const reservation = await createReservation(reservationData);
      setReservationId(reservation.id); // Store reservation ID for confirmation
      await Promise.all([
        sendAdminEmail(reservationData),
        sendCustomerEmail({
          ...reservationData,
          reservationId: reservation.id,
          startDateFormatted: new Date(rentalPeriod.startDate).toLocaleDateString('fr-FR'),
          endDateFormatted: new Date(rentalPeriod.endDate).toLocaleDateString('fr-FR'),
        }),
      ]);
      setSuccess(true);
    } catch (err) {
      setError('Échec de la réservation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const validationError = validateCustomerInfo();
      if (validationError) {
        setError(validationError);
        return;
      }
    } else if (step === 2 && !selectedCar) {
      setError('Veuillez sélectionner une voiture pour continuer.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Rendu des composants
  const renderCarCard = (car) => {
    const isSelected = selectedCar?.id === car.id;
    return (
      <div
        key={car.id}
        className={`p-6 rounded-lg transition-all cursor-pointer ${
          isSelected ? 'ring-4 ring-red-600 bg-red-50' : 'border border-gray-200 hover:shadow-lg'
        }`}
        onClick={() => handleCarSelect(car)}
      >
        <div className="h-40 bg-gray-100 mb-4 rounded-lg flex items-center justify-center overflow-hidden">
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 font-bold">{car.make} {car.model}</span>
          )}
        </div>
        <h3 className="font-bold text-xl">{car.make} {car.model}</h3>
        <div className="text-sm text-gray-500 mb-3 font-medium">{car.year} • {car.color}</div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">{car.transmission}</span>
          <span className="text-sm font-medium">{car.fuel_type}</span>
          <span className="text-sm font-medium">{car.seats} places</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-base text-red-600">{car.price_per_day} TND/jour</span>
          <button
            className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
              isSelected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleCarSelect(car);
            }}
          >
            {isSelected ? 'SÉLECTIONNÉ' : 'SÉLECTIONNER'}
          </button>
        </div>
      </div>
    );
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Vos Informations' },
      { number: 2, label: 'Sélectionnez un Véhicule' },
      { number: 3, label: 'Finalisez la Réservation' },
    ];

    return (
      <div className="relative mb-10">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-6">
          {steps.map((s, index) => (
            <div key={s.number} className="flex-1 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${
                    step > index + 1
                      ? 'bg-red-600 border-red-600 text-white'
                      : step === index + 1
                      ? 'bg-red-100 border-red-600 text-red-600'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
              >
                {step > index + 1 ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step >= index + 1 ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-red-600">
      <h2 className="text-2xl font-bold mb-6">Entrez Vos Informations</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet *</label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleCustomerInfoChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Nom complet"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email *</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleCustomerInfoChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de Téléphone *</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleCustomerInfoChange}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="+216 12345678"
          />
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg font-medium">{error}</div>
      )}
      <div className="mt-8 flex justify-center">
        <button
          onClick={nextStep}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-red-600">
      <h2 className="text-2xl font-bold mb-6">Choisissez Votre Voiture</h2>
      <div className="mb-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-bold mb-4 text-lg">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Plage de Prix</label>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{filters.priceRange[0]} TND</span>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])
                }
                className="flex-grow accent-red-600"
              />
              <span className="font-medium">{filters.priceRange[1]} TND</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
            <select
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tous Types</option>
              <option value="Automatic">Automatique</option>
              <option value="Manual">Manuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Toutes Catégories</option>
              <option value="Économie">Économie</option>
              <option value="Compacte">Compacte</option>
              <option value="SUV">SUV</option>
              <option value="Luxe">Luxe</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 font-medium text-lg">
            Aucune voiture ne correspond à vos filtres. Veuillez ajuster vos critères.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {paginatedCars.map((car) => renderCarCard(car))}
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg font-medium">{error}</div>
      )}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="bg-white text-red-600 border-2 border-red-600 py-2 px-4 rounded-lg font-bold hover:bg-red-50 transition-all"
        >
          RETOUR
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedCar}
          className={`bg-red-600 text-white py-3 px-5 rounded-lg font-bold transition-all ${
            !selectedCar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
        >
          CONTINUER
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const today = new Date();
    const startDate = rentalPeriod.startDate ? new Date(rentalPeriod.startDate) : undefined;
    const endDate = rentalPeriod.endDate ? new Date(rentalPeriod.endDate) : undefined;

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-red-600">
        <h2 className="text-2xl font-bold mb-6">Finalisez Votre Réservation</h2>
        {selectedCar && (
          <div className="mb-8 p-6 bg-red-50 rounded-xl border-l-4 border-red-600">
            <h3 className="font-bold mb-3 text-lg">Véhicule Sélectionné</h3>
            <div className="flex items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mr-6 flex-shrink-0 overflow-hidden">
                {selectedCar.image_url ? (
                  <img
                    src={selectedCar.image_url}
                    alt={`${selectedCar.make} ${selectedCar.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-bold">
                    Pas d'image
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xl">{selectedCar.make} {selectedCar.model}</h4>
                <p className="text-sm text-gray-600 font-medium">
                  {selectedCar.year} • {selectedCar.transmission} • {selectedCar.seats} sièges
                </p>
                <p className="font-bold text-xl text-red-600 mt-1">
                  {selectedCar.price_per_day} TND/jour
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8">
          <h3 className="font-bold mb-4 text-lg">Période de Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
                Date de Prise en Charge *
              </label>
              <div className="flex items-center justify-center w-full">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => handleDateChange(date, 'start')}
                  disabled={(date) => date < today}
                  className="border rounded-lg p-2"
                  locale={fr}
                />
              </div>
              {rentalPeriod.startDate && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Sélectionné: {new Date(rentalPeriod.startDate).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
                Date de Retour *
              </label>
              <div className="flex items-center justify-center w-full">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => handleDateChange(date, 'end')}
                  disabled={(date) => date < (startDate || today)}
                  className="border rounded-lg p-2"
                  locale={fr}
                />
              </div>
              {rentalPeriod.endDate && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Sélectionné: {new Date(rentalPeriod.endDate).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        </div>
        {rentalSummary.days > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold mb-4 text-lg">Résumé de la Réservation</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Tarif Journalier (Voiture):</span>
                <span className="font-bold">{selectedCar?.price_per_day.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-medium">Nombre de Jours:</span>
                <span className="font-bold">{rentalSummary.days}</span>
              </div>
              <div className="border-t-2 pt-3 mt-3 flex justify-between text-xl">
                <span className="font-bold">Prix Total:</span>
                <span className="font-bold text-red-600">{rentalSummary.totalPrice.toFixed(2)} TND</span>
              </div>
            </div>
            {loading ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : rentalSummary.isAvailable ? (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                <p className="font-bold">Voiture disponible pour les dates sélectionnées !</p>
                <p className="font-medium">Vous pouvez procéder à la réservation.</p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                <p className="font-bold">Cette voiture n'est pas disponible pour les dates sélectionnées.</p>
                <p className="font-medium">
                  Veuillez sélectionner d'autres dates ou revenir pour choisir un autre véhicule.
                </p>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg font-medium">{error}</div>
        )}
        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Réservation Confirmée !</h3>
            <p className="text-gray-600 mb-4 text-lg">
              Votre réservation (ID: {reservationId}) a été créée avec succès.
            </p>
            <p className="text-gray-600 mb-8 text-lg">
              Un email de confirmation a été envoyé à {customerInfo.email}.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setSuccess(false);
                setSelectedCar(null);
                setCustomerInfo({ name: '', email: '', phone: '' });
                setRentalPeriod({ startDate: '', endDate: '' });
                setReservationId(null);
              }}
              className="bg-red-600 text-white py-3 px-8 rounded-lg  font-bold hover:bg-red-700 transition-all text-lg"
            >
              NOUVELLE RÉSERVATION
            </button>
          </div>
        ) : (
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              className="bg-white text-red-600 border-2 border-red-600 py-2  px-4 rounded-lg font-bold hover:bg-red-50 transition-all"
            >
              RETOUR
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !rentalSummary.isAvailable || rentalSummary.days <= 0}
              className={`bg-red-600 text-white py-3 px-5  rounded-lg font-bold transition-all ${
                loading || !rentalSummary.isAvailable || rentalSummary.days <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-red-700'
              }`}
            >
              {loading ? 'EN COURS...' : 'RÉSERVEZ'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen" id="location">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">LOCATION DE VOITURES PREMIUM</h1>
        <p className="text-center text-gray-600 mb-12 text-xl font-medium">Vivez le luxe à portée de main</p>
        {renderProgressBar()}
        <div className="max-w-5xl mx-auto">{step === 1 && renderStep1()}</div>
        <div className="max-w-7xl mx-auto">{step === 2 && renderStep2()}</div>
        <div className="max-w-5xl mx-auto">{step === 3 && renderStep3()}</div>
      </div>
    </section>
  );
};

export default CarRentalSystem;