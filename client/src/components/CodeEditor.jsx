import './CodeEditor.css';
/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react';
import { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom"
import SocketContext from './Socketcontext';
import CodeRefContext from './CodeRefContext';
import ChatAI from './ChatAI';

const CodeEditor = ({ code, setCode, language, editorRef }) => {
    const { codeRef } = useContext(CodeRefContext)
    const { socketRef } = useContext(SocketContext);
    const { RoomId } = useParams();

    // Add cursor decorations state
    const [cursorDecorations, setCursorDecorations] = useState({});
    const [isEditorView, setIsEditorView] = useState(false);

    useEffect(() => {
        // Only enable cursor functionality if we're in the editor view
        if (language && RoomId) {
            setIsEditorView(true);
        }
    }, [language, RoomId]);

    useEffect(() => {
        if (editorRef.current && socketRef.current && isEditorView) {
            // Existing code change handler
            socketRef.current.emit("code-change", { RoomId, code });

            // Add cursor position change handler
            const handleCursorChange = () => {
                const position = editorRef.current.getPosition();
                socketRef.current.emit("cursor-move", {
                    RoomId,
                    position: {
                        lineNumber: position.lineNumber,
                        column: position.column
                    }
                });
            };

            // Only add cursor listeners if we're in editor view
            if (isEditorView) {
                editorRef.current.onDidChangeCursorPosition(handleCursorChange);

                socketRef.current.on("cursor-move", ({ userId, position, username }) => {
                    if (!editorRef.current) return;

                    if (cursorDecorations[userId]) {
                        editorRef.current.deltaDecorations(cursorDecorations[userId], []);
                    }

                    const newDecorations = editorRef.current.deltaDecorations([], [{
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column + 1
                        },
                        options: {
                            className: `cursor-${userId}`,
                            hoverMessage: { value: username },
                            beforeContentClassName: `cursor-${userId}-before`
                        }
                    }]);

                    setCursorDecorations(prev => ({
                        ...prev,
                        [userId]: newDecorations
                    }));
                });
            }

            // Existing code change listener
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

        return () => {
            if (socketRef.current) {
                socketRef.current.off("code-change");
                if (isEditorView) {
                    socketRef.current.off("cursor-move");
                }
            }
        };

    }, [code, RoomId, editorRef, socketRef, isEditorView]);

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
                            codeRef.current = newValue;
                        }}
                        onMount={(editor) => {
                            editorRef.current = editor;
                        }}
                    />
                </div>
                <ChatAI />
            </div>
        </>
    )
}

export default CodeEditor;
