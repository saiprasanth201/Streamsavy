import { motion } from 'framer-motion';

const Loader = ({ message = 'Loading cinematic gems...' }) => {
  return (
    <div className="grid place-items-center gap-4 py-16 text-center text-white/70">
      <motion.div
        className="h-11 w-11 rounded-full border-4 border-white/15 border-t-brand"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <p>{message}</p>
    </div>
  );
};

export default Loader;


