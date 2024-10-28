const mongoose = require('mongoose');

const conversationListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  conversations: [
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Conversation', 
      },
      lastMessage: {
        type: String,
        required: true,
      },
      lastTimestamp: {
        type: Date,
        default: Date.now,
      },
      unreadCount: {
        type: Number,
        default: 0, 
      },
    },
  ],
});

const ConversationList = mongoose.model('ConversationList', conversationListSchema);

module.exports = ConversationList;
