const statusConfig = {
  RECEIVED: { label: 'Received', class: 'status-received', dot: 'bg-blue-400' },
  PROCESSING: { label: 'Processing', class: 'status-processing', dot: 'bg-amber-400' },
  READY: { label: 'Ready', class: 'status-ready', dot: 'bg-emerald-400' },
  DELIVERED: { label: 'Delivered', class: 'status-delivered', dot: 'bg-violet-400' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.RECEIVED;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-mono font-medium rounded-full
        ${config.class}
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-slow`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
