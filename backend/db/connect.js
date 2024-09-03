import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "advance-auth",
            bufferCommands: false
        })
        console.log(`DATABASE connected to host ${connect.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}