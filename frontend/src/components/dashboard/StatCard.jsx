import { TrendingUp } from 'lucide-react';

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent = 'gold',
  prefix = '',
  suffix = '',
  trend = null,
  delay = 0,
}) => {
  const accentColors = {
    gold: {
      icon: 'text-gold-400',
      iconBg: 'bg-gold-400/10 border-gold-400/20',
      border: 'border-gold-400/20',
      glow: '0 0 30px rgba(240,192,64,0.08)',
    },
    emerald: {
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10 border-emerald-400/20',
      border: 'border-emerald-400/20',
      glow: '0 0 30px rgba(16,185,129,0.08)',
    },
    blue: {
      icon: 'text-blue-400',
      iconBg: 'bg-blue-400/10 border-blue-400/20',
      border: 'border-blue-400/20',
      glow: '0 0 30px rgba(59,130,246,0.08)',
    },
    violet: {
      icon: 'text-violet-400',
      iconBg: 'bg-violet-400/10 border-violet-400/20',
      border: 'border-violet-400/20',
      glow: '0 0 30px rgba(139,92,246,0.08)',
    },
  };

  const colors = accentColors[accent] || accentColors.gold;

  return (
    <div
      className={`glass-card p-6 border ${colors.border} opacity-0 animate-fade-up`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
        boxShadow: colors.glow,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors.iconBg}`}
        >
          <Icon size={18} className={colors.icon} />
        </div>
        {trend !== null && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
            <TrendingUp size={12} />
            {trend}%
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs font-body mb-1 uppercase tracking-widest">
        {label}
      </p>
      <p className="font-display text-2xl font-bold text-cream-100">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        {suffix}
      </p>
    </div>
  );
};

export default StatCard;
