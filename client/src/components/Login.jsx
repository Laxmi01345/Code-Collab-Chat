
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png'
import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [RoomId ,setRoomId] = useState("");
  const [Username ,setUsername] = useState("")
  const navigate = useNavigate();
  const HandleRoom=(e)=>{

    e.preventDefault();
    const id =uuid();
    setRoomId(id);
    toast.success("New Room Id Generated !!")
    }

    const HandleJoin=()=>{
      if (!RoomId || !Username){
        toast.error("Both the feilds are required ")
        return;
      }
      navigate(`/compiler/${RoomId}`, {
        state: {
          Username,
        },
      });
      toast.success("Room is Created ")
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <div className="w-96 border-2 border-gray-300 bg-white rounded-lg shadow-lg p-6 ">
      <div className="flex items-center justify-center">
  <img src={logo} className="p-4 w-64" alt="" />
</div>
        <div className="w-full">
          <label className="block text-gray-700 font-bold mb-2">Enter Room Id :</label>
          <input type="text" value={RoomId} className="w-full p-2 mb-4 border rounded border-gray-300 focus:outline-none focus:border-blue-500" onChange={(e)=>setRoomId(e.target.value)} />
          
          <label className="block text-gray-700 font-bold mb-2">Username :</label>
          <input type="text" className="w-full p-2 mb-4 border rounded border-gray-300 focus:outline-none focus:border-blue-500" value={Username} onChange={(e)=>{setUsername(e.target.value)}}/>
          
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={HandleJoin}>Join</button>
          
          <span className="block text-gray-500 text-center text-sm mt-4">Don&apos;t have Room Id?<span className="text-blue-500 no-underline cursor-pointer" onClick={HandleRoom} > Create New Room </span></span>
        </div>
      </div>
    </div>
  );
}
