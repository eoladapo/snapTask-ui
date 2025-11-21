import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface NavigationProps {
  transparent?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ transparent = true }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Add solid background after scrolling 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Determine background classes based on scroll state and transparent prop
  const backgroundClasses = transparent && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${backgroundClasses}`}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-20">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
            onClick={() => navigate('/')}
            aria-label="SnapTask home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              SnapTask
            </span>
          </motion.button>

          {/* Register Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              onClick={handleRegisterClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Register for SnapTask"
            >
              Register
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};
