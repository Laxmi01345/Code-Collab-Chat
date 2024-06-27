import LangDropdown from "./components/LangDropdown"
import CodeEditor from "./components/CodeEditor"
// import ThemeDropdown from "./components/ThemeDropdown"
import { Input } from "./components/Input"
import { Output } from "./components/Output"
import { SideBar } from "./components/SideBar"
import toast from "react-hot-toast"
import { Run } from "./components/Run"
import {useSetUsernameContext} from './components/SetUsernameContext'
import { useState, useEffect, useRef } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import Colab from "./components/Colab"
import { Code_Snippets } from "./constants/Code_Snippets"
import CodeRefContext from "./components/CodeRefContext"
import { useContext } from "react"
import { useLocation, useParams } from "react-router-dom"
import SocketContext from "./components/Socketcontext"
// import {defineTheme , Themes} from './constants/Themes'
const MainPage = () => {
  const {  setUsername } = useSetUsernameContext();   
  const { socketRef } = useContext(SocketContext);
  const [code, setCode] = useState(Code_Snippets["JavaScript"]);
  const [language, setLanguage] = useState("JavaScript");
  const [CustomInput, setCustomInput] = useState('');
  const [Clients, setClient] = useState([])
  const navigate = useNavigate();
  
  const {codeRef} = useContext(CodeRefContext)
  
  const editorRef = useRef();

  const location = useLocation();
  useEffect(() => {
    const { Username } = location.state || {};
    setUsername(Username); // Set Username from location.state
  }, [location.state, setUsername]);
  const { RoomId } = useParams();

  
  useEffect(() => {
    const init = async () => {

      const socket = await Colab(navigate,socketRef); 
      console.log("socket :",socket)
      socketRef.current = socket; 
      console.log("Initialized socket:", socketRef.current);


      socketRef.current.emit('join', {
        RoomId,
        Username: location.state?.Username,
        senderSocketId:socket.id

      });
   

      socketRef.current.on("joined", ({ clients, Username, socketId }) => {
        console.log("Clients in room:", clients);
        if (Username !== location.state?.Username) {
          toast.success(`${Username} have Joined`);

        }

        setClient(clients);
        socketRef.current.emit("sync-code", {
          socketId,
          code: codeRef.current 

        })
      });
     
      socketRef.current.on("code-change", ({ code: newCode }) => {
        if (newCode !== code) {
            setCode(newCode);
            codeRef.current = newCode;
            if (editorRef.current) {
                editorRef.current.setValue(newCode);
            }
        }
    });
      socketRef.current.on("disconnected", ({ socketId, Username }) => {
        toast.success(`${Username} leave`);
          console.log(socketId)
          setClient((prev) => prev.filter((client) => client.socketId !== socketId
        ));
      });
      
    };
    init();

    return () => {
      // socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("code-change");
      socketRef.current.off("disconnected");
    }
  }, [])

  if (!location.state) {
    return <Navigate to="/" />
  }

  // const [theme ,setTheme] =useState("cobalt");

  const onSelectChange = (language) => {

    setLanguage(language);

    setCode(
      Code_Snippets[language]
    )
  };



  return (
    <>
      <div className="flex h-screen ">
        <div className=" border-r-2">
          <SideBar setClient={setClient} Clients={Clients} />
        </div>
        <div className=" flex-1 flex-col">
          <div className="md:border-b-2 flex justify-between md:h-20 bg-gray-200 md:p-1 ">
            <LangDropdown language={language} onSelectChange={onSelectChange} />
            <Run
              code={code}
              language={language}
              CustomInput={CustomInput}
            />
          </div>
          <div className="m-2 md:flex-1 md:flex">
            <div className="md:w-2/3 md:mr-2 w-96">
              <CodeEditor code={code} setCode={setCode} language={language} editorRef={editorRef} socketRef={socketRef} />
            </div>
            <div className="w-1/3">
              <Input setCustomInput={setCustomInput} />
              <Output editorRef={editorRef} language={language} />
            </div>

          </div>
        </div>
      </div>
    </>

  )
}

export default MainPage
