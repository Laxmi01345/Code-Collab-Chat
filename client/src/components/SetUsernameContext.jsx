// SocketContext.js

import  { createContext, useState, useContext } from 'react';

const SetUsernameContext = createContext();

export const SetUsernameProvider = ({ children }) => {
  const [Username, setUsername] = useState(''); 

  return (
    <SetUsernameContext.Provider value={{ Username, setUsername }}>
      {children}
    </SetUsernameContext.Provider>
  );
};

export const useSetUsernameContext = () => useContext(SetUsernameContext);
            