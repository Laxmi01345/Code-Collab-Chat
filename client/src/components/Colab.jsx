import { io } from "socket.io-client";
import toast from "react-hot-toast";

const Colab = async (navigate, socketRef) => {
  console.log("Colab function called");

  if (socketRef.current) {
    return Promise.resolve(socketRef.current);
  }

  const options = {
    'force new connection': false,
    'reconnectionAttempts': 'infinity',
    timeout: 10000,
    transports: ['websocket']
  };

  try {
    const socket = io(import.meta.env.VITE_SOCKET_URL, options);

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
        resolve(socket);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        navigate("/")
        toast.error("Socket connection failed");
        reject(error);
      });

      socket.on('connect_failed', () => {
        console.error('Connection failed');
        toast.error("Socket connection failed");
        reject(new Error('Connection failed'));
      });
    });

  } catch (error) {
    console.error('Failed to initialize socket:', error);
    throw error;
  }
};

export default Colab;
