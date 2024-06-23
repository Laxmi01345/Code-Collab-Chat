/* eslint-disable react/prop-types */
import { TbMathGreater } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
// import {NotificationBadge} from "react-notification-badge"
import { FaCopy } from "react-icons/fa6";
import SocketContext from "./Socketcontext";
import { useState,useEffect,useContext } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom"

import toast from "react-hot-toast";
import { Client } from "./Client";
import logo from "./logo.png"

export const SideBar = ({ setClient, Clients ,Username}) => {
  const {RoomId} = useParams();
  const navigate =useNavigate();
  const {socketRef} = useContext(SocketContext)
  const [messageCount, setMessageCount] = useState(0);
  const [expanded, setExpanded] = useState(true);
  let ClientCnt=Clients.length;
   
   useEffect(() => {

   
    const handleMessageReceived = (message, Username) => {
      console.log("Message received:", message, "from:", Username);
      setMessageCount(prevCount => {
        console.log("Previous count:", prevCount);
        return prevCount + 1;
      });
    };
    
    
    const socket = socketRef.current;
    if (socket) {
      socket.on('messageSent', handleMessageReceived);
      
    }
    

    return () => {
      if (socket) {
        socket.off('messageSent', handleMessageReceived);
        // socket.disconnect();
      }
    };
  }, [socketRef,setMessageCount]);

  
  const HandleLogout = () => {
    if (socketRef.current) {
      // Emit an event to inform server about logout
      socketRef.current.emit("logout", {
        Username: Username,
        RoomId: RoomId,
      });

      // Disconnect socket
      socketRef.current.disconnect();

      // Update UI (remove current client immediately)
      setClient((prevClients) =>
        prevClients.filter((client) => client.Username !== Username)
      );

      toast.success("You have logged out!");
    }
    navigate("/");
  };

  const HandleCopy = () => {
    navigator.clipboard.writeText(RoomId).then(() => {
      toast.success("Copied Successfully !!");
    }).catch(err => {
      toast.error("Failed to copy");
    });
  };

  return (
    <aside className="h-screen ">
      <nav className={`h-full flex flex-col bg-green-200 border-r shadow-lg ${expanded ? "md:w-60" : "md:w-20"}`}>
        <div className="p-4 flex justify-between items-center">
          {expanded ? <h1 className="w-32 poppins-bold text-xl"><img src={logo} className="w-40 h-14" alt="" /></h1> : ""}
          <button className="p-1.5 rounded-full m-2 bg-blue-300 hover:bg-blue-400"
            onClick={() => setExpanded((curr) => !curr)}
          >
            <TbMathGreater size={20} />
          </button>
        </div>

        <Link to="Chat">
          <div className="border-t flex px-2 p-1 mt-2 hover:bg-white">
            <IoChatbubbleEllipsesSharp size={30} className=" m-2" />
            <sup className="bg-green-700 text-center text-white w-5 h-5 flex items-center justify-center rounded-full poppins-bold">{messageCount}</sup>
            {expanded ? <h1 className=" m-2 poppins-bold">Chats</h1> : ""}
          </div>
        </Link>

        <div className="border-t flex px-1 p-2 hover:bg-white">
          <FaUsers size={30} className=" m-2" />
          <sup className="rounded-full bg-green-700 text-center text-white w-5 h-5 flex items-center justify-center poppins-bold">{ClientCnt}</sup>
          {expanded ? <h1 className=" m-2 poppins-bold">Colaborators</h1> : ""}
        </div>

        <div className="h-80">
          <div className="grid grid-cols-3">
            {expanded ? Clients.map((client) => {
              return <Client key={client.socketId} Username={client.Username} />;
            }) : null}
          </div>
        </div>

        <div className="border-t flex px-2 p-1 hover:bg-white">
          <FaCopy size={30} className=" m-2 hover:bg-white" value={RoomId} onClick={HandleCopy} />
          {expanded ? <button className=" m-2 poppins-bold" value={RoomId} onClick={HandleCopy}>
            Copy Link
          </button> : ""}
        </div>

        <div className="border-t flex px-2 p-1 hover:bg-white">
          <Link to="/">
            <GrLogout size={30} className=" m-2" onClick={HandleLogout} />
          </Link>
          {expanded ? <Link to="/"><button className=" m-2 poppins-bold" onClick={HandleLogout}>Log Out</button></Link> : ""}
        </div>
      </nav>
    </aside>
  );
};