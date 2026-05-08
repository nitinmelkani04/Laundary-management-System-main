

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const GARMENT_PRICES = {
  Shirt: 50, Pants: 70, Saree: 150, Suit: 250, Jacket: 200,
  Kurta: 80, Lehenga: 300, Bedsheet: 120, Curtain: 180,
  Blanket: 200, Tie: 40, Sweater: 100,
};

const garmentSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: Object.keys(GARMENT_PRICES) },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'] },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => 'ORD-' + uuidv4().slice(0, 8).toUpperCase(),
    },
    customerName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String, required: true, trim: true,
      match: [/^[6-9]\d{9}$/, 'Valid 10-digit Indian phone required'],
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    garments: {
      type: [garmentSchema],
      validate: { validator: (v) => v.length > 0, message: 'At least one garment required' },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
      default: 'RECEIVED',
    },
    statusHistory: [statusHistorySchema],

    // Estimated delivery — set on creation, cleared when delivered
    estimatedDelivery: { type: Date },

    // ✅ NEW: Actual delivery timestamp — set when status = DELIVERED
    actualDelivery: { type: Date, default: null },

    specialInstructions: { type: String, trim: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-set estimated delivery on creation (+3 days)
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    this.estimatedDelivery = delivery;
    this.statusHistory.push({ status: 'RECEIVED', note: 'Order created' });
  }
  next();
});

// Auto-link customer account by phone
orderSchema.statics.linkCustomer = async function (phoneNumber) {
  const User = mongoose.model('User');
  const customer = await User.findOne({ phone: phoneNumber, role: 'customer' });
  return customer ? customer._id : null;
};

orderSchema.statics.GARMENT_PRICES = GARMENT_PRICES;

module.exports = mongoose.model('Order', orderSchema);
