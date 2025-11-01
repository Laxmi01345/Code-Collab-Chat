import React, { createContext, useRef, useContext } from 'react';

// Provide a socketRef object so consumers can use `socketRef.current`.
// The actual socket connection is created elsewhere (e.g. in MainPage via Colab)
// and assigned to `socketRef.current`. This matches the rest of the codebase
// which expects `const { socketRef } = useContext(SocketContext)`.

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    return (
        <SocketContext.Provider value={{ socketRef }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return ctx;
};

export default SocketContext;
