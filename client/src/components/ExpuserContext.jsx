import  { createContext, useState } from 'react';

const ExpuserContext = createContext();

export const ExpuserProvider = ({ children }) => {
    const [user, setUser] = useState('');

    return (
        <ExpuserContext.Provider value={{ user, setUser }}>
            {children}
        </ExpuserContext.Provider>
    );
};

export default ExpuserContext;
