const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  notificationSettings: {
    emailNotifications: {
      type: Boolean,
      default: true, 
    },
    pushNotifications: {
      type: Boolean,
      default: true, 
    },
    theme: {
      type: String,
      enum: ['light', 'dark'], 
      default: 'light',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;
