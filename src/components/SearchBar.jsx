import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, initialValue = '', className = '' }) => {
  const [value, setValue] = useState(initialValue);

  // Sync with external initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onSearch?.(nextValue.trim());
  };

  return (
    <motion.form
      className={`mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-white shadow-[0_18px_40px_rgba(10,10,20,0.25)] backdrop-blur-2xl transition-all duration-200 focus-within:border-brand/40 focus-within:shadow-[0_20px_44px_rgba(229,9,20,0.2)] dark:border-white/10 dark:bg-white/5 ${className}`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FiSearch className="text-xl text-white/70" />
      <input
        type="text"
        className="flex-1 bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none"
        placeholder="Search for movies..."
        value={value}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-light px-6 py-2 font-semibold text-white shadow-[0_12px_24px_rgba(229,9,20,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(229,9,20,0.35)] active:translate-y-0 active:shadow-[0_10px_20px_rgba(229,9,20,0.2)]"
      >
        Search
      </button>
    </motion.form>
  );
};

export default SearchBar;


