const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tenant'
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issueType: {
    type: String,
    required: [true, 'Please specify the issue type'],
    enum: [
      'plumbing', 
      'electrical', 
      'furniture', 
      'appliance',
      'structural',
      'cleaning',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  estimatedCost: Number,
  actualCost: Number,
  startDate: Date,
  completionDate: Date,
  beforePhotos: [String],
  afterPhotos: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);