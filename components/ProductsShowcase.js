'use client';

import { useEffect, useState } from 'react';
import { fetchAccessories } from '@/lib/supabase';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Search, Filter, ChevronDown } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

export default function ProductsShowcase() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [sortOption, setSortOption] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchAccessories();
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                console.error('Erreur lors du chargement des produits :', err);
                setError('Échec du chargement des produits. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        let result = [...products];

        if (selectedCategory !== 'Tous') {
            result = result.filter(product => product.category === selectedCategory);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                product =>
                    product.name.toLowerCase().includes(term) ||
                    product.description?.toLowerCase().includes(term)
            );
        }

        switch (sortOption) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'featured':
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, selectedCategory, searchTerm, sortOption]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('Tous');
    };

    const categories = ['Tous', ...new Set(products.map(product => product.category))];

    const LoadingState = () => (
        <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="text-gray-500 font-medium">Chargement des accessoires...</p>
        </div>
    );

    const ErrorState = () => (
        <div className="bg-red-50 p-6 rounded-xl text-red-600 shadow-sm max-w-md mx-auto mt-8 border border-red-100">
            <h3 className="font-bold text-lg mb-2">Une erreur s'est produite</h3>
            <p>{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
                Réessayer
            </button>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-24 w-24 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Filter size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun accessoire trouvé</h3>
            <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'Tous'
                    ? "Essayez d'ajuster vos filtres ou termes de recherche"
                    : "Revenez bientôt pour découvrir de nouveaux accessoires"}
            </p>
            <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800 font-medium underline underline-offset-4"
            >
                Effacer les filtres
            </button>
        </div>
    );

    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    return (
        <section className="relative py-20 px-4 md:px-8 bg-gray-50 min-h-screen" id="accessoires">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2 text-gray-900">Accessoires Premium</h1>
                        <p className="text-gray-600 text-lg">
                            Améliorez votre expérience avec notre collection soigneusement sélectionnée
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Rechercher des accessoires..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 border-0 rounded-xl w-full focus:ring-2 focus:ring-red-300 ring-1 ring-gray-200 bg-white shadow-sm focus:shadow-md transition-all duration-300 outline-none"
                        />
                        <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
                    </div>
                </div>
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full md:w-auto">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center text-gray-700 mr-4 md:hidden px-4 py-2 hover:bg-gray-50 rounded-lg"
                            >
                                <Filter size={18} className="mr-2" />
                                Filtres
                                <ChevronDown
                                    size={16}
                                    className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div className="hidden md:flex items-center gap-4 w-full">
                                <span className="text-gray-700 font-medium whitespace-nowrap">Les catégories :</span>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                selectedCategory === category
                                                    ? 'bg-red-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-gray-700 whitespace-nowrap">Trier par :</span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border-0 bg-gray-100 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-red-300 outline-none w-full md:w-48 appearance-none"
                            >
                                <option value="featured">En vedette</option>
                                <option value="price-low">Prix : du plus bas au plus élevé</option>
                                <option value="price-high">Prix : du plus élevé au plus bas</option>
                                <option value="newest">Nouveautés</option>
                            </select>
                        </div>
                    </div>
                    {isFilterOpen && (
                        <div className="md:hidden mt-4 border-t pt-4">
                            <span className="text-gray-700 font-medium block mb-2">Catégories :</span>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            selectedCategory === category
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mb-6 flex justify-between items-center px-2">
                    <p className="text-gray-500 font-medium">
                        Affichage de {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} 
                        sur {filteredProducts.length} résultats
                    </p>
                    {(searchTerm || selectedCategory !== 'Tous') && (
                        <button
                            onClick={clearFilters}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M18 6l-12 12" />
                                <path d="M6 6l12 12" />
                            </svg>
                            <span>Effacer le filtre</span>
                        </button>
                    )}
                </div>
                {filteredProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onOpenModal={setSelectedProduct} 
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(prev => Math.max(1, prev - 1));
                                                }}
                                                disabled={currentPage === 1}
                                                className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                            />
                                        </PaginationItem>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(i + 1);
                                                    }}
                                                    isActive={currentPage === i + 1}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                                }}
                                                disabled={currentPage === totalPages}
                                                className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </div>
        </section>
    );
}