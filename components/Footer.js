import { FaFacebook, FaInstagram, FaTwitter, FaYelp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Infos sur l'entreprise */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-red-900">MENINX </span>Car
            </h3>
            <p className="text-gray-300">
              Service premium de location de voitures depuis 2010. Profitez d'une large gamme de véhicules et d’accessoires auto de qualité.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                aria-label="Facebook"
                className="text-gray-300 hover:text-red-500 transition-colors duration-200"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="text-gray-300 hover:text-red-500 transition-colors duration-200"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">Liens rapides</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-red-500 transition-colors duration-200 block py-1">Accueil</a></li>
              <li><a href="#location" className="text-gray-300 hover:text-red-500 transition-colors duration-200 block py-1">Location</a></li>
              <li><a href="#accessoires" className="text-gray-300 hover:text-red-500 transition-colors duration-200 block py-1">Accessoires</a></li>
              <li><a href="#temoignages" className="text-gray-300 hover:text-red-500 transition-colors duration-200 block py-1">Avis clients</a></li>
            </ul>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">Nous contacter</h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">3 Rue Abdallah El Mehdi, La Marsa</span>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-red-500 mr-3 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+21650625000" className="text-gray-300 hover:text-red-500 transition-colors duration-200">50 625 000</a>
                  <a href="tel:+21658536805" className="text-gray-300 hover:text-red-500 transition-colors duration-200">58 536 805</a>
                  <a href="tel:+21658536806" className="text-gray-300 hover:text-red-500 transition-colors duration-200">58 536 806</a>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-red-500 mr-3 flex-shrink-0" />
                <a href="mailto:contact@meninx.tn" className="text-gray-300 hover:text-red-500 transition-colors duration-200">contact@meninx.tn</a>
              </div>
              <div className="flex items-start">
                <FaClock className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Lun-Ven : 8h - 18h</p>
                  <p className="text-gray-300">Sam-Dim : 9h - 17h</p>
                </div>
              </div>
            </address>
          </div>

          {/* Carte Google Maps */}
          <div>
            <div className="iframe-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.01923482465594!2d10.323314518376616!3d36.885299304033225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2b5007c45353b%3A0x61ce43cd1a4a0e63!2sMeninx%20car!5e0!3m2!1sfr!2stn!4v1743653075868!5m2!1sfr!2stn"
                width="300" 
                height="350" 
                style={{ borderRadius: 10, border: 0, filter: 'grayscale(1) contrast(1.2)' }}
                allowFullScreen 
                loading="lazy">
              </iframe>
              <div className="red-filter"></div> 

            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Meninx Car. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-red-500 transition-colors duration-200">Politique de confidentialité</a>
            <a href="#" className="hover:text-red-500 transition-colors duration-200">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
