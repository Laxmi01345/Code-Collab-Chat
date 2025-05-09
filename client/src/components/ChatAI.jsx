import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaRobot } from "react-icons/fa";

const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { text: input, isUser: true }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.response) {
                setMessages(prev => [...prev, { text: data.response, isUser: false }]);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                text: "Sorry, I encountered an error. Please try again.", 
                isUser: false 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
                >
                    <FaRobot size={24} />
                    <span>Chat AI</span>
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b bg-blue-500 text-white rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <FaRobot size={20} />
                            <h3 className="font-semibold">Chat with AI</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-blue-600 rounded-full p-1"
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${
                                    msg.isUser 
                                        ? 'ml-auto bg-blue-500 text-white' 
                                        : 'mr-auto bg-gray-200'
                                } rounded-lg p-3 max-w-[80%] break-words`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mr-auto bg-gray-200 rounded-lg p-3">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask anything..."
                                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className={`${
                                    isLoading 
                                        ? 'bg-gray-400' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } text-white rounded-lg px-4 py-2 transition-colors`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAI;