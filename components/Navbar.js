import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('');
    const router = useRouter();

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScrollProgress = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScrollProgress);
        return () => window.removeEventListener('scroll', handleScrollProgress);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (!e.target.closest('nav')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen]);

    const navClasses = `fixed w-full z-50 transition-all duration-300 py-2 ${
        scrolled ? 'bg-black bg-opacity-95 shadow-lg lg:flex' : ' '
    }`;

    return (
        <nav className={navClasses} aria-label="Navigation principale">
            {scrolled && (
                <div
                    className="h-1 bg-gradient-to-r from-red-900 via-red-700 to-red-500 absolute top-0 left-0"
                    style={{ width: `${scrollProgress}%` }}
                    aria-hidden="true"
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <span className="flex items-center text-xl font-bold cursor-pointer hover:scale-105 transition-transform duration-200">
                                    <span className="text-red-900">MENINX</span>
                                    <span className="text-white ml-1 relative">
                                        Car
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4 font-bold text-white">
                                <a
                                    href="#home"
                                    onClick={(e) => scrollToSection(e, '#home')}
                                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 relative group `}
                                >
                                    Accueil
                                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300
                                        ${activeSection === "home" ? "w-3/4" : "w-0 group-hover:w-3/4"}`}></span>
                                </a>
                                <a
                                    href="#location"
                                    onClick={(e) => scrollToSection(e, '#location')}
                                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 relative group `}

                                >
                                    Location
                                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300
                                        ${activeSection === "location" ? "w-3/4" : "w-0 group-hover:w-3/4"}`}></span>
                                </a>
                                <a
                                    href="#accessoires"
                                    onClick={(e) => scrollToSection(e, '#accessoires')}
                                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 relative group `}
>
                                    Accessoires
                                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300
                                        ${activeSection === "accessoires" ? "w-3/4" : "w-0 group-hover:w-3/4"}`}></span>
                                </a>
                                <a
                                    href="#temoignages"
                                    onClick={(e) => scrollToSection(e, '#temoignages')}
                                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 relative group `}
>
                                    Avis clients
                                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300
                                        ${activeSection === "temoignages" ? "w-3/4" : "w-0 group-hover:w-3/4"}`}></span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleMenu();
                                }
                            }}
                            tabIndex={0}
                            className="inline-flex items-center justify-center p-2 rounded-md text-red-900 hover:text-white hover:bg-red-800 transition-colors duration-200"
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            <span className="sr-only">{isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            
                            
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-gradient-to-b from-red-900 to-red-700 text-white transform transition-transform duration-500 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col z-50`}
                id="mobile-menu"
                role="menu"
                aria-labelledby="mobile-menu-button"
            >
                <div className="absolute top-5 right-5">
                    <button
                        onClick={toggleMenu}
                        className="text-white p-2 rounded-full hover:bg-red-800 transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <svg
                            className="h-8 w-8"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center h-full space-y-10">
                    <div className="mb-10">
                        <span className="flex items-center text-3xl font-bold">
                            <span className="text-white">MENINX</span>
                            <span className="text-gray-300 ml-2">Car</span>
                        </span>
                    </div>

                    <a href="#home">
                        <span
                            onClick={(e) => { scrollToSection(e, '#home'); setIsOpen(false); }}
                            className={`text-3xl hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:scale-110 transform ${activeSection === 'home' ? 'text-gray-300' : ''}`}
                            role="menuitem"
                            tabIndex={isOpen ? 0 : -1}
                        >
                            Accueil
                        </span>
                    </a>

                    <a
                        href="#location"
                        onClick={(e) => {
                            scrollToSection(e, '#location');
                            setIsOpen(false);
                        }}
                        className={`text-3xl hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:scale-110 transform ${activeSection === 'location' ? 'text-gray-300' : ''}`}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                    >
                        Location
                    </a>
                    <a
                        href="#accessoires"
                        onClick={(e) => {
                            scrollToSection(e, '#accessoires');
                            setIsOpen(false);
                        }}
                        className={`text-3xl hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:scale-110 transform ${activeSection === 'accessoires' ? 'text-gray-300' : ''}`}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                    >
                        Accessoires
                    </a>
                    <a
                        href="#temoignages"
                        onClick={(e) => {
                            scrollToSection(e, '#temoignages');
                            setIsOpen(false);
                        }}
                        className={`text-3xl hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:scale-110 transform ${activeSection === 'temoignages' ? 'text-gray-300' : ''}`}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                    >
                        Avis clients
                    </a>
                </div>
            </div>
        </nav>
    );
}
