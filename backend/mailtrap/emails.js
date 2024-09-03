import { mailTrapClient, sender } from './mailtrap.config.js'
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js'


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: 'Email Verification'
        })
        console.log('Email sent successfully...')
    } catch (error) {
        console.log(error)
        throw new Error("Error sending Verification Email")
    }
}

export const sendWelcomeEmail = async (email) => {
    const recipient = [{ email }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "7e023364-fe2b-4831-b6e7-a190df18a074",
        })
        console.log("Welcome email sent successfully...")
    } catch (error) {
        console.log(error)
     throw new Error("Error sending Welcome Email")   
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{ email }]
    
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetUrl}', resetUrl),
            category: 'Password Reset'

        })
        console.log('reset password email sent')
    } catch (error) {
        console.log(error)
    }
    
}

export const resetSuccessEmail = async (email) => {
    const recipient = [{ email }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            category: "Success email sent",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        })
        console.log("sent successfully.")
    } catch (error) {
        console.log(error)
    }
}