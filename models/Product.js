const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  price:    { type: Number, required: true },
  category: { type: String, required: true, enum: ['Electronics','Fashion','Home','Sports','Beauty'] },
  rating:   { type: Number, required: true, min: 0, max: 5 },
  stock:    { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
