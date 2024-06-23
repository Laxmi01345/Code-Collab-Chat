const Chats = require('./Model/Schema')
const mongoose= require('mongoose')

const GetMessage = async(req,res)=>{

    const { RoomId } = req.params;
    try {
        // Find the room document in the database based on RoomId
        const room = await Chats.findOne({ roomId: RoomId });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Return the messages array from the room document
        return res.json({ messages: room.messages });
    } catch (error) {
        console.error('Error fetching room messages:', error);
        return res.status(500).json({ error: 'Failed to fetch room messages' });
    }
}

module.exports = GetMessage