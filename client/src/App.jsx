import MainPage from "./MainPage"
import { OutputProvider } from "./components/OutputContext"
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ProcessingProvider } from "./components/ProcessingContext"
import { Chatbtn } from "./components/Chatbtn"
import { Login } from "./components/Login"
import { ExpuserProvider } from "./components/ExpuserContext"
import { SetUsernameProvider } from './components/SetUsernameContext';
import {Toaster} from 'react-hot-toast'
import { ChatOpenProvider } from "./components/ChatOpenContext"
import { NotificationProvider } from "./components/NotificationContext"
import { SocketProvider } from "./components/Socketcontext"
import {CodeRefProvider}  from "./components/CodeRefContext"
// Remove this line
// import { io } from 'socket.io-client';

function App() {
  
  return (
    <>

    <Toaster position="top-center"></Toaster>

    
       <BrowserRouter>
       <SocketProvider>
        <SetUsernameProvider>
          <ExpuserProvider>
       <CodeRefProvider>
        <NotificationProvider>
          <ChatOpenProvider>
      <OutputProvider>
        <ProcessingProvider>
        <div>
          
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="compiler/:RoomId" element={<MainPage />}/>
            <Route path="compiler/:RoomId/Chat" element={<Chatbtn/>}/>
           
          </Routes>
        </div>
        </ProcessingProvider>
      </OutputProvider>
      </ChatOpenProvider>
      </NotificationProvider>
      </CodeRefProvider>
      </ExpuserProvider>
      </SetUsernameProvider>
      </SocketProvider>
    </BrowserRouter>
    
   
    </>
  )
}

export default App
