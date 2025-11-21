import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';
import type { FooterLink } from '../../config/landingPageContent';

interface FooterProps {
  tagline: string;
  links: FooterLink[];
  socialLinks: FooterLink[];
  copyright: string;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  Twitter: Twitter,
  LinkedIn: Linkedin,
};

export const Footer: React.FC<FooterProps> = ({
  tagline,
  links,
  socialLinks,
  copyright,
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <footer 
      className="bg-gray-900 dark:bg-black text-gray-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and About Column */}
          <motion.div {...fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SnapTask
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>
          </motion.div>

          {/* Links Column */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Social Links Column */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Connect</h3>
            <div className="flex gap-4" role="list" aria-label="Social media links">
              {socialLinks.map((social) => {
                const IconComponent = socialIcons[social.label];
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label={`Visit our ${social.label} page`}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" aria-hidden="true" />}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <p className="text-center text-gray-400 text-sm">{copyright}</p>
        </motion.div>
      </div>
    </footer>
  );
};
