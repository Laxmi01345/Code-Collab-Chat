// ProcessingContext.js
import { createContext, useState, useContext } from "react";

const ProcessingContext = createContext();

export const ProcessingProvider = ({ children }) => {
    const [processing, setProcessing] = useState(false);

    return (
        <ProcessingContext.Provider value={{ processing, setProcessing }}>
            {children}
        </ProcessingContext.Provider>
    );
};

export const useProcessing = () => {
    return useContext(ProcessingContext);
};

export default ProcessingContext;
