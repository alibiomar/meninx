import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';

export default function AccessoryManagement() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    discount: 0,
    inStock: true,
    category: '',
    featured: false,
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('accessories').select('*');
    if (!error) setAccessories(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessoryData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description || null,
      image_url: formData.image_url || null,
      discount: parseInt(formData.discount) || 0,
      inStock: formData.inStock,
      category: formData.category || null,
      featured: formData.featured,
    };

    if (editingAccessory) {
      const { error } = await supabase
        .from('accessories')
        .update(accessoryData)
        .eq('id', editingAccessory.id);
      if (error) console.error('Error updating accessory:', error);
    } else {
      const { error } = await supabase.from('accessories').insert([accessoryData]);
      if (error) console.error('Error creating accessory:', error);
    }

    setShowForm(false);
    setEditingAccessory(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image_url: '',
      discount: 0,
      inStock: true,
      category: '',
      featured: false,
    });
    fetchAccessories();
  };

  const handleEdit = (accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      price: accessory.price.toString(),
      description: accessory.description || '',
      image_url: accessory.image_url || '',
      discount: accessory.discount.toString(),
      inStock: accessory.inStock,
      category: accessory.category || '',
      featured: accessory.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet accessoire ?')) {
      await supabase.from('accessories').delete().eq('id', id);
      fetchAccessories();
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Gestion des Accessoires</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingAccessory(null);
            setFormData({
              name: '',
              price: '',
              description: '',
              image_url: '',
              discount: 0,
              inStock: true,
              category: '',
              featured: false,
            });
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300 mt-4 md:mt-0"
        >
          {showForm ? 'Annuler' : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un accessoire
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {editingAccessory ? 'Modifier l’accessoire' : 'Ajouter un nouvel accessoire'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (TND)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-red-600 focus:border-transparent transition duration-200"
              />
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">En stock</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Mis en avant</label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:scale-105 transition duration-300"
          >
            {editingAccessory ? 'Mettre à jour' : 'Créer'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accessories.map((accessory, index) => (
                <tr key={accessory.id} className={`hover:bg-gray-100 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">{accessory.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{accessory.price} TND</td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200">{accessory.inStock ? 'Oui' : 'Non'}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3 border border-gray-200">
                    <button onClick={() => handleEdit(accessory)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleDelete(accessory.id)} className="text-red-600 hover:text-red-800">
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
