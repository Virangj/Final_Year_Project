import User from "../models/userModel.js"
import Message from "../models/messageModel.js"

export const getUserForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: { $ne:loggedInUserId} }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Message getUserForSideBar error", error.message )
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessage = async (req, res) =>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log("getMessage Controller Error: " , error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text , image } = req.body
        const {id: receiverId} = req.params
        const senderId = req.user._id

        let imageURL

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        }) 

        await newMessage.save()

        res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("sendMessage Controller Error: " , error.message)
        res.status(500).json({ message: "Internal Server Error" })   
    }
}