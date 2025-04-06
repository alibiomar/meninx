import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('home');
    const [mounted, setMounted] = useState(false);

    // Streamlined animation variants
    const linkVariants = {
        inactive: {
            scale: 1,
            color: '#ffffff',
            transition: { duration: 0.2 }
        },
        active: {
            scale: 1.05,
            color: '#ef4444', // red-500
            transition: { duration: 0.2 }
        },
        hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
        }
    };

    const underlineVariants = {
        inactive: { scaleX: 0, transition: { duration: 0.3 } },
        active: { scaleX: 1, transition: { duration: 0.3 } },
        hover: { scaleX: 0.75, transition: { duration: 0.3 } }
    };

    const mobileMenuVariants = {
        open: {
            x: 0,
            transition: { type: 'tween', duration: 0.3 }
        },
        closed: {
            x: '100%',
            transition: { type: 'tween', duration: 0.3 }
        }
    };

    const navItems = useMemo(() => [
        { id: 'home', label: 'Accueil' },
        { id: 'location', label: 'Location' },
        { id: 'accessoires', label: 'Accessoires' },
        { id: 'temoignages', label: 'Avis clients' },
    ], []);

    // New active section detection using visibility
    useEffect(() => {
        if (typeof window === 'undefined' || !mounted) return;

        const handleScroll = () => {
            const sectionPositions = navItems.map(item => {
                const element = document.getElementById(item.id);
                if (!element) return { id: item.id, visibility: 0 };

                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;

                return { id: item.id, visibility };
            });

            const mostVisible = sectionPositions.reduce((prev, current) =>
                prev.visibility > current.visibility ? prev : current
            );

            if (mostVisible.visibility > 0.3) {
                setActiveSection(mostVisible.id);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted, navItems]);

    // Scroll handlers with throttling
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let throttleTimeout;

        const handleScroll = () => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = totalHeight > 0 ?
                        (window.scrollY / totalHeight) * 100 : 0;

                    setScrollProgress(progress);

                    const isLargeScreen = window.innerWidth >= 1024;
                    if (isLargeScreen) {
                        const homeSection = document.getElementById('home');
                        if (homeSection) {
                            const { top, bottom } = homeSection.getBoundingClientRect();
                            const isInHomeView = top <= 0 && bottom > 0;
                            setScrolled(!isInHomeView && window.scrollY > 20);
                        } else {
                            setScrolled(window.scrollY > 20);
                        }
                    } else {
                        setScrolled(window.scrollY > 20);
                    }

                    throttleTimeout = null;
                }, 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(throttleTimeout);
        };
    }, []);

    // Menu controls
    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
    const closeMenu = useCallback(() => setIsOpen(false), []);

    // Scroll to section handler
    const scrollToSection = useCallback((e, id) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            const headerOffset = 80;
            const position = element.offsetTop - headerOffset;

            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
            setActiveSection(id.replace('#', '')); // Update active section on click
            closeMenu();
        }
    }, [closeMenu]);

    // Close menu on escape or outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => e.key === 'Escape' && closeMenu();
        const handleClickOutside = (e) =>
            !e.target.closest('nav') && closeMenu();

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, closeMenu]);

    // Component mount state
    useEffect(() => setMounted(true), []);

    const navClasses = `${scrolled ? 'fixed bg-black bg-opacity-95 shadow-lg ' : 'absolute top-0 left-0'} w-full z-50 transition-all duration-300 py-2`;

    return (
        <motion.nav
            className={navClasses}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Navigation principale"
        >
            {scrolled && (
                <motion.div
                    className="h-1 bg-gradient-to-r from-red-900 via-red-700 to-red-500 absolute top-0 left-0"
                    animate={{ width: `${scrollProgress}%` }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    role="progressbar"
                    aria-valuenow={Math.round(scrollProgress)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            )}

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex ${scrolled ? 'justify-between ' : ''} items-center`}>
                <div className="flex items-center justify-between md:justify-start w-full h-16">
                    <div className={`flex-shrink-0 ${scrolled ? 'mr-72' : 'mr-0 '} `}>
                        <Link href="/" passHref>
                            <motion.p
                                className="flex items-center text-xl font-bold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-red-900">MENINX</span>
                                <span className="text-white ml-1">Car</span>
                            </motion.p>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="relative flex items-center cursor-pointer justify-center"
                                    onClick={(e) => scrollToSection(e, `#${item.id}`)}
                                >
                                    <motion.a
                                        href={`#${item.id}`}
                                        variants={linkVariants}
                                        initial="inactive"
                                        animate={activeSection === item.id ? 'active' : 'inactive'}
                                        whileHover="hover"
                                        className="px-3 py-2 text-sm font-medium relative"
                                        aria-current={activeSection === item.id ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </motion.a>
                                    <motion.span
                                        className="absolute bottom-0 left-0 h-0.5 bg-red-600 w-full"
                                        variants={underlineVariants}
                                        initial="inactive"
                                        animate={activeSection === item.id ? 'active' : 'inactive'}
                                        whileHover="hover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={toggleMenu}
                        className={`md:hidden p-3 rounded-md text-white hover:bg-red-800 transition-colors z-50 ${scrolled ? 'fixed top-4 right-4' : ''}`}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <motion.path
                                    key="close"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    initial={{ rotate: 180 }}
                                    animate={{ rotate: 0 }}
                                />
                            ) : (
                                <motion.path
                                    key="menu"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-red-900 md:hidden z-40"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <motion.div
                            className="flex flex-col items-center justify-center h-full p-4 space-y-8"
                        >
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollToSection(e, `#${item.id}`)}
                                    variants={linkVariants}
                                    initial="inactive"
                                    animate={activeSection === item.id ? 'active' : 'inactive'}
                                    whileHover="hover"
                                    className="text-2xl font-medium"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
