const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items:      { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  currency:   { type: String, default: 'PKR' },
  status:     { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
