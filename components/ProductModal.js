'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Star, Info, Check } from 'lucide-react';

const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const {
        name,
        price,
        description,
        image_url,
        category,
        discount,
        inStock ,
        details = ''
    } = product;

    const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-6"
            role="dialog"
            aria-modal="true"
            onClick={handleOutsideClick}
        >
            <div
                className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                            {name}
                        </h2>
                        {category && (
                            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                {category}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200"
                        aria-label="Fermer la fenêtre modale"
                    >
                        <X size={24} className="text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="relative group">
                            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                                {image_url ? (
                                    <Image
                                        src={image_url}
                                        alt={name}
                                        fill
                                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-2xl mb-4">
                                            <Info size={32} className="text-gray-400" />
                                        </div>
                                        <span className="text-gray-400 font-medium">Image du produit non disponible</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            {/* Pricing */}
                            <div className="flex flex-wrap items-baseline gap-3 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${parseFloat(discountedPrice).toFixed(2)}
                                    </span>
                                    {discount > 0 && (
                                        <span className="text-gray-500 text-lg line-through">
                                            ${parseFloat(price).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Économisez {discount}%
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                inStock ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-600' : 'bg-red-600'}`} />
                                <span className={`font-medium ${inStock ? 'text-green-700' : 'text-red-700'}`}>
                                    {inStock ? 'En stock' : 'Temporairement en rupture de stock'}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <div className="border-b border-gray-100 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Info size={18} className="text-gray-500" />
                                        Aperçu du produit
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {description || 'Aucune description disponible'}
                                    </p>
                                </div>

                                {/* Details */}
                                {details && (
                                    <div className="border-b border-gray-100 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques principales</h3>
                                        <p className="text-gray-600 leading-relaxed">{details}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                        Fermer les détails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;