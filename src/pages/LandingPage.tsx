import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/common/Loader';
import {
  Navigation,
  HeroSection,
  HowToUseSection,
  AboutSection,
  FeaturesSection,
  TestimonialsSection,
  Footer,
} from '../components/landing';
import { landingPageContent } from '../config/landingPageContent';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  // Automatically navigate to Dashboard if valid token exists
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`landing-page ${theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />

        {/* How to Use Section */}
        <HowToUseSection />

        {/* About Section */}
        <AboutSection />

        {/* Features Section */}
        <FeaturesSection features={landingPageContent.features} />

        {/* Testimonials Section */}
        <TestimonialsSection testimonials={landingPageContent.testimonials} />
      </main>

      {/* Footer */}
      <Footer
        tagline={landingPageContent.footer.tagline}
        links={landingPageContent.footer.links}
        socialLinks={landingPageContent.footer.socialLinks}
        copyright={landingPageContent.footer.copyright}
      />
    </motion.div>
  );
};
