import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary text-charcoal-900',
  secondary:
    'bg-transparent border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-charcoal-900 transition-all duration-200',
  danger:
    'bg-transparent border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-200',
  ghost:
    'bg-transparent text-gray-400 hover:text-gold-400 hover:bg-white/5 transition-all duration-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-body font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
