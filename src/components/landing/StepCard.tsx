import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number; // For stagger animation delay
}

export const StepCard: React.FC<StepCardProps> = ({
  number,
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
        delay: index * 0.2,
      }}
      whileHover={{ y: -8 }}
      className="relative group"
    >
      {/* Card container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full">
        {/* Number badge */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg" aria-hidden="true">
          <span className="text-white font-bold text-xl">{number}</span>
        </div>

        {/* Icon with gradient */}
        <div className="mb-6 mt-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" style={{ stroke: 'url(#icon-gradient)' }} aria-hidden="true" />
            {/* SVG gradient definition for icon stroke */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};
