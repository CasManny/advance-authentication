import jwt from 'jsonwebtoken'
export const generateTokenAndSetCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })
    res.cookie('token', token, {
        httpOnly: true, // prevent Xss attacks,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict", // prevent cfrs attacks
    })

}