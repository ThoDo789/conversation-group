// routes/settings.js
const express = require('express');
const UserSettings = require('../models/UserSettings');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User Settings
 *   description: User settings management
 */

/**
 * @swagger
 * /api/setting/settings:
 *   post:
 *     summary: Create or update user settings
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationSettings:
 *                 type: object
 *                 properties:
 *                   emailNotifications:
 *                     type: boolean
 *                   pushNotifications:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: User settings created or updated successfully
 *       500:
 *         description: Server error
 */
router.post('/settings', authenticateToken, async (req, res) => {
  const { notificationSettings } = req.body;
  const userId = req.userId; // Get ID from middleware

  try {
    const userSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { notificationSettings },
      { new: true, upsert: true } // Update or create
    );
    
    res.status(201).json(userSettings);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/setting/settings/{userId}:
 *   get:
 *     summary: Get user settings
 *     tags: [User Settings]
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
 *         description: User settings retrieved successfully
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Server error
 */
router.get('/settings/:userId', authenticateToken, async (req, res) => {
  const userId = req.userId; // Get ID from middleware

  try {
    const userSettings = await UserSettings.findOne({ userId });
    if (!userSettings) return res.status(404).send('Settings not found');
    res.json(userSettings);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
