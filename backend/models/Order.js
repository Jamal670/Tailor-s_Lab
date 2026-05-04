const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number },
  price: { type: Number }
});

const orderSchema = new mongoose.Schema({
  session_id: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  phone: { type: String },
  email: { type: String },
  street_address: { type: String },
  city: { type: String },
  country: { type: String },
  zipcode: { type: String },
  payment_method: { type: String, enum: ['COD', 'CARD'] },
  payment_status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  order_status: { type: String, enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  total_amount: { type: Number },
  trackingId: { type: String },
  items: [orderItemSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Order', orderSchema);
