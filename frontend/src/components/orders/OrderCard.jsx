import { format } from 'date-fns';
import { Phone, Calendar, Shirt, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

const OrderCard = ({ order }) => {
  const totalGarments = order.garments.reduce((s, g) => s + g.quantity, 0);

  return (
    <Link
      to={`/orders/${order._id}`}
      className="glass-card p-5 block hover:border-gold-500/30 transition-all duration-200 hover:gold-glow group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-md border border-gold-400/20">
              {order.orderId}
            </span>
            <StatusBadge status={order.status} size="sm" />
          </div>

          <h3 className="font-display text-base font-semibold text-cream-100 truncate mb-3">
            {order.customerName}
          </h3>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              {order.phoneNumber}
            </span>
            <span className="flex items-center gap-1">
              <Shirt size={12} />
              {totalGarments} garments
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(order.createdAt), 'dd MMM yyyy')}
            </span>
            {order.estimatedDelivery && (
              <span className="flex items-center gap-1 text-amber-500">
                <Clock size={12} />
                Est. {format(new Date(order.estimatedDelivery), 'dd MMM')}
              </span>
            )}
          </div>
        </div>

        {/* Right - amount */}
        <div className="flex flex-col items-end gap-2">
          <p className="font-display font-bold text-xl text-cream-100">
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </p>
          <ChevronRight
            size={16}
            className="text-gray-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>

      {/* Garment tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {order.garments.slice(0, 4).map((g, i) => (
          <span
            key={i}
            className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full"
          >
            {g.quantity}x {g.type}
          </span>
        ))}
        {order.garments.length > 4 && (
          <span className="text-xs text-gray-600">+{order.garments.length - 4} more</span>
        )}
      </div>
    </Link>
  );
};

export default OrderCard;
