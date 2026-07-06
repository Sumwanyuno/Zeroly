import Request from "../models/Request.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import logger from "../utils/logger.js";

export const updateRequestStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }


        if (request.owner.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: "Not authorized to update this request" });
        }

        request.status = status;
        await request.save();

        if (status === "Accepted") {
            const item = await Item.findByIdAndUpdate(
                request.item,
                { 
                    status: "requested",
                    $inc: { version: 1 }
                },
                { new: true }
            );
            if (item) {
                // Emit socket event for real-time update
                req.app.get('io')?.emit('item-status-changed', {
                    itemId: item._id,
                    status: 'requested',
                    version: item.version,
                    requestId: request._id
                });
            }

            // Create Notification for the requester
            const notification = await Notification.create({
                user: request.requester,
                type: 'request_update',
                title: 'Request Accepted!',
                message: `Your request for ${item.name} was accepted!`,
                relatedItem: item._id,
                relatedRequest: request._id,
            });
            req.app.get('io')?.to(request.requester.toString()).emit('notification', notification);
        } else if (status === "Declined") {
            // When request is declined, make item available again
            const item = await Item.findByIdAndUpdate(
                request.item,
                { 
                    status: "available",
                    $inc: { version: 1 }
                },
                { new: true }
            );
            if (item) {
                // Emit socket event for real-time update
                req.app.get('io')?.emit('item-status-changed', {
                    itemId: item._id,
                    status: 'available',
                    version: item.version,
                    requestId: request._id
                });
            }
            
            // Create Notification for the requester
            const notification = await Notification.create({
                user: request.requester,
                type: 'request_update',
                title: 'Request Declined',
                message: `Your request for ${item.name} was declined.`,
                relatedItem: item._id,
                relatedRequest: request._id,
            });
            req.app.get('io')?.to(request.requester.toString()).emit('notification', notification);
        }

        res.json(request);
    } catch (error) {
        logger.error({ err: error }, 'Failed to update request status');
        res.status(500).json({ message: "Server Error" });
    }
};

export const getSentRequests = async(req, res) => {
    try {
        const requests = await Request.find({ requester: req.user._id })
            .populate("item", "name imageUrl")
            .populate("owner", "name");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


export const getReceivedRequests = async(req, res) => {
    try {
        const requests = await Request.find({ owner: req.user._id })
            .populate("item", "name imageUrl")
            .populate("requester", "name");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
export const createRequest = async(req, res) => {
    try {
        const { itemId } = req.body;
        const requesterId = req.user._id;

        // Use atomic operation to check and update item status in one step
        const item = await Item.findOneAndUpdate(
            { 
                _id: itemId, 
                status: 'available',
                user: { $ne: requesterId }
            },
            { 
                $set: { status: 'requested' },
                $inc: { version: 1 }
            },
            { new: true }
        );

        if (!item) {
            // Check if item exists but is not available
            const existingItem = await Item.findById(itemId);
            if (!existingItem) {
                return res.status(404).json({ message: "Item not found" });
            }
            if (existingItem.user.toString() === requesterId.toString()) {
                return res.status(400).json({ message: "You cannot request your own item" });
            }
            if (existingItem.status !== 'available') {
                return res.status(409).json({ message: `This item is currently ${existingItem.status}. Please try another item.` });
            }
            return res.status(409).json({ message: "Item is no longer available" });
        }

        const requesterUser = await User.findById(requesterId);
        const itemCost = item.ecoSeeds || 10;
        
        if (requesterUser.points < itemCost) {
            // Revert item status if insufficient points
            await Item.findByIdAndUpdate(itemId, { status: 'available', $inc: { version: 1 } });
            return res.status(400).json({ message: `Insufficient EcoSeeds. You need ${itemCost} EcoSeeds to request this item.` });
        }

        // Check for existing request atomically
        const existingRequest = await Request.findOne({
            item: itemId,
            requester: requesterId,
        });
        if (existingRequest) {
            // Revert item status
            await Item.findByIdAndUpdate(itemId, { status: 'available', $inc: { version: 1 } });
            return res.status(400).json({ message: "You have already requested this item" });
        }

        const request = new Request({
            item: itemId,
            requester: requesterId,
            owner: item.user,
        });

        const createdRequest = await request.save();
        
        // Emit socket event for real-time update
        req.app.get('io')?.emit('item-status-changed', {
            itemId: item._id,
            status: 'requested',
            version: item.version,
            requester: requesterId
        });

        // Emit notification to item owner
        const notification = await Notification.create({
            user: item.user,
            type: 'new_request',
            title: 'New Item Request',
            message: `${requesterUser.name} has requested your item: ${item.name}`,
            relatedItem: item._id,
            relatedRequest: createdRequest._id,
        });
        req.app.get('io')?.to(item.user.toString()).emit('notification', notification);

        res.status(201).json(createdRequest);
    } catch (error) {
        logger.error({ err: error }, 'Failed to create request');
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const verifyHandshake = async(req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to verify this request" });
        }

        if (request.status !== "Accepted") {
            return res.status(400).json({ message: "Only accepted requests can be verified" });
        }

        request.status = "Completed";
        await request.save();

        const item = await Item.findByIdAndUpdate(
            request.item,
            { 
                status: "given",
                $inc: { version: 1 }
            },
            { new: true }
        );
        
        if (item) {
            const itemCost = item.ecoSeeds || 10;
            
            // Deduct points from requester
            const requesterUser = await User.findById(request.requester);
            if (requesterUser) {
                requesterUser.points = Math.max(0, requesterUser.points - itemCost);
                await requesterUser.save();
            }

            // Award points to the donor (owner)
            const ownerUser = await User.findById(request.owner);
            if (ownerUser) {
                ownerUser.points += itemCost;
                
                ownerUser.handoversCompleted += 1;
                if (ownerUser.handoversCompleted >= 10 && !ownerUser.badges.includes("Zero-Waste Hero")) {
                    ownerUser.badges.push("Zero-Waste Hero");
                }

                await ownerUser.save();
            }

            // Log transactions
            await Transaction.create({
                user: request.requester,
                type: 'spent',
                amount: itemCost,
                description: `Requested item: ${item.name}`,
                relatedItem: item._id,
            });

            await Transaction.create({
                user: request.owner,
                type: 'earned',
                amount: itemCost,
                description: `Gave away item: ${item.name}`,
                relatedItem: item._id,
            });

            // Emit socket event for real-time update
            req.app.get('io')?.emit('item-status-changed', {
                itemId: item._id,
                status: 'given',
                version: item.version,
                requestId: request._id
            });
        }

        res.json({ message: "Handshake successful, points awarded!", request });
    } catch (error) {
        logger.error({ err: error }, 'Handshake verification failed');
        res.status(500).json({ message: "Server Error" });
    }
};