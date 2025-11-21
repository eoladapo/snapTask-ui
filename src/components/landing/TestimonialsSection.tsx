import { motion } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';
import type { Testimonial } from '../../config/landingPageContent';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  return (
    <section 
      id="testimonials"
      className="py-24 md:py-32 px-6 bg-white dark:bg-gray-900"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied users who have simplified their task management
          </p>
        </motion.div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              avatar={testimonial.avatar}
              index={index}
            />
          ))}
        </div>

        {/* Mobile: Horizontal carousel */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-[85vw] max-w-md">
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  avatar={testimonial.avatar}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
