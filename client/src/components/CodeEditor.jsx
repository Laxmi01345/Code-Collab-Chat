/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react';
import { useEffect } from 'react';
import {useParams} from "react-router-dom"
import SocketContext from './Socketcontext';
import { useContext } from 'react';
import CodeRefContext from './CodeRefContext';

const CodeEditor = ({ code, setCode, language, editorRef }) => {
   const {codeRef} =useContext(CodeRefContext)
    const { socketRef } = useContext(SocketContext);
    const {RoomId} = useParams();

    useEffect(() => {
        if (editorRef.current && socketRef.current) {
            // Emit code change to the socket
            socketRef.current.emit("code-change", { RoomId, code });
            console.log("Emitted:", code);

            
            // Listen for code change events from the socket
            
            socketRef.current.on("code-change", ({ code: newCode }) => {
                console.log("Received new code:", newCode);
                console.log("Current code:", code);
               
                if (newCode !== code) {
                    codeRef.current=newCode;
                    console.log("Updating editor with new code:", newCode);
                    editorRef.current.setValue(newCode);
                    
                } else {
                    console.log("New code is the same as the current code. Not updating editor.");
                }


                    
                
            });

            
        }
        return ()=>{
            if (socketRef.current) {
                socketRef.current.off("code-change");
              }
            };

    }, [code, RoomId, editorRef, socketRef]);

    return (
        <>
            <div className="flex">

                <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl flex">
                    <Editor
                        height="86vh"

                        language={language.toLowerCase()}
                        theme='vs-dark'
                        value={code}
                        onChange={(newValue) => {
                            setCode(newValue);
                            codeRef.current = newValue; // Update codeRef on change
                        }}                        onMount={(editor) => {
                            editorRef.current = editor;
                        }}
                    />

                </div>

                <div className="">

                </div>
            </div>

        </>
    )
}

export default CodeEditor
