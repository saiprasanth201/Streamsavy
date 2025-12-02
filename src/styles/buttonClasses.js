const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

export const buttonVariants = {
  primary: `${base} px-6 py-3 text-white bg-gradient-to-r from-brand to-brand-light shadow-[0_12px_24px_rgba(229,9,20,0.3)] hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(229,9,20,0.4)] active:translate-y-0 active:shadow-[0_10px_20px_rgba(229,9,20,0.2)]`,
  ghost: `${base} px-6 py-3 text-white border border-white/15 bg-white/10 hover:border-brand/40 hover:bg-brand/20`,
  outline: `${base} rounded-full border border-white/25 px-5 py-2.5 text-white hover:border-white hover:bg-white/10`,
  danger: `${base} rounded-full border border-red-500/60 px-5 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-200`,
};

export const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: '',
};

