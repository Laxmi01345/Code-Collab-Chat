// SocketContext.js
import  { createContext, useRef } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    
    return (
        <SocketContext.Provider value={{socketRef}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
