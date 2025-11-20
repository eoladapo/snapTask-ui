# SnapTask Frontend

A modern, responsive React + TypeScript task management application with AI-powered chat assistance.

## Features

- **Task Management** - Create, update, delete, and organize tasks with status tracking
- **AI Chat Assistant** - Gemini-powered conversational interface for natural task management
- **Dark Mode** - Sophisticated dark/light theme with smooth transitions
- **Real-time Updates** - Instant task status changes and updates
- **Responsive Design** - Mobile-first design that works on all devices
- **User Authentication** - Secure JWT-based authentication
- **Task Statistics** - Visual insights into your productivity
- **User Profile** - Customizable user profile management

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Routing**: React Router v6

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4545/api
```

## Development

Run the development server:
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── chat/        # AI chat components
│   │   ├── common/      # Shared components (Button, Modal, etc.)
│   │   ├── layout/      # Layout components (Navbar, Sidebar)
│   │   └── tasks/       # Task-related components
│   ├── context/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useChat.ts
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── services/        # API service layer
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── taskService.ts
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles & Tailwind
├── public/              # Static assets
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Features

### Task Management
- Create tasks with title and description
- Update task status (pending, in-progress, completed)
- Edit and delete tasks
- Filter tasks by status
- Real-time task counts

### AI Chat Assistant
- Natural language task creation
- Task status updates via conversation
- Task disambiguation
- Confirmation flows for deletions
- Context-aware responses
- Rate limiting (10 messages/minute)

### Theme System
- Light and dark mode
- Automatic system preference detection
- Persistent theme selection
- Smooth color transitions
- Mature, professional color palette

### Responsive Design
- Mobile-first approach
- Touch-friendly UI elements (44px minimum)
- Collapsible sidebar
- Floating action button on mobile
- Optimized layouts for all screen sizes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4545/api` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Component Guidelines

### Creating New Components
1. Use TypeScript for type safety
2. Follow the existing component structure
3. Use Tailwind CSS for styling
4. Add dark mode support with `dark:` variants
5. Make components responsive
6. Use Framer Motion for animations
7. Follow accessibility best practices

### Example Component
```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-[#1e293b] p-4 rounded-lg"
    >
      <h2 className="text-gray-900 dark:text-gray-100">{title}</h2>
      <button
        onClick={onAction}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Action
      </button>
    </motion.div>
  );
};

export default MyComponent;
```

## API Integration

The app uses Axios for API calls with automatic token management:

```typescript
import api from './services/api';

// API calls automatically include auth token
const response = await api.get('/tasks');
```

## State Management

### Context Providers
- **AuthContext**: User authentication state
- **ThemeContext**: Theme (light/dark) management
- **ToastContext**: Toast notifications

### Custom Hooks
- **useAuth**: Authentication operations
- **useTasks**: Task CRUD operations
- **useChat**: AI chat functionality

## Styling

### Tailwind CSS v4
- Custom color palette
- Dark mode support
- Responsive utilities
- Custom animations

### Color Palette
- **Primary**: Purple (`#6c5ce7`)
- **Status Colors**: Orange (pending), Blue (in-progress), Green (completed)
- **Dark Mode**: Slate tones for depth and sophistication

## Performance

- Code splitting with React.lazy
- Optimized re-renders with useMemo/useCallback
- Debounced API calls
- Lazy loading of images
- Efficient state updates

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Touch-friendly targets (44px minimum)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write TypeScript with proper types
3. Add dark mode support to new components
4. Test on mobile devices
5. Ensure accessibility compliance

## Troubleshooting

### Development server won't start
- Check if port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API calls failing
- Verify backend is running
- Check VITE_API_URL in .env
- Check browser console for CORS errors

### Dark mode not working
- Clear browser cache
- Check if `dark` class is on `<html>` element
- Verify Tailwind CSS is properly configured

## License

ISC
