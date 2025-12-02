import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

const transitionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const MovieList = ({ title, movies = [], layout = 'slider', variant }) => {
  if (!movies.length) return null;

  return (
    <section className="mb-12">
      {title ? (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </motion.div>
      ) : null}

      {layout === 'slider' ? (
        <motion.div
          className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.08 }}
        >
          {movies.map((movie) => (
            <motion.div
              variants={transitionVariants}
              key={`${title}-${movie.id}`}
              className="min-w-[220px] snap-start"
            >
              <MovieCard movie={movie} variant={variant} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.05 }}
        >
          {movies.map((movie) => (
            <motion.div variants={transitionVariants} key={movie.id}>
              <MovieCard movie={movie} variant={variant} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default MovieList;


