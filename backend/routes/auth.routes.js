import express from 'express'
import { forgetPassword, logout, signIn, signUp, verifyEmail } from '../controllers/auth.controllers.js'

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/verify-email', verifyEmail)
router.post("/logout", logout)
router.post("/forget-password", forgetPassword)


export default router