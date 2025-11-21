import {
  MessageSquare,
  Sparkles,
  FolderKanban,
  RefreshCw,
  Bell,
  TrendingUp,
  Phone,
  Send,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Type definitions
export interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface LandingPageConfig {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
  };
  steps: Step[];
  about: {
    title: string;
    content: string;
  };
  features: Feature[];
  testimonials: Testimonial[];
  footer: {
    tagline: string;
    links: FooterLink[];
    socialLinks: FooterLink[];
    copyright: string;
  };
}

// Landing page content configuration
export const landingPageContent: LandingPageConfig = {
  hero: {
    headline: 'Manage Tasks with AI-Powered Simplicity',
    subheadline:
      'Chat with our AI assistant to organize your tasks, then get reminders delivered straight to WhatsApp. Smart task management meets effortless notifications.',
    ctaText: 'Get Started Free',
    ctaLink: '/register',
  },

  steps: [
    {
      number: 1,
      title: 'Chat with SnapTask AI',
      description: 'Open the app and tell our AI what you need to do—naturally, like talking to a friend',
      icon: Send,
    },
    {
      number: 2,
      title: 'Connect WhatsApp',
      description: 'Link your WhatsApp number to receive task reminders on the go',
      icon: Phone,
    },
    {
      number: 3,
      title: 'Stay Organized',
      description: 'Manage tasks in the app, get reminded via WhatsApp—never miss a thing',
      icon: CheckCircle2,
    },
  ],

  about: {
    title: 'Task Management, Simplified',
    content:
      'Traditional task management apps are complex and overwhelming. SnapTask takes a different approach. Chat with our AI assistant in the app to create and organize tasks naturally, then receive timely reminders via WhatsApp—the messaging app you already check every day. No learning curve, no friction—just natural, effortless organization.',
  },

  features: [
    {
      id: 'whatsapp-integration',
      title: 'WhatsApp Reminders',
      description: 'Get task reminders delivered straight to WhatsApp',
      icon: MessageSquare,
    },
    {
      id: 'smart-parsing',
      title: 'AI-Powered Chat',
      description: 'Tell our AI what you need to do in plain language—it handles the rest',
      icon: Sparkles,
    },
    {
      id: 'category-organization',
      title: 'Category Organization',
      description: 'Automatic categorization and custom labels',
      icon: FolderKanban,
    },
    {
      id: 'realtime-sync',
      title: 'Real-time Sync',
      description: 'Instant updates across your devices',
      icon: RefreshCw,
    },
    {
      id: 'task-reminders',
      title: 'Task Reminders',
      description: 'Never miss a deadline with smart notifications',
      icon: Bell,
    },
    {
      id: 'progress-tracking',
      title: 'Progress Tracking',
      description: 'Visualize your productivity with insights',
      icon: TrendingUp,
    },
  ],

  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Ejiro Esigbenu',
      role: 'Web developer',
      content:
        'SnapTask transformed how I manage my daily tasks. The AI chat is intuitive and WhatsApp reminders keep me on track!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 'testimonial-2',
      name: 'Anuoluwapo shoyode',
      role: 'Software Engineer',
      content:
        'I love chatting with the AI to organize my tasks, then getting reminded on WhatsApp. Perfect workflow!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
    {
      id: 'testimonial-3',
      name: 'Oyibo karo',
      role: 'Finance Expert',
      content:
        'The simplicity is unmatched. I manage everything in the app and never miss a deadline thanks to WhatsApp alerts.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
  ],

  footer: {
    tagline: 'AI-powered task management with WhatsApp reminders',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Twitter', href: 'https://twitter.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
    ],
    copyright: '© 2025 SnapTask. All rights reserved.',
  },
};
