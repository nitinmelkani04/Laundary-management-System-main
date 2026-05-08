import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  subtitle = '',
  action = null,
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
      <Icon size={28} className="text-gray-600" />
    </div>
    <div className="text-center">
      <p className="font-display text-lg text-gray-400">{title}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
