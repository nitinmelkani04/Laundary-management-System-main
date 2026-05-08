import { useState } from 'react';
import { Plus, Trash2, IndianRupee, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Card, { CardHeader } from '../common/Card';
import { ordersAPI } from '../../utils/api';

const emptyGarment = () => ({ type: '', quantity: 1 });

const CreateOrderForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    specialInstructions: '',
  });
  const [garments, setGarments] = useState([emptyGarment()]);
  const [errors, setErrors] = useState({});

  // Fetch prices from backend
  const { data: prices } = useQuery({
    queryKey: ['garment-prices'],
    queryFn: () => ordersAPI.getGarmentPrices().then((r) => r.data.data),
    staleTime: Infinity,
  });

  const garmentOptions = prices
    ? Object.entries(prices).map(([type, price]) => ({
        label: `${type} — ₹${price}`,
        value: type,
      }))
    : [];

  const createMutation = useMutation({
    mutationFn: (payload) => ordersAPI.create(payload),
    onSuccess: (res) => {
      toast.success(`Order ${res.data.data.order.orderId} created!`);
      navigate(`/orders/${res.data.data.order._id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create order');
    },
  });

  const addGarment = () => setGarments((prev) => [...prev, emptyGarment()]);

  const removeGarment = (idx) =>
    setGarments((prev) => prev.filter((_, i) => i !== idx));

  const updateGarment = (idx, field, value) =>
    setGarments((prev) =>
      prev.map((g, i) =>
        i === idx ? { ...g, [field]: field === 'quantity' ? Number(value) : value } : g
      )
    );

  // Live bill calculation
  const billItems = garments.map((g) => ({
    ...g,
    pricePerItem: prices?.[g.type] || 0,
    subtotal: (prices?.[g.type] || 0) * g.quantity,
  }));
  const totalAmount = billItems.reduce((s, g) => s + g.subtotal, 0);

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phoneNumber))
      errs.phoneNumber = 'Enter valid 10-digit Indian phone number';
    garments.forEach((g, i) => {
      if (!g.type) errs[`garment_${i}`] = 'Select a garment type';
      if (g.quantity < 1) errs[`qty_${i}`] = 'Min quantity is 1';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    createMutation.mutate({
      ...form,
      garments: garments.map((g) => ({ type: g.type, quantity: g.quantity })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Customer + Garments */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader title="Customer Information" subtitle="Enter the customer's details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              error={errors.customerName}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              error={errors.phoneNumber}
              maxLength={10}
            />
            <div className="sm:col-span-2">
              <Input
                label="Special Instructions (optional)"
                placeholder="e.g. Handle with care, starch the shirt..."
                value={form.specialInstructions}
                onChange={(e) =>
                  setForm({ ...form, specialInstructions: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        {/* Garments */}
        <Card>
          <CardHeader
            title="Garments"
            subtitle="Add items to be cleaned"
            action={
              <Button variant="secondary" size="sm" icon={Plus} onClick={addGarment} type="button">
                Add Item
              </Button>
            }
          />

          <div className="flex flex-col gap-3">
            {garments.map((g, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-end p-4 bg-white/3 rounded-xl border border-white/5"
              >
                <Select
                  label={idx === 0 ? 'Garment Type' : undefined}
                  options={garmentOptions}
                  value={g.type}
                  onChange={(e) => updateGarment(idx, 'type', e.target.value)}
                  placeholder="Select garment..."
                  error={errors[`garment_${idx}`]}
                  containerClass="flex-1"
                />
                <Input
                  label={idx === 0 ? 'Qty' : undefined}
                  type="number"
                  min="1"
                  max="50"
                  value={g.quantity}
                  onChange={(e) => updateGarment(idx, 'quantity', e.target.value)}
                  error={errors[`qty_${idx}`]}
                  containerClass="w-20"
                />
                {prices && g.type && (
                  <div className={`pb-1 text-right min-w-20 ${idx === 0 ? 'mt-6' : ''}`}>
                    <p className="text-xs text-gray-600">Subtotal</p>
                    <p className="text-sm font-mono text-gold-400">
                      ₹{(prices[g.type] * g.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {garments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGarment(idx)}
                    className={`text-gray-600 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 ${idx === 0 ? 'mt-6' : ''}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right: Bill Summary */}
      <div className="flex flex-col gap-4">
        <Card glow className="sticky top-24">
          <CardHeader title="Bill Summary" subtitle="Live calculation" />

          {/* Line items */}
          <div className="flex flex-col gap-2 mb-5">
            {billItems.map((item, i) =>
              item.type ? (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {item.type} × {item.quantity}
                  </span>
                  <span className="font-mono text-cream-100">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : null
            )}
            {billItems.every((b) => !b.type) && (
              <p className="text-gray-600 text-sm text-center py-4">
                Add garments to see bill
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="font-display text-base text-gray-300">Total Amount</span>
              <span className="font-display font-bold text-2xl text-gold-gradient">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Est. delivery note */}
          <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3 mb-5 text-xs text-emerald-400 flex items-center gap-2">
            <ShoppingBag size={14} />
            Estimated delivery in 3 working days
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={createMutation.isPending}
            icon={IndianRupee}
          >
            Create Order
          </Button>
        </Card>
      </div>
    </form>
  );
};

export default CreateOrderForm;
