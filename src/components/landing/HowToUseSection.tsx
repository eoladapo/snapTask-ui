import { motion } from 'framer-motion';
import { StepCard } from './StepCard';
import { landingPageContent } from '../../config/landingPageContent';

export const HowToUseSection: React.FC = () => {
  const { steps } = landingPageContent;

  return (
    <section
      id="how-to-use"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
      aria-labelledby="how-to-use-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2
            id="how-to-use-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            How to Use SnapTask
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in three simple steps. No complicated setup, no learning curve.
          </p>
        </motion.div>

        {/* Steps grid with connecting lines */}
        <div className="relative">
          {/* Connecting lines - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-700 origin-left"
              style={{ width: 'calc(100% - 8rem)' }}
            />
          </div>

          {/* Connecting dots at each step - desktop only */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-between px-16 pointer-events-none">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.4,
                  delay: 0.6 + index * 0.2,
                  ease: 'easeOut',
                }}
                className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
              />
            ))}
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Optional: Call to action after steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Ready to simplify your task management?
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Start using SnapTask now"
          >
            Start Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
