
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, IndianRupee, Clock, CheckCircle, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ordersAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import GarmentsChart from '../components/dashboard/GarmentsChart';
import Card, { CardHeader } from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import { PageLoader } from '../components/common/Spinner';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => ordersAPI.getDashboard().then((r) => r.data.data),
    //  FIX: Auto-refresh every 15 seconds — no manual page reload needed
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,  // refetch when user comes back to tab
    staleTime: 0,                // always consider data stale → always refetch
  });

  if (isLoading) return <PageLoader />;

  const { totalOrders, totalRevenue, ordersPerStatus, recentOrders, topGarments } = data;
  const pendingOrders = (ordersPerStatus.RECEIVED || 0) + (ordersPerStatus.PROCESSING || 0);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-gray-500 text-sm font-mono mb-1">
            {format(new Date(), 'EEEE, dd MMM yyyy')}
          </p>
          <h1 className="font-display font-bold text-3xl text-cream-100">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Live dashboard</p>
            {/* ✅ Auto-refresh indicator */}
            <span className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full ${
              isFetching
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-emerald-400 bg-emerald-400/10'
            }`}>
              <RefreshCw size={10} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'Updating...' : `Updated ${format(new Date(dataUpdatedAt), 'hh:mm:ss a')}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Refresh
          </Button>
          <Link to="/orders/new">
            <Button variant="primary" icon={Plus}>New Order</Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Orders" value={totalOrders} icon={ShoppingBag} accent="gold" delay={0} />
        <StatCard label="Total Revenue" value={totalRevenue} icon={IndianRupee} accent="emerald" prefix="₹" delay={100} />
        <StatCard label="Pending Orders" value={pendingOrders} icon={Clock} accent="blue" delay={200} />
        <StatCard label="Delivered" value={ordersPerStatus.DELIVERED || 0} icon={CheckCircle} accent="violet" delay={300} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader title="Orders by Status" subtitle="Live count per stage" />
          <StatusChart data={ordersPerStatus} />
        </Card>
        <Card>
          <CardHeader title="Top Garments" subtitle="Most cleaned by volume" />
          <GarmentsChart data={topGarments} />
        </Card>
      </div>

      {/* Status pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { status: 'RECEIVED', count: ordersPerStatus.RECEIVED || 0, color: 'border-blue-400/20 bg-blue-400/5' },
          { status: 'PROCESSING', count: ordersPerStatus.PROCESSING || 0, color: 'border-amber-400/20 bg-amber-400/5' },
          { status: 'READY', count: ordersPerStatus.READY || 0, color: 'border-emerald-400/20 bg-emerald-400/5' },
          { status: 'DELIVERED', count: ordersPerStatus.DELIVERED || 0, color: 'border-violet-400/20 bg-violet-400/5' },
        ].map(({ status, count, color }) => (
          <Link key={status} to={`/orders?status=${status}`}
            className={`glass-card p-4 border ${color} hover:scale-105 transition-transform duration-200 text-center`}>
            <p className="font-display font-bold text-2xl text-cream-100">{count}</p>
            <StatusBadge status={status} size="sm" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader
          title="Recent Orders"
          subtitle="Last 5 orders"
          action={
            <Link to="/orders">
              <Button variant="ghost" size="sm" icon={ArrowRight}>View All</Button>
            </Link>
          }
        />
        {recentOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-600 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-600 font-mono uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4">
                      <Link to={`/orders/${order._id}`} className="font-mono text-xs text-gold-400 hover:underline">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-cream-100 font-medium">{order.customerName}</td>
                    <td className="py-3 pr-4 font-mono text-emerald-400">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4"><StatusBadge status={order.status} size="sm" /></td>
                    <td className="py-3 text-gray-600 text-xs">{format(new Date(order.createdAt), 'dd MMM, hh:mm a')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-gray-700 mt-5">
        Auto-refreshes every 15 seconds · Last updated: {format(new Date(dataUpdatedAt), 'hh:mm:ss a')}
      </p>
    </Layout>
  );
};

export default DashboardPage;
