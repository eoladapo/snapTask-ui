# Animations and Transitions Implementation

This document describes all the animations and transitions implemented in the Task Management application using Framer Motion.

## Overview

All animations follow these principles:
- **Duration**: 200-400ms for most interactions
- **Easing**: Natural easing curves (easeOut, easeInOut)
- **Performance**: GPU-accelerated transforms (translate, scale, opacity)
- **Accessibility**: Respects user's motion preferences

## Implemented Animations

### 1. Page Transition Animations

**Location**: `App.tsx`

All route transitions use fade animations with AnimatePresence:
- **Initial**: Opacity 0
- **Animate**: Opacity 1
- **Exit**: Opacity 0
- **Duration**: 300ms

Pages affected:
- Onboarding
- Login
- Register
- Dashboard

### 2. Modal Open/Close Animations

**Location**: `components/common/Modal.tsx`

Modals animate in with a combined fade and scale effect:
- **Backdrop**: Fade in/out (200ms)
- **Content**: 
  - Fade + Scale (0.95 → 1.0)
  - Slight upward movement (y: 20 → 0)
  - Duration: 200ms

### 3. Button Hover and Active States

**Location**: `components/common/Button.tsx`

Enhanced button interactions:
- **Hover**: 
  - Scale: 1.02
  - Shadow elevation increase
- **Active/Tap**: 
  - Scale: 0.98
- **Transition**: 200ms with smooth easing

### 4. Task Card Animations

**Location**: `components/tasks/TaskCard.tsx`

Task cards have multiple animation states:
- **Mount**: Fade in + slide up (y: 20 → 0)
- **Hover**: Lift effect (y: 0 → -4px)
- **Exit**: Fade out + scale down (1.0 → 0.95)
- **Duration**: 200ms

### 5. Loading Spinner Animations

**Location**: `components/common/Loader.tsx`

Enhanced loading states:
- **Spinner**: Continuous 360° rotation (1s linear)
- **Container**: Fade in + scale (0.8 → 1.0)
- **Text**: Delayed fade in (100ms delay)

### 6. Toast Notification Animations

**Location**: `components/common/Toast.tsx`

Toast notifications slide in from the top:
- **Enter**: 
  - Fade in (0 → 1)
  - Slide down (y: -50 → 0)
  - Scale (0.9 → 1.0)
- **Exit**: 
  - Fade out
  - Slight upward movement (y: 0 → -20)
- **Duration**: 300ms

Features:
- Auto-dismiss after 3 seconds (configurable)
- Manual close button
- Success, Error, and Info variants

### 7. Form Input Error Messages

**Location**: `components/common/Input.tsx`

Error messages animate smoothly:
- **Enter**: Fade in + slide down (y: -10 → 0)
- **Exit**: Fade out + slide up (y: 0 → -10)
- **Duration**: 200ms

### 8. Task List Stagger Animations

**Location**: `components/tasks/TaskList.tsx`

Task cards appear sequentially:
- **Stagger delay**: 50ms between each card
- **Individual animation**: Fade + slide up
- **Section headers**: Slide in from left
- **Count badges**: Spring animation (scale 0 → 1)

### 9. Empty State Animations

**Location**: `components/tasks/TaskList.tsx`

Empty state has a welcoming animation sequence:
- **Container**: Fade + scale (0.95 → 1.0)
- **Icon**: Spring animation (scale 0 → 1) with 100ms delay
- **Title**: Fade + slide up with 200ms delay
- **Description**: Fade + slide up with 300ms delay
- **Indicator**: Fade in with 400ms delay

### 10. Floating Action Button (FAB)

**Location**: `pages/Dashboard.tsx`

The create task button has a spring entrance:
- **Mount**: Scale from 0 with spring physics
- **Delay**: 300ms after page load
- **Hover**: Scale 1.1
- **Tap**: Scale 0.95
- **Spring config**: Stiffness 200

### 11. Page Content Animations

**Location**: All page components

Each page's main content animates on mount:
- **Initial**: Opacity 0, y: 20
- **Animate**: Opacity 1, y: 0
- **Duration**: 300ms

## Usage Examples

### Using Toast Notifications

```typescript
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

function MyComponent() {
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleSuccess = () => {
    showSuccess('Task created successfully!');
  };

  return (
    <>
      <button onClick={handleSuccess}>Create Task</button>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
```

### Custom Animations with Framer Motion

```typescript
import { motion } from 'framer-motion';

function CustomComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content here
    </motion.div>
  );
}
```

## Performance Considerations

1. **GPU Acceleration**: All animations use transform properties (translate, scale, rotate) and opacity
2. **Will-change**: Automatically handled by Framer Motion
3. **Reduced Motion**: Framer Motion respects `prefers-reduced-motion` media query
4. **Lazy Loading**: AnimatePresence only renders when needed

## Browser Support

All animations work in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential animation improvements:
1. Drag-and-drop animations for task reordering
2. Confetti animation on task completion
3. Progress bar animations
4. Skeleton loading animations
5. Micro-interactions for checkboxes and toggles
