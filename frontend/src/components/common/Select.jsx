const Select = ({
  label,
  error,
  options = [],
  placeholder = 'Select...',
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
      <select
        className={`
          w-full input-dark rounded-xl px-4 py-2.5 font-body text-sm appearance-none cursor-pointer
          bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23f0c040' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")]
          bg-no-repeat bg-[right_12px_center]
          ${error ? 'border-rose-500' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option
            key={typeof opt === 'string' ? opt : opt.value}
            value={typeof opt === 'string' ? opt : opt.value}
            className="bg-charcoal-800"
          >
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default Select;
