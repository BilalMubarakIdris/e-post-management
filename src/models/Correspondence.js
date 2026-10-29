const mongoose = require('mongoose');

const correspondenceSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    name: String,
    organization: String,
    address: String,
    email: String,
    phone: String
  },
  recipient: {
    name: String,
    organization: String,
    address: String,
    email: String,
    phone: String
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  dateSent: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'assigned', 'forwarded', 'completed', 'archived'],
    default: 'pending'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Correspondence', correspondenceSchema);
