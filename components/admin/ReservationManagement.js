import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    car_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    start_date: '',
    end_date: '',
    total_price: '',
    status: 'en attente',
    payment_status: 'en attente',
  });

  useEffect(() => {
    fetchReservations();
    fetchCars();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*, cars(make, model)')
      .order('created_at', { ascending: false });
    if (!error) setReservations(data);
    setLoading(false);
  };

  const fetchCars = async () => {
    const { data, error } = await supabase.from('cars').select('id, make, model');
    if (!error) setCars(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reservationData = {
      car_id: formData.car_id,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_price: parseFloat(formData.total_price),
      status: formData.status,
      payment_status: formData.payment_status,
    };

    if (editingReservation) {
      const { error } = await supabase
        .from('reservations')
        .update(reservationData)
        .eq('id', editingReservation.id);
      if (error) console.error('Error updating reservation:', error);
    } else {
      const { error } = await supabase.from('reservations').insert([reservationData]);
      if (error) console.error('Error creating reservation:', error);
    }

    setShowForm(false);
    setEditingReservation(null);
    setFormData({
      car_id: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      start_date: '',
      end_date: '',
      total_price: '',
      status: 'en attente',
      payment_status: 'en attente',
    });
    fetchReservations();
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      car_id: reservation.car_id,
      customer_name: reservation.customer_name,
      customer_email: reservation.customer_email,
      customer_phone: reservation.customer_phone,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      total_price: reservation.total_price.toString(),
      status: reservation.status,
      payment_status: reservation.payment_status,
    });
    setShowForm(true);
  };

  const updateStatus = async (id, newStatus) => {
    await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);
    fetchReservations();
  };

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    await supabase
      .from('reservations')
      .update({ payment_status: newPaymentStatus })
      .eq('id', id);
    fetchReservations();
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      await supabase.from('reservations').delete().eq('id', id);
      fetchReservations();
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Gestion des Réservations</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingReservation(null);
            setFormData({
              car_id: '',
              customer_name: '',
              customer_email: '',
              customer_phone: '',
              start_date: '',
              end_date: '',
              total_price: '',
              status: 'en attente',
              payment_status: 'en attente',
            });
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300 mt-4 md:mt-0"
        >
          {showForm ? 'Annuler' : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une réservation
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {editingReservation ? 'Modifier la réservation' : 'Ajouter une nouvelle réservation'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voiture</label>
              <select
                name="car_id"
                value={formData.car_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Sélectionner une voiture</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email du client</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone du client</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix total (TND)</label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              >
                <option value="en attente">En attente</option>
                <option value="confirmé">Confirmé</option>
                <option value="annulé">Annulé</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut de paiement</label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              >
                <option value="en attente">En attente</option>
                <option value="payé">Payé</option>
                <option value="échoué">Échoué</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300"
          >
            {editingReservation ? 'Mettre à jour' : 'Créer'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-red-600 text-3xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Voiture</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((reservation, index) => (
                <tr key={reservation.id} className={`hover:bg-gray-100 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">{reservation.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{reservation.cars.make} {reservation.cars.model}</td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{reservation.start_date} - {reservation.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                    <select
                      value={reservation.status}
                      onChange={(e) => updateStatus(reservation.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                    >
                      <option value="en attente">En attente</option>
                      <option value="confirmé">Confirmé</option>
                      <option value="annulé">Annulé</option>
                      <option value="terminé">Terminé</option>
                    </select>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap border border-gray-200">
                    <select
                      value={reservation.payment_status}
                      onChange={(e) => updatePaymentStatus(reservation.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                    >
                      <option value="en attente">En attente</option>
                      <option value="payé">Payé</option>
                      <option value="échoué">Échoué</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3 border border-gray-200">
                    <button onClick={() => handleEdit(reservation)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleDelete(reservation.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
