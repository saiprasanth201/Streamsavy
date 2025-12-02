import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const socialLinks = [
  { icon: <FiGithub />, href: 'https://github.com', label: 'GitHub' },
  { icon: <FiTwitter />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <FiInstagram />, href: 'https://instagram.com', label: 'Instagram' },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-black/80 to-black px-4 py-12">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center text-white/70"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <span className="text-lg font-semibold text-white">🎥 StreamSavvy</span>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Cinematic experiences, delivered in ultra streaming definition.
          </p>
        </div>

        <div className="flex items-center gap-5 text-xl text-white/60">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="transition hover:-translate-y-0.5 hover:text-brand"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-1 text-sm text-white/60">
          <span>StreamSavvy © 2025</span>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="text-white transition hover:text-brand"
          >
            Powered by TMDB API
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;


