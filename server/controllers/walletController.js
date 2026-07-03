import Razorpay from "razorpay";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import WalletOrder from "../models/WalletOrder.js";
import logger from "../utils/logger.js";

// Ensure you have these in your .env file
// RAZORPAY_KEY_ID=
// RAZORPAY_KEY_SECRET=

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('relatedItem', 'name');

        res.json(transactions);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch transactions');
        res.status(500).json({ message: "Server Error" });
    }
};

export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, seeds } = req.body;

        if (!amount || !seeds || amount <= 0 || seeds <= 0) {
            return res.status(400).json({ message: "Invalid amount or seeds value" });
        }

        // Razorpay expects amount in paise (1 INR = 100 paise)
        // Adjust this if you are using USD (cents) etc.
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Math.random() * 1000}`,
        };

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            logger.error('Razorpay keys are not configured; refusing to create order');
            return res.status(500).json({ message: "Payments are not configured on this server" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create(options);

        // Record server-side what this order is worth in seeds, so
        // verifyPayment() never has to trust a client-supplied value.
        await WalletOrder.create({
            user: req.user._id,
            razorpayOrderId: order.id,
            amount: options.amount,
            seeds,
        });

        res.json({ ...order, seeds });
    } catch (error) {
        logger.error({ err: error }, 'Failed to create Razorpay order');
        res.status(500).json({ message: "Server Error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            logger.error('Razorpay keys are not configured; refusing to verify payment');
            return res.status(500).json({ message: "Payments are not configured on this server" });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment verification fields" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // A missing/misconfigured key is handled above and never reaches
        // this comparison, so there is no bypass path left here.
        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ message: "Invalid Signature" });
        }

        // Look up what this order was actually created for. The amount of
        // seeds credited comes ONLY from this server-side record, never
        // from the client's request body.
        const order = await WalletOrder.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id,
        });

        if (!order) {
            logger.error({ razorpay_order_id }, 'No matching WalletOrder found for verified payment');
            return res.status(400).json({ message: "Order not found" });
        }

        if (order.status === "verified") {
            return res.status(400).json({ message: "This order has already been verified" });
        }

        const seeds = order.seeds;

        const user = await User.findById(req.user._id);
        user.points += seeds;
        await user.save();

        order.status = "verified";
        await order.save();

        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'purchased',
            amount: seeds,
            description: `Purchased ${seeds} EcoSeeds via Razorpay`,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        res.json({ message: "Payment verified successfully", transaction, newBalance: user.points });
    } catch (error) {
        logger.error({ err: error }, 'Failed to verify payment');
        res.status(500).json({ message: "Server Error" });
    }
};