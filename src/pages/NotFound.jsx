import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-16">
      <motion.div
        className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="mb-4 inline-block text-5xl"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          🎬
        </motion.span>
        <h1>Lost in the multiverse?</h1>
        <p>
          This page doesn&apos;t exist, but the cinematic universe is vast. Let&apos;s guide you back to the spotlight.
        </p>
        <Link to="/" className="btn btn--primary">
          Return home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;


