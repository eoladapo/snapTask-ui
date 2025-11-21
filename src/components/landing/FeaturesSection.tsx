import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import type { Feature } from '../../config/landingPageContent';

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section 
      id="features"
      className="py-24 md:py-32 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 
            id="features-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to manage your tasks effortlessly through WhatsApp
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
