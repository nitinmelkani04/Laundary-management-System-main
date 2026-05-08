const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly, staffOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/orders/garment-prices
router.get('/garment-prices', (req, res) => {
  res.json({ success: true, data: Order.GARMENT_PRICES });
});

// GET /api/orders/dashboard  — admin only
router.get('/dashboard', adminOnly, async (req, res, next) => {
  try {
    const [totalOrders, revenueResult, statusCounts, recentOrders, topGarments] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('orderId customerName totalAmount status createdAt estimatedDelivery actualDelivery'),
        Order.aggregate([
          { $unwind: '$garments' },
          { $group: { _id: '$garments.type', totalQuantity: { $sum: '$garments.quantity' }, totalRevenue: { $sum: '$garments.subtotal' } } },
          { $sort: { totalQuantity: -1 } },
          { $limit: 5 },
        ]),
      ]);

    const statusMap = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
    statusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

    res.json({
      success: true,
      data: { totalOrders, totalRevenue: revenueResult[0]?.total || 0, ordersPerStatus: statusMap, recentOrders, topGarments },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/staff-dashboard  — staff (no revenue)
router.get('/staff-dashboard', staffOrAdmin, async (req, res, next) => {
  try {
    const [statusCounts, recentOrders] = await Promise.all([
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderId customerName status createdAt estimatedDelivery actualDelivery'),
    ]);

    const statusMap = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
    statusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

    res.json({ success: true, data: { ordersPerStatus: statusMap, recentOrders } });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my-orders  — customer sees own orders
router.get('/my-orders', async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer only' });
    }
    const orders = await Order.find({ phoneNumber: req.user.phone }).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders  — list all (staff + admin)
router.get('/', staffOrAdmin, async (req, res, next) => {
  try {
    const { status, search, garmentType, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status.toUpperCase();
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }
    if (garmentType) query['garments.type'] = garmentType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email role'),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { orders, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders  — create (staff + admin)
router.post('/', staffOrAdmin, async (req, res, next) => {
  try {
    const { customerName, phoneNumber, garments, specialInstructions } = req.body;

    if (!garments || garments.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one garment required' });
    }

    const PRICES = Order.GARMENT_PRICES;
    const processedGarments = garments.map((g) => {
      const pricePerItem = PRICES[g.type];
      if (!pricePerItem) throw { statusCode: 400, message: `Unknown garment type: ${g.type}` };
      return { type: g.type, quantity: g.quantity, pricePerItem, subtotal: pricePerItem * g.quantity };
    });

    const totalAmount = processedGarments.reduce((s, g) => s + g.subtotal, 0);
    const customerId = await Order.linkCustomer(phoneNumber);

    const order = await Order.create({
      customerName, phoneNumber, customerId,
      garments: processedGarments, totalAmount,
      specialInstructions, createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: { order } });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    }).populate('createdBy', 'name email role');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role === 'customer' && order.phoneNumber !== req.user.phone) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
});

// ✅ FIXED: PATCH /api/orders/:id/status
// - When DELIVERED: set actualDelivery = now, clear estimatedDelivery
// - When any other status: just update status
router.patch('/:id/status', staffOrAdmin, async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

    if (!validStatuses.includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const newStatus = status.toUpperCase();
    order.status = newStatus;

    // ✅ FIX: When delivered, record actual delivery time
    if (newStatus === 'DELIVERED') {
      order.actualDelivery = new Date();        // actual delivery timestamp
      order.estimatedDelivery = null;           // clear estimated — it's done
    }

    order.statusHistory.push({
      status: newStatus,
      changedBy: req.user._id,
      note: note || `Status updated to ${newStatus} by ${req.user.name}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orders/:id  — admin only
router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
