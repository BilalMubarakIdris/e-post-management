const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  correspondence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Correspondence',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['registered', 'assigned', 'forwarded', 'received', 'in_progress', 'completed', 'updated', 'remark_added']
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  remarks: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tracking', trackingSchema);
