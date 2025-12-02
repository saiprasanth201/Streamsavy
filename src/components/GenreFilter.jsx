import { motion } from 'framer-motion';

const GenreFilter = ({ genres, activeGenre, onSelect }) => {
  if (!genres.length) return null;

  const chipBase =
    'rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-brand/20 hover:text-white hover:shadow-[0_12px_30px_rgba(229,9,20,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <motion.button
        className={`${chipBase} ${
          activeGenre === 'all'
            ? 'bg-brand/20 text-white shadow-[0_12px_30px_rgba(229,9,20,0.24)]'
            : ''
        }`}
        onClick={() => onSelect('all')}
        whileTap={{ scale: 0.92 }}
      >
        All
      </motion.button>
      {genres.map((genre) => (
        <motion.button
          key={genre.id}
          className={`${chipBase} ${
            activeGenre === genre.id
              ? 'bg-brand/20 text-white shadow-[0_12px_30px_rgba(229,9,20,0.24)]'
              : ''
          }`}
          onClick={() => onSelect(genre.id)}
          whileTap={{ scale: 0.92 }}
        >
          {genre.name}
        </motion.button>
      ))}
    </div>
  );
};

export default GenreFilter;


