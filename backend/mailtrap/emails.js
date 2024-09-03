import { mailTrapClient, sender } from './mailtrap.config.js'
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js'


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
