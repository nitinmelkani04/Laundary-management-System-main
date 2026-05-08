import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
// Added Printer icon
import { ArrowLeft, Phone, Calendar, Clock, Pencil, Trash2, User, FileText, CheckCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../utils/api';
import Layout from '../components/common/Layout';
import Card, { CardHeader } from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import UpdateStatusModal from '../components/orders/UpdateStatusModal';
import { PageLoader } from '../components/common/Spinner';

const STATUS_ORDER = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

// --- CSS for Printing ---
const printStyles = `
  @media print {
    body * { visibility: hidden; }
    #printable-receipt, #printable-receipt * { visibility: visible; }
    #printable-receipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      color: black !important;
      background: white !important;
      padding: 20px;
    }
    nav, footer, button, .no-print { display: none !important; }
  }
`;

const TimelineStep = ({ status, isActive, isCompleted, timestamp }) => {
  const config = {
    RECEIVED:   { emoji: '📥', label: 'Received' },
    PROCESSING: { emoji: '⚙️', label: 'Processing' },
    READY:      { emoji: '✅', label: 'Ready' },
    DELIVERED:  { emoji: '🎉', label: 'Delivered' },
  }[status];

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
        isCompleted || isActive
          ? 'border-gold-400 bg-gold-400/15'
          : 'border-white/10 bg-white/3 opacity-30'
      }`}>
        {config.emoji}
      </div>
      <p className={`text-xs font-mono text-center ${isCompleted || isActive ? 'text-gold-400' : 'text-gray-600'}`}>
        {config.label}
      </p>
      {timestamp && (
        <p className="text-xs text-gray-700">{format(new Date(timestamp), 'dd MMM')}</p>
      )}
    </div>
  );
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getById(id).then((r) => r.data.data.order),
    refetchInterval: 15000,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: () => ordersAPI.delete(id),
    onSuccess: () => {
      toast.success('Order deleted');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/orders');
    },
    onError: () => toast.error('Failed to delete'),
  });

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-rose-400 mb-4">Order not found.</p>
          <Link to="/orders"><Button variant="secondary">Back to Orders</Button></Link>
        </div>
      </Layout>
    );
  }

  const order = data;
  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);
  const statusTimestamps = {};
  order.statusHistory?.forEach((h) => { statusTimestamps[h.status] = h.changedAt; });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <style>{printStyles}</style>

      {/* ── HIDDEN PRINTABLE RECEIPT ── */}
      <div id="printable-receipt" className="hidden print:block font-sans">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-tight">CleanPress AI Laundry</h1>
          <p className="text-sm italic">Service Bill / Tax Invoice</p>
          <p className="text-xs mt-1">Order Date: {format(new Date(order.createdAt), 'dd/MM/yyyy hh:mm a')}</p>
        </div>

        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p className="font-bold border-b border-black inline-block mb-1">CUSTOMER DETAILS</p>
            <p className="text-lg font-bold">{order.customerName}</p>
            <p>{order.phoneNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-bold border-b border-black inline-block mb-1">INVOICE NO</p>
            <p className="text-lg font-mono font-bold">#{order.orderId}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>

        <table className="w-full text-left mb-8 border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2">Garment Type</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.garments.map((g, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 capitalize">{g.type}</td>
                <td className="py-2 text-center">{g.quantity}</td>
                <td className="py-2 text-right">₹{g.pricePerItem}</td>
                <td className="py-2 text-right font-bold">₹{g.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-48">
            <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2">
              <span>TOTAL:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {order.specialInstructions && (
          <div className="mb-8 text-xs italic bg-gray-50 p-2 border">
            <strong>Special Instructions:</strong> {order.specialInstructions}
          </div>
        )}

        <div className="text-center text-[10px] uppercase border-t pt-4 text-gray-500">
          <p>Thank you for your visit!</p>
          <p>Computer Generated Receipt • No Signature Required</p>
        </div>
      </div>

      {/* ── SCREEN UI ── */}
      <div className="mb-6">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-400 transition-colors">
          <ArrowLeft size={14} /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-gold-400 bg-gold-400/10 px-3 py-1 rounded-lg border border-gold-400/20">
              {order.orderId}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <h1 className="font-display font-bold text-3xl text-cream-100">{order.customerName}</h1>
        </div>
        <div className="flex gap-2">
          {/* PRINT BUTTON */}
          <Button variant="secondary" size="md" icon={Printer} onClick={handlePrint} className="border-gold-400/30 text-gold-400">
            Print Bill
          </Button>

          {order.status !== 'DELIVERED' && (
            <Button variant="secondary" size="md" icon={Pencil} onClick={() => setStatusModalOpen(true)}>
              Update Status
            </Button>
          )}
          <Button variant="danger" size="md" icon={Trash2} onClick={() => {
            if (window.confirm('Delete this order?')) deleteMutation.mutate();
          }} loading={deleteMutation.isPending}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader title="Order Progress" />
            <div className="flex items-start gap-2">
              {STATUS_ORDER.map((status, idx) => (
                <div key={status} className="flex items-center flex-1">
                  <TimelineStep
                    status={status}
                    isActive={order.status === status}
                    isCompleted={idx <= currentStatusIdx}
                    timestamp={statusTimestamps[status]}
                  />
                  {idx < STATUS_ORDER.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 mb-6 ${idx < currentStatusIdx ? 'bg-gold-400/50' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
            {order.status === 'DELIVERED' && order.actualDelivery && (
              <div className="mt-4 bg-emerald-400/8 border border-emerald-400/20 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" />
                <p className="text-sm text-emerald-400">
                  Delivered on {format(new Date(order.actualDelivery), 'dd MMM yyyy, hh:mm a')}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Garments" subtitle={`${order.garments.length} type(s)`} />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Garment', 'Qty', 'Price/Item', 'Subtotal'].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-600 font-mono uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {order.garments.map((g, i) => (
                  <tr key={i} className="hover:bg-white/3">
                    <td className="py-3 pr-4 font-medium text-cream-100">{g.type}</td>
                    <td className="py-3 pr-4 text-gray-400 font-mono">{g.quantity}</td>
                    <td className="py-3 pr-4 text-gray-400 font-mono">₹{g.pricePerItem}</td>
                    <td className="py-3 font-mono font-semibold text-gold-400">₹{g.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10">
                  <td colSpan={3} className="pt-4 text-sm text-gray-400 font-medium">Total</td>
                  <td className="pt-4 font-display font-bold text-xl text-gold-gradient">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <Card>
            <CardHeader title="Status History" subtitle="Full audit trail" />
            <div className="flex flex-col gap-3">
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} size="sm" />
                      <span className="text-xs text-gray-600 font-mono">
                        {format(new Date(h.changedAt), 'dd MMM yyyy, hh:mm a')}
                      </span>
                    </div>
                    {h.note && <p className="text-xs text-gray-500 mt-1">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card glow>
            <CardHeader title="Customer" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                {/* FIX: Only first letter */}
                <span className="text-gold-400 font-bold text-lg uppercase">
                  {order.customerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-cream-100">{order.customerName}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Phone size={12} /> {order.phoneNumber}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Details" />
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2 text-gray-400">
                <Calendar size={14} className="text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Created</p>
                  <p>{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                </div>
              </div>

              {order.status === 'DELIVERED' && order.actualDelivery ? (
                <div className="flex items-start gap-2 text-emerald-400">
                  <CheckCircle size={14} className="mt-0.5" />
                  <div>
                    <p className="text-xs text-emerald-600">Delivered On</p>
                    <p>{format(new Date(order.actualDelivery), 'dd MMM yyyy, hh:mm a')}</p>
                  </div>
                </div>
              ) : order.estimatedDelivery ? (
                <div className="flex items-start gap-2 text-amber-400">
                  <Clock size={14} className="mt-0.5" />
                  <div>
                    <p className="text-xs text-amber-600">Estimated Delivery</p>
                    <p>{format(new Date(order.estimatedDelivery), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ) : null}

              {order.createdBy && (
                <div className="flex items-start gap-2 text-gray-400">
                  <User size={14} className="text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Created by</p>
                    <p>{order.createdBy.name}</p>
                  </div>
                </div>
              )}
              {order.specialInstructions && (
                <div className="flex items-start gap-2 text-gray-400">
                  <FileText size={14} className="text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Instructions</p>
                    <p className="text-xs mt-0.5 leading-relaxed">{order.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1">Total Bill</p>
            <p className="font-display font-bold text-4xl text-gold-gradient">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {order.garments.reduce((s, g) => s + g.quantity, 0)} garments
            </p>
          </Card>
        </div>
      </div>

      <UpdateStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        order={order}
      />
    </Layout>
  );
};

export default OrderDetailPage;

