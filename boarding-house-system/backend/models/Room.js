const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true
  },
  floor: {
    type: Number,
    required: [true, 'Please specify the floor']
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify room capacity']
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  rentAmount: {
    type: Number,
    required: [true, 'Please specify the rent amount']
  },
  amenities: [String],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent deleting rooms that have tenants assigned
RoomSchema.pre('remove', async function(next) {
  const Tenant = mongoose.model('Tenant');
  const tenants = await Tenant.find({ room: this._id });
  if (tenants.length > 0) {
    next(new Error('Cannot delete room with assigned tenants'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Room', RoomSchema);