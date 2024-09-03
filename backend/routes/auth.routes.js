import express from 'express'
import { checkAuth, forgetPassword, logout, resetPassword, signIn, signUp, verifyEmail } from '../controllers/auth.controllers.js'
import { protectedRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/verify-email', verifyEmail)
router.post("/logout", logout)
router.post("/forget-password", forgetPassword)
router.post("/reset-password/:token", resetPassword)
router.get('/check-auth', protectedRoute, checkAuth)


export default router