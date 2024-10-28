// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId], 
    required: true,
    ref: 'User', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
});

// Tạo mô hình Room
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
