import mongoose  from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;