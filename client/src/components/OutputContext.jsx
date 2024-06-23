import { useState , createContext } from "react";

const OutputContext =createContext();

export const OutputProvider = ({ children }) => {
    let [Output ,setOutput] = useState()
  

    return (
        <>

        <OutputContext.Provider value={{Output ,setOutput}}>
        {children}
        </OutputContext.Provider>
        </>
    )
}


export default OutputContext;