import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['wishlist_match', 'new_request', 'request_update', 'system'],
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    relatedItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    },
    relatedRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
