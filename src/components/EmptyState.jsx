import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../styles/buttonClasses';

const EmptyState = ({
  title = 'Nothing to show yet',
  message = 'Start exploring and add something to your watchlist.',
  ctaLabel = 'Browse titles',
  ctaHref = '/',
}) => {
  return (
    <motion.div
      className="mx-auto mt-12 max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3>{title}</h3>
      <p>{message}</p>
      <Link to={ctaHref} className={buttonVariants.primary}>
        {ctaLabel}
      </Link>
    </motion.div>
  );
};

export default EmptyState;


