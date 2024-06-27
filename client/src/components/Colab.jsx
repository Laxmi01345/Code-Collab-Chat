import { io } from "socket.io-client";
import toast from "react-hot-toast";

const Colab = async (navigate,socketRef) => {
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
    // eslint-disable-next-line no-undef
    const socket = io(process.env.REACT_APP_SOCKET_URL, options);

    // Return a promise that resolves when the socket connects
    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
        resolve(socket); // Resolve the promise with the socket instance
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        navigate("/")
        toast.error("Socket connection failed");

        reject(error); // Reject the promise if there's a connection error
      });

      socket.on('connect_failed', () => {
        console.error('Connection failed');
        toast.error("Socket connection failed");
        reject(new Error('Connection failed')); // Reject the promise on connection failure
      });
    });

  } catch (error) {
    console.error('Failed to initialize socket:', error);
    throw error; // Propagate the error for handling in the MainPage component
  }
};

export default Colab;
