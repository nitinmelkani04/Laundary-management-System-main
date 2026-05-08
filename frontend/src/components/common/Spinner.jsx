const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div
        className="w-full h-full rounded-full border-2 border-transparent border-t-gold-400 animate-spin"
        style={{ borderTopColor: '#f0c040' }}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm font-body animate-pulse">Loading...</p>
    </div>
  </div>
);

export default Spinner;
