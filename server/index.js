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
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Configuration, OpenAIApi } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

const PORT =3000

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running successfully');
    });
}


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/Chat_Data")
// console.log("mongoose is connected")

const connectDb = async()=>{
    await mongoose.connect(`mongodb+srv://laxmiray013:3yxARaz2KZWkS92M@cluster0.4ltnxpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
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
// Update CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://collaborative-code-editor-0ka2.onrender.com'
        : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Update Socket.IO server configuration
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? 'https://collaborative-code-editor-0ka2.onrender.com'
            : 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
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

    

    socket.on("cursor-move", ({ RoomId, position }) => {
        socket.to(RoomId).emit("cursor-move", {
            userId: socket.id,
            position,
            username: userSocketMap[socket.id]
        });
    });

    
});



server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


// Initialize Gemini API with the public key
// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        return res.status(500).json({
            error: 'Gemini API key not configured'
        });
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
        });
        
        const { message } = req.body;
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message 
        });
    }
});


