import User from '../models/user-models.js';
import Verification from '../models/verification-models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../libs/send-email.js';
import aj from '../libs/arcjet.js';


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1️⃣ Arcjet protection
        const decision = await aj.protect(req, { email });
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            return res.status(403).json({ message: "Invalid email address" });
        }

        // 2️⃣ Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 3️⃣ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4️⃣ Create user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            isVerified: false
        });

        await newUser.save();

        // 5️⃣ Create verification token
        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: "emailVerification" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 6️⃣ Create verification link
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const emailBody = `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `;

        const subject = "Verify your email address";

        // 7️⃣ Send email FIRST
        const isEmailSend = await sendEmail(email, subject, emailBody);

        if (!isEmailSend) {
            // rollback user if email failed (important)
            await User.findByIdAndDelete(newUser._id);
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        // 8️⃣ Save verification record AFTER email success
        await Verification.create({
            userId: newUser._id,
            token: verificationToken,
            expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
        });

        // 9️⃣ Success response
        return res.status(201).json({
            message: "Verification email sent to your email. Please verify your account."
        });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification && existingVerification.expiresAt > Date.now()) {
                return res.status(400).json({ message: "Please verify your email to login" });

            } else {
                await Verification.findByIdAndDelete(existingVerification?._id);

                const verificationToken = jwt.sign(
                    { userId: user._id, purpose: 'emailVerification' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                )
                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: Date.now() + 3600000, // 1 hour
                })

                const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

                const emailBody = `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `;

                const subject = "Verify your email address";

                const isEmailSend = await sendEmail(email, subject, emailBody);

                if (!isEmailSend) {
                    return res.status(500).json({ message: "Failed to send verification email" });
                }
                return res.status(400).json({ message: "Please verify your email to login. A new verification email has been sent." }); 

            }
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ token, message: "Login successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}


const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.purpose !== 'emailVerification') {
            return res.status(400).json({ message: "Invalid token purpose" });
        }

        const verificationRecord = await Verification.findOne({ userId: payload.userId, token });
        console.log(verificationRecord, "verificaton");


        if (!verificationRecord) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (verificationRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verificationRecord._id);

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}



const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if(!user.isEmailVerified){
            return res.status(400).json({ message: "Please verify your email before requesting a password reset" });
        }

        const existingVerification = await Verification.findOne({ userId: user._id });

        if (existingVerification && existingVerification.expiresAt > Date.now()) {
            return res.status(400).json({ message: "Reset password request is already sent" });
        }


        if(existingVerification && existingVerification.expiresAt <= Date.now()){
            await Verification.findByIdAndDelete(existingVerification._id);
        }



        const resetPasswordToken = jwt.sign(
            { userId: user._id, purpose: 'resetPassword' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        await Verification.create({
            userId: user._id,
            token: resetPasswordToken,
            expiresAt: Date.now() + 900000, // 15 minutes
        })

        const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

        const emailBody = `
            <h1>Reset Password</h1>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetPasswordLink}">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
        `;
        const subject = "Reset your password";

        const isEmailSend = await sendEmail(email, subject, emailBody);

        if (!isEmailSend) {
            return res.status(500).json({ message: "Failed to send reset password email" });
        }

        res.status(200).json({ message: "Reset password email sent to your email" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};


const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.purpose !== 'resetPassword') {
            return res.status(400).json({ message: "Invalid token purpose" });
        }

        const verificationRecord = await Verification.findOne({ userId: payload.userId, token });

        if (!verificationRecord) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (verificationRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        await Verification.findByIdAndDelete(verificationRecord._id);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};


export { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword};
