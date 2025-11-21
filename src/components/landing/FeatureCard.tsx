import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number; // For stagger animation delay
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.15,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      {/* Card container with glass morphism */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
          <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-gray-800" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Icon with gradient background */}
          <div className="mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Icon className="w-8 h-8" style={{ stroke: 'url(#feature-icon-gradient)' }} aria-hidden="true" />
              {/* SVG gradient definition for icon stroke */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="feature-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};
