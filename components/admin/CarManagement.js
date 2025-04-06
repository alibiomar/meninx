import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';

export default function CarManagement() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price_per_day: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: '',
    color: '',
    image_url: '',
    category: 'Sedan',
    description: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('cars').select('*');
    if (!error) setCars(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const carData = {
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      price_per_day: parseFloat(formData.price_per_day),
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      seats: parseInt(formData.seats),
      color: formData.color,
      image_url: formData.image_url || null,
      category: formData.category,
      description: formData.description || null,
    };

    if (editingCar) {
      const { error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', editingCar.id);
      if (error) console.error('Error updating car:', error);
    } else {
      const { error } = await supabase.from('cars').insert([carData]);
      if (error) console.error('Error creating car:', error);
    }

    setShowForm(false);
    setEditingCar(null);
    setFormData({
      make: '',
      model: '',
      year: '',
      price_per_day: '',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: '',
      color: '',
      image_url: '',
      category: 'Sedan',
      description: '',
    });
    fetchCars();
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      price_per_day: car.price_per_day.toString(),
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      seats: car.seats.toString(),
      color: car.color,
      image_url: car.image_url || '',
      category: car.category || 'Sedan',
      description: car.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette voiture ?')) {
      await supabase.from('cars').delete().eq('id', id);
      fetchCars();
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Gestion des Voitures</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCar(null);
            setFormData({
              make: '',
              model: '',
              year: '',
              price_per_day: '',
              transmission: 'Automatic',
              fuel_type: 'Petrol',
              seats: '',
              color: '',
              image_url: '',
              category: 'Sedan',
              description: '',
            });
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300 mt-4 md:mt-0"
        >
          {showForm ? 'Annuler' : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une voiture
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {editingCar ? 'Modifier la voiture' : 'Ajouter une nouvelle voiture'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix par jour (TND)</label>
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              >
                <option value="Automatic">Automatique</option>
                <option value="Manual">Manuelle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de carburant</label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              >
                <option value="Petrol">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Électrique</option>
                <option value="Hybrid">Hybride</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Camion</option>
                <option value="Coupe">Coupé</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                rows="4"
                placeholder="Entrez une description de la voiture..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300"
          >
            {editingCar ? 'Mettre à jour' : 'Créer'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modèle</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Année</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix/Jour</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map((car, index) => (
                <tr key={car.id} className={`hover:bg-gray-100 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">{car.make}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{car.model}</td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{car.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{car.price_per_day} TND</td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{car.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3 border border-gray-200">
                    <button onClick={() => handleEdit(car)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:text-red-800">
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
