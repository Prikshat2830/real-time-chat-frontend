import styles from "./MessageInput.module.css"
import { useState, useContext } from "react"
import { sendMessageAPI } from "../../services/Api.js"
import { socket } from "../../socket/socket.js"
import { AuthContext } from "../../context/AuthContext.jsx"

export default function MessageInput({ chat, setMessages }) {
    const [text, setText] = useState("")
    const { user } = useContext(AuthContext)

    
    const handleSend = async () => {
        if (!text.trim()) return
        const message = await sendMessageAPI(
        {
            content: text,
            chatId: chat._id
        },
        user.token
    );

    console.log("sending message:", message)
    socket.emit("new message", message); 
    setMessages(prev => [...prev, message]);
    
    setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend()
        }
    };

return (
        <div className={styles.box}>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    )
}