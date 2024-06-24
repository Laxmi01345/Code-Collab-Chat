import { IoMdSend } from "react-icons/io";
import { useEffect, useState, useContext, useRef } from "react";
import {  useParams, useNavigate } from "react-router-dom";
import SocketContext from "./Socketcontext";
import ExpuserContext from "./ExpuserContext";
import {useSetUsernameContext} from './SetUsernameContext'
import Avatar from "react-avatar";
import Colab from "./Colab";
export const Chatbtn = () => {
  const { socketRef } = useContext(SocketContext);
  const navigate = useNavigate();
  const {  Username } = useSetUsernameContext();  
  const {setuser} = useContext(ExpuserContext) ;
  const [typedMessage, setTypedMessage] = useState("");
  const [MergeMsg, setMergeMsg] = useState([]);
  const messageRef = useRef(null);
  
  const { RoomId } = useParams();

  useEffect(() => {
    const initializeSocket = async () => {
      if (!socketRef.current) {
       
        const socket = await Colab(navigate, socketRef);
        if (socket) {
          socketRef.current = socket;
          socket.emit('join', { RoomId, senderSocketId: socket.id,Username });
          console.log(`Joining room: ${RoomId}`);
        }
      } else {
        const socket = socketRef.current;
        socket.emit('join', { RoomId, senderSocketId: socket.id ,Username});
        console.log(`Joining room: ${RoomId}`);
      }

      const socket = socketRef.current;
      
      socket.on('chatHistory', (messagesWithUsername, senderSocketId) => {
        
        
        const mergedMessages = messagesWithUsername.map((msgObj) => {
          const { msg, socketId ,username} = msgObj;
          console.log("msg :", msg);
          console.log("socketId :", socketId, " !!", senderSocketId)
          const type = socketId === senderSocketId ? "sent" : "received";
          return { message: msg, type ,username};
        });

        setMergeMsg(mergedMessages);
      });
   
      const handleMessageReceived = ({message,username}) => {

        
        
        setMergeMsg((prevMergeMsg) => [
          ...prevMergeMsg,
          {  message , type: "received" ,username},
        ]);
      };

      socket.on('messageSent', handleMessageReceived);
      
      return () => {
        socket.off('messageSent', handleMessageReceived);
        
      };
    };

    initializeSocket();
  }, [socketRef, navigate, RoomId]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [MergeMsg]);

  

  const handleMessageSend = async () => {
    if (!typedMessage) {
      return;
    }

    const socket = socketRef?.current || await Colab(navigate);
    socket.emit('message', {
      message: typedMessage,
      RoomId,
      senderSocketId: socket.id,
      username:Username
    });

    console.log(`Message sent: ${typedMessage}`);

    setMergeMsg((prevMergeMsg) => [
      ...prevMergeMsg,
      { message: typedMessage, type: "sent" },
    ]);
    setTypedMessage("");
  };

  const handleInputChange = (e) => {
    setTypedMessage(e.target.value);
  };

  return (
    <div className="bg-slate-300 h-screen">
      <div className="bg-green-400 flex items-center">
        <button className="mx-10" onClick={() => navigate(-1)}>
          Back
        </button>
        <h1 className="flex-grow text-center text-white p-4 text-2xl">
          Group Chat
        </h1>
        <div className="mx-10"></div>
      </div>

      <div className="bg-black p-2 md:mx-80 h-3/4 overflow-scroll scrollbar-hide">
        <div className="h-96 px-10 py-4">
          {MergeMsg.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === "received" ? "justify-start" : "justify-end"} items-center mb-4 `}
            >
              {msg.type === "received" && (
                <Avatar name={msg.username} size={40} className='  rounded-md' />
              )}
              <div
                className={`${msg.type === "received" ? "bg-white" : "bg-green-200"
                  } rounded-lg p-2 max-w-80`}
              >
                {msg.message}
              </div>
              {msg.type === "sent" && (
                <Avatar name={Username} size={40} className='rounded-md' />
              )}
            </div>
          ))}
          <div ref={messageRef}></div>
        </div>
      </div>

      <div className="md:mx-80 p-2 bg-black">
        <div className="md:mx-60 p-4">
          <div className="md:p-4 flex justify-center bg-white rounded-full mx-16 md:mx-4">
            <input
              type="text"
              className="md:w-96 p-2 md:h-8 outline-none"
              value={typedMessage}
              onChange={handleInputChange}
              placeholder="Type a message...."
            />
            <IoMdSend className="md:m-1 m-2 cursor-pointer ml-16" size={24} onClick={handleMessageSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbtn;
