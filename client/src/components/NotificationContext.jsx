import { useState , createContext } from "react";

const NotificationContext =createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState([]);
    const [notificationCnt,setNotificationCnt] = useState(0);
  

    return (     
        <>

        <NotificationContext.Provider value={{notification, setNotification,notificationCnt,setNotificationCnt}}>
        {children}
        </NotificationContext.Provider>
        </>
    )
}


export default NotificationContext;