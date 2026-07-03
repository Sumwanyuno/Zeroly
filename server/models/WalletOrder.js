import mongoose from "mongoose";

// Records how many seeds each Razorpay order is worth at the moment the
// order is created. verifyPayment() must look up the order here and credit
// exactly this amount — it must never trust a client-supplied `seeds` value.
const walletOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    seeds: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["created", "verified"],
        default: "created",
    },
}, { timestamps: true });

const WalletOrder = mongoose.model("WalletOrder", walletOrderSchema);
export default WalletOrder;