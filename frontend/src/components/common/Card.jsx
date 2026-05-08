const Card = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div
      className={`glass-card p-6 ${glow ? 'gold-glow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-5 ${className}`}>
    <div>
      <h3 className="font-display text-lg font-semibold text-cream-100">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default Card;
