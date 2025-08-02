// models/Goal.js

import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Goal || mongoose.model('Goal', goalSchema);
