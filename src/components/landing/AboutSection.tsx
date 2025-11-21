import { motion } from 'framer-motion';
import { landingPageContent } from '../../config/landingPageContent';

// Decorative illustration component (2D fallback/alternative to 3D)
const AboutIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Abstract geometric shapes representing simplicity */}
      <div className="relative w-full max-w-md aspect-square">
        {/* Large circle - main element */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/30 dark:to-purple-500/30 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50"
        />

        {/* Floating smaller circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: -20, y: -20 }}
          whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="absolute top-8 left-8 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-80 shadow-lg"
        />

        <motion.div
          initial={{ scale: 0, opacity: 0, x: 20, y: -20 }}
          whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="absolute top-12 right-12 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 shadow-lg"
        />

        <motion.div
          initial={{ scale: 0, opacity: 0, x: -20, y: 20 }}
          whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="absolute bottom-16 left-16 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-75 shadow-lg"
        />

        <motion.div
          initial={{ scale: 0, opacity: 0, x: 20, y: 20 }}
          whileInView={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-80 shadow-lg"
        />

        {/* Center icon/symbol representing simplicity */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl flex items-center justify-center transform rotate-12">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Subtle rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 rounded-full border-2 border-dashed border-indigo-300/50 dark:border-indigo-600/50"
        />
      </div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  const { about } = landingPageContent;

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            {/* Section heading */}
            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
            >
              {about.title}
            </motion.h2>

            {/* Content text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {about.content}
            </motion.p>

            {/* Optional: Key points or highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 space-y-4"
            >
              {[
                'No learning curve required',
                'Works with your existing WhatsApp',
                'Natural, conversational task creation',
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.1,
                    ease: 'easeOut',
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {point}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Visual element */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 h-96 lg:h-[500px] w-full"
          >
            <AboutIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
