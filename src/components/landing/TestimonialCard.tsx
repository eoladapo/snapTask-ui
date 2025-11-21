import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  index?: number; // For stagger animation delay
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  avatar,
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
      className="h-full"
    >
      {/* Card container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col">
        {/* Quote icon */}
        <div className="mb-4">
          <Quote className="w-10 h-10 text-indigo-600 dark:text-indigo-400 opacity-50" aria-hidden="true" />
        </div>

        {/* Testimonial content */}
        <blockquote className="flex-grow mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg">
            "{content}"
          </p>
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <OptimizedImage
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
            />
          </div>

          {/* Name and role */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
