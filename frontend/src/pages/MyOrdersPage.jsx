import { useQuery } from '@tanstack/react-query';
import { format, isPast } from 'date-fns';
import {
  Phone,
  Calendar,
  Clock,
  Shirt,
  Package,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ordersAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/common/StatusBadge';
import { PageLoader } from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

// Progress bar showing which stage the order is at
const OrderProgress = ({ status }) => {
  const stages = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  const currentIdx = stages.indexOf(status);
  const stageConfig = {
    RECEIVED:   { emoji: '📥', label: 'Received' },
    PROCESSING: { emoji: '⚙️', label: 'Cleaning' },
    READY:      { emoji: '✅', label: 'Ready' },
    DELIVERED:  { emoji: '🎉', label: 'Delivered' },
  };

  return (
    <div className="flex items-center gap-1 mt-4">
      {stages.map((stage, idx) => (
        <div key={stage} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all
                ${idx <= currentIdx
                  ? 'border-gold-400 bg-gold-400/15'
                  : 'border-white/10 bg-white/3 opacity-30'
                }`}
            >
              {stageConfig[stage].emoji}
            </div>
            <p className={`text-xs mt-1 font-mono ${idx <= currentIdx ? 'text-gold-400' : 'text-gray-700'}`}>
              {stageConfig[stage].label}
            </p>
          </div>
          {idx < stages.length - 1 && (
            <div className={`h-0.5 w-4 mb-4 mx-0.5 ${idx < currentIdx ? 'bg-gold-400/50' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

// Single order card — customer view
const CustomerOrderCard = ({ order }) => {
  const totalGarments = order.garments.reduce((s, g) => s + g.quantity, 0);
  const isReady = order.status === 'READY';
  const isDelivered = order.status === 'DELIVERED';
  const deliveryPast = order.estimatedDelivery && isPast(new Date(order.estimatedDelivery));

  return (
    <div className={`glass-card p-5 border transition-all ${
      isReady
        ? 'border-emerald-400/40 shadow-lg shadow-emerald-400/5'
        : 'border-white/10'
    }`}>
      {/* Ready banner */}
      {isReady && (
        <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          <p className="text-emerald-400 text-sm font-medium">
            Your clothes are ready! Please visit the store.
          </p>
        </div>
      )}

      {/* Order ID + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-gold-400 bg-gold-400/10 px-2.5 py-1 rounded-lg border border-gold-400/20">
          {order.orderId}
        </span>
        <StatusBadge status={order.status} />
      </div>

      {/* Garments list */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {order.garments.map((g, i) => (
          <span
            key={i}
            className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full flex items-center gap-1"
          >
            <Shirt size={11} className="text-gray-500" />
            {g.quantity}× {g.type}
          </span>
        ))}
      </div>

      {/* Meta info row */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Package size={12} />
          {totalGarments} garment{totalGarments > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {format(new Date(order.createdAt), 'dd MMM yyyy')}
        </span>
        {order.estimatedDelivery && !isDelivered && (
          <span className={`flex items-center gap-1 ${deliveryPast && !isDelivered ? 'text-rose-400' : 'text-amber-500'}`}>
            <Clock size={12} />
            Est. {format(new Date(order.estimatedDelivery), 'dd MMM')}
            {deliveryPast && ' (Delayed)'}
          </span>
        )}
      </div>

      {/* Bill */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <p className="text-xs text-gray-600">Total Bill</p>
        <p className="font-display font-bold text-lg text-cream-100">
          ₹{order.totalAmount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Progress bar */}
      {!isDelivered && <OrderProgress status={order.status} />}

      {/* Special instructions */}
      {order.specialInstructions && (
        <p className="text-xs text-gray-600 mt-3 italic border-t border-white/5 pt-3">
          📝 "{order.specialInstructions}"
        </p>
      )}
    </div>
  );
};

const MyOrdersPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersAPI.getMyOrders().then((r) => r.data.data.orders),
    refetchInterval: 60000, // auto-refresh every 60s
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/customer-login');
  };

  const orders = data || [];
  const pendingOrders = orders.filter((o) => o.status !== 'DELIVERED');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="min-h-screen">
      {/* Customer Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-400/10 bg-charcoal-900/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-display font-black text-sm">C</span>
            </div>
            <span className="font-display font-bold text-lg text-cream-100">CleanPress</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Welcome</p>
              <p className="text-sm font-medium text-cream-100">{user?.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
              <span className="text-emerald-400 text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-400/10"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-cream-100">
            Namaste, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <Phone size={12} />
            +91 {user?.phone}
          </p>
        </div>

        {/* Ready alert banner */}
        {readyOrders.length > 0 && (
          <div className="mb-6 bg-emerald-400/10 border border-emerald-400/30 rounded-2xl p-4 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-emerald-300">
                  {readyOrders.length} order{readyOrders.length > 1 ? 's' : ''} ready for pickup!
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Please visit the store at your convenience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary pills */}
        {orders.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total', value: orders.length, color: 'text-cream-100' },
              { label: 'Active', value: pendingOrders.length, color: 'text-amber-400' },
              { label: 'Ready', value: readyOrders.length, color: 'text-emerald-400' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-3 text-center border border-white/5">
                <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="text-center py-16 text-rose-400 text-sm">
            Could not load your orders. Please refresh.
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            subtitle="Visit our store to drop off your clothes — your orders will appear here"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Active orders first */}
            {pendingOrders.length > 0 && (
              <>
                <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                  Active Orders
                </p>
                {pendingOrders.map((o) => (
                  <CustomerOrderCard key={o._id} order={o} />
                ))}
              </>
            )}

            {/* Past delivered orders */}
            {orders.filter((o) => o.status === 'DELIVERED').length > 0 && (
              <>
                <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mt-4">
                  Past Orders
                </p>
                {orders
                  .filter((o) => o.status === 'DELIVERED')
                  .map((o) => (
                    <div key={o._id} className="opacity-60">
                      <CustomerOrderCard order={o} />
                    </div>
                  ))}
              </>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-700 mt-10">
          For help, call us or visit the store · Updates every 60 seconds
        </p>
      </div>
    </div>
  );
};

export default MyOrdersPage;
