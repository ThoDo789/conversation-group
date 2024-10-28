const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const ConversationList = require('../models/ConversationList');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:   
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 */

/**
 * @swagger
 * /api/chat/rooms:
 *   post:
 *     summary: Create a new chat room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:  
 *               - name
 *               - members
 *               - adminId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the chat room
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs in the chat room
 *               adminId:
 *                 type: string
 *                 description: ID of the admin user
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 members:
 *                   type: array
 *                   items:
 *                     type: string
 *                 adminId:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/rooms', authenticateToken, async (req, res) => {
  console.log(req.body)
  const { name, members, adminId } = req.body;

  try {
    const newRoom = new Room({ name, members, adminId });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/rooms/{userId}:
 *   get:
 *     summary: Get list of chat rooms for a user
 *     tags: [Chat]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat rooms
 *       500:
 *         description: Server error
 */
router.get('/rooms/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ members: userId });
    res.json(rooms);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
router.post('/messages', authenticateToken, async (req, res) => {
  const { conversationId, senderId, content } = req.body;

  try {
    const newMessage = new Message({ conversationId, senderId, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/messages/{conversationId}:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Chat]
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Server error
 */
router.get('/messages/:conversationId', authenticateToken, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });
    res.json(messages);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/messages/{id}/read:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Chat]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message marked as read
 *       500:
 *         description: Server error
 */
router.put('/messages/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/conversation-list:
 *   post:
 *     summary: Create or update conversation list for a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               conversationId:
 *                 type: string
 *               lastMessage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conversation list updated successfully
 *       500:
 *         description: Server error
 */
router.post('/conversation-list', authenticateToken, async (req, res) => {
  const { userId, conversationId, lastMessage } = req.body;

  try {
    const conversationList = await ConversationList.findOneAndUpdate(
      { userId },
      {
        $push: {
          conversations: {
            conversationId,
            lastMessage,
            lastTimestamp: new Date(),
            unreadCount: 1,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(conversationList);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/chat/conversation-list/{userId}:
 *   get:
 *     summary: Get conversation list for a user
 *     tags: [Chat]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversation list retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/conversation-list/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const conversationList = await ConversationList.findOne({ userId });
    res.json(conversationList);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
