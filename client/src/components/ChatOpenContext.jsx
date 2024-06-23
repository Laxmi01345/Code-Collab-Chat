import { useState , createContext } from "react";

const ChatOpenContext =createContext();

export const ChatOpenProvider = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
  

    return (     
        <>

        <ChatOpenContext.Provider value={{isChatOpen, setIsChatOpen}}>
        {children}
        </ChatOpenContext.Provider>
        </>
    )
}


export default ChatOpenContext;