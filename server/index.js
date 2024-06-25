const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const path = require('path');
const Code =require('./Model/Code')
const GetMessage = require('./GetMessage')
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Chat = require("./Chat")
const { Executepy } = require('./Executepy');
const { Executejs } = require('./Executejs');
const { GenerateFile } = require('./GenerateFile');
const { Run } = require('./Run');
const { Executec } = require('./Executec');
const { Executejava } = require('./Executejava');
const Chats = require('./Model/Schema');

const app = express();

const __dirname1 = path.resolve();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, 'client', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send("API is running successfully");
    });
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/Chat_Data")
// console.log("mongoose is connected")

const connectDb = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`this db is connected with ${mongoose.connection.host}`)
  }
  
  connectDb();


app.post("/run", async (req, res) => {
    const { language, code, input } = req.body;

    console.log(language, code, input);
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "empty" });
    }

    try {
        let output;
        const filepath = await GenerateFile(language, code);

        if (language === "cpp") {
            output = await Run(filepath, input);
        } else if (language === "py") {
            output = await Executepy(filepath, input);
        } else if (language === "c") {
            output = await Executec(filepath, input);
        } else if (language === "js") {
            output = await Executejs(filepath, input);
        } else {
            output = await Executejava(filepath, input);
        }

        return res.json({ output });
    } catch (err) {
        res.status(500).json({ err });
    }
});

const server = http.createServer(app);
const io = new Server(server)

const userSocketMap = new Set();


const getAllClients = (RoomId) => {
    return Array.from(io.sockets.adapter.rooms.get(RoomId) || []).map(
        (socketId) => {
            return {
                socketId,
                Username: userSocketMap[socketId],
            }
        }
    )
}



io.on('connection',async (socket) => {

    console.log("socket Id", socket.id);


    socket.on('join', async ({ RoomId, Username,senderSocketId }) => {
      
        userSocketMap[socket.id] = Username;
        socket.join(RoomId);
        console.log("sender : ",senderSocketId)
        const room = await Chats.findOne({ roomId: RoomId});
        if (room) {

           
            const messagesWithUsername = room.messages.map((msg) => ({
                msg: msg.msg,
                socketId: msg.socketId,
                username: msg.username 
            }));
            socket.emit("chatHistory", messagesWithUsername, senderSocketId);
            
           
        }
        

        const clients = getAllClients(RoomId);

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                Username,
                socketId: socket.id,
            });
        })
       

    });
    socket.on('message', async ({ message, RoomId, senderSocketId ,username}) => {
        try {

            console.log(`Message received in room ${RoomId} from ${senderSocketId}:`, message);

            console.log("senderSocketId :",senderSocketId)

            const updatedRoom = await Chats.findOneAndUpdate(
                { roomId: RoomId },
                { $push: { messages: { msg: message, socketId: senderSocketId, username } } },
                { new: true, upsert: true }
            );

            console.log(updatedRoom);

            const clients = getAllClients(RoomId);

            clients.forEach(({ socketId }) => {
                if (socketId !== senderSocketId) {
                    io.to(socketId).emit('messageSent', { message ,username });

                   
                }

            });

        } catch (error) {
            console.error('Error emitting message:', error);
        }

    });
   
  

    socket.on("code-change", async  ({ RoomId, code }) => {

        console.log(code)
        
        socket.in(RoomId).emit('code-change', { code });

        try {
            await Code.findOneAndUpdate(
                { roomId: RoomId },
                { $push: { codes: { code } } },
                { new: true, upsert: true }
            );
            console.log("Code updated successfully:");
            // Broadcast the code change to all clients in the room
        } catch (error) {
            console.error('Error updating code:', error);
        }
    });

    socket.on("sync-code", ({ socketId, code }) => {

        io.to(socketId).emit("code-change", { code });
    })
    
    socket.on('logout', ({ RoomId, Username }) => {
        console.log(`${Username} logged out from room ${RoomId}`);
        socket.to(RoomId).emit('disconnected', {
          socketId: socket.id,
          Username,
        });
    
        
        delete userSocketMap[socket.id];
        socket.leave(RoomId);
      });

    socket.on('disconnecting', () => {
        
        const rooms = [...socket.rooms];
        rooms.forEach((RoomId) => {
            socket.in(RoomId).emit("disconnected", {
                socketId: socket.id,
                Username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });

    

});



server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
