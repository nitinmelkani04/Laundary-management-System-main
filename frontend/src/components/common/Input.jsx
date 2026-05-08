const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  containerClass = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300 font-body">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon size={16} />
          </div>
        )}
        <input
          className={`
            w-full input-dark rounded-xl py-2.5 font-body text-sm
            ${Icon ? 'pl-9 pr-4' : 'px-4'}
            ${error ? 'border-rose-500 focus:border-rose-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default Input;
