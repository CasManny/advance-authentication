import bcrypt from 'bcryptjs'
import  crypto  from 'crypto'

import { User } from '../models/user.model.js'
import { generateVerificationCode } from '../utils/generateVerificationCode.js'
import { generateTokenAndSetCookies } from '../utils/generateTokenAndSetCookies.js'
import { resetSuccessEmail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js'

export const signUp = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({error: "All fields are required"})
    }
    try {
        const userAlreadyExist = await User.findOne({ email: email })
        if (userAlreadyExist) {
            return res.status(400).json({error: "User already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const verificationToken = generateVerificationCode()
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })
        generateTokenAndSetCookies(newUser._id, res)
        await sendVerificationEmail(newUser.email, verificationToken)
        await newUser.save()
        return res.status(201).json({message: "created successfully", user: {...newUser._doc, password: ""}})
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
}


export const signIn = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({error: "All Fields are required"})
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({error: "User not found"})
        }
        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({error: "Incorrect password"})
        }

        generateTokenAndSetCookies(user._id, res)
        user.lastLogin = new Date()
        await user.save( )
        return res.status(200).json({message: "Login successfully..."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({ verificationCode: code, verificationTokenExpiresAt: { $gt: Date.now() } })
        if (!user) {
            return res.status(400).json({error: "Invalid or expired code"})
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined       
        await user.save()

        await sendWelcomeEmail(user.email)
        return res.status(200).json({message: "sent successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    return res.status(200).json({message: "logout successfully..."})
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({error: "provide email address"})
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({error: "No user Found"})
        }
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt
        await user.save()

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        return res.status(200).json({message: "Password reset link sent to your email"})
        
    } catch (error) {
        console.log(error)
     return res.status(500).json({error: "Internal Server Error"})   
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params 
    const { password } = req.body
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } })
        if (!user) {
            return res.status(400).json({error: "Invalid or expired token"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpiresAt = undefined
        await user.save()

        await resetSuccessEmail(user.email)

        return res.status(200).json({message: "password reset successfully..."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }

}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({error: "user not found"})
        }
        return res.status(200).json({user})
    } catch (error) {
        
    }
}