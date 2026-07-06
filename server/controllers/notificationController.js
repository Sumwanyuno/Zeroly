import Notification from '../models/Notification.js';
import logger from '../utils/logger.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate('relatedItem', 'name imageUrl')
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50 notifications
        res.json(notifications);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch notifications');
        res.status(500).json({ message: "Server Error fetching notifications" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Ensure user owns this notification
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        logger.error({ err: error }, 'Failed to mark notification as read');
        res.status(500).json({ message: "Server Error marking notification as read" });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        logger.error({ err: error }, 'Failed to mark all notifications as read');
        res.status(500).json({ message: "Server Error marking all as read" });
    }
};
