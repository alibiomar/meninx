'use client';

import { useState } from 'react';
import Image from 'next/image';

const ProductCard = ({ product, onOpenModal }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!product) return null;

    const { 
        name, 
        price, 
        description, 
        image_url, 
        discount, 
        inStock
    } = product;

    const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;

    return (
        <div 
            className="bg-white overflow-hidden flex flex-col h-full group relative rounded-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Conteneur d'image */}
            <div className="relative w-full pt-[100%] bg-gray-50 overflow-hidden ">
                {image_url ? (
                    <>
                        {discount > 0 && (
                            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                -{discount}%
                            </div>
                        )}
                        
                        <Image
                            src={image_url}
                            alt={name}
                            fill
                            className={`object-cover transition-transform duration-500 ease-out} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoadingComplete={() => setIsLoading(false)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="animate-pulse w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Image à venir</span>
                    </div>
                )}

                {/* Superposition de vue rapide */}
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
                    isHovered ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
                }`}>
                    <button 
                        onClick={() => onOpenModal(product)}
                        className="bg-white/90 text-gray-900 px-5 py-2.5 rounded-full hover:bg-white transition-all duration-300 text-sm font-semibold shadow-sm hover:scale-105"
                    >
                        Aperçu rapide
                    </button>
                </div>
            </div>
            
            {/* Détails du produit */}
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate">{name}</h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3 min-h-[40px]">
                    {description || 'Découvrez ce produit premium'}
                </p>

                <div className="mt-auto space-y-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-gray-900">
                            {parseFloat(discountedPrice).toFixed(2)} TND
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                                {parseFloat(price).toFixed(2)} TND
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-xs font-medium ${inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {inStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;