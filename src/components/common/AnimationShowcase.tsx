import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Toast from './Toast';
import { useToast } from '../../hooks/useToast';

/**
 * AnimationShowcase Component
 * 
 * This component demonstrates all the animations implemented in the application:
 * 
 * 1. Page Transitions - Fade in/out between routes using AnimatePresence
 * 2. Modal Animations - Scale and fade animations for modal open/close
 * 3. Button Hover/Active - Scale and shadow transitions on interaction
 * 4. Task Card Hover - Lift effect with shadow on hover
 * 5. Loading Spinner - Smooth rotation animation
 * 6. Toast Notifications - Slide in from top with fade
 * 7. Form Error Messages - Fade and slide animations
 * 8. Stagger Animations - Sequential reveal of task cards
 * 9. Empty State - Bounce animation for icons
 * 10. FAB Button - Spring animation on mount
 */
const AnimationShowcase: React.FC = () => {
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();
  const [showCard, setShowCard] = useState(true);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Animation Showcase</h1>

      {/* Toast Notifications */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toast Notifications</h2>
        <div className="flex gap-4">
          <Button onClick={() => showSuccess('Task completed successfully!')}>
            Show Success
          </Button>
          <Button onClick={() => showError('Failed to delete task')} variant="danger">
            Show Error
          </Button>
          <Button onClick={() => showInfo('New update available')} variant="secondary">
            Show Info
          </Button>
        </div>
      </section>

      {/* Card Hover Animation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Hover Animation</h2>
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow max-w-md"
        >
          <h3 className="text-lg font-semibold mb-2">Hover over me!</h3>
          <p className="text-gray-600">This card lifts up smoothly when you hover over it.</p>
        </motion.div>
      </section>

      {/* Stagger Animation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stagger Animation</h2>
        <Button onClick={() => setShowCard(!showCard)}>Toggle Cards</Button>
        {showCard && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-purple-100 rounded-lg p-4 text-center"
              >
                Card {i}
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Loading Spinner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Spinner</h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
        />
      </section>

      {/* Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AnimationShowcase;
