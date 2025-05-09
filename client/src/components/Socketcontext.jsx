import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD 
    ? 'https://collaborative-code-editor-0ka2.onrender.com' 
    : 'http://localhost:3000';

const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};

export default SocketContext;
