import React, { createContext, useRef } from 'react';

const CodeRefContext = createContext();

export const CodeRefProvider = ({ children }) => {
    const codeRef = useRef('');
    return (
        <CodeRefContext.Provider value={{ codeRef }}>
            {children}
        </CodeRefContext.Provider>
    );
};

export default CodeRefContext;
