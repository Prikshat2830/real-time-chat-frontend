import styles from "./ChatWindow.module.css"
import { useEffect, useState, useContext, useRef } from "react"
import { fetchMessages } from "../../services/Api.js"
import { socket } from "../../socket/socket.js"
import MessageInput from "../MessageInput/MessageInput.jsx"
import MessageBubble from "../MessageBubble/MessageBubble.jsx"
import { AuthContext } from "../../context/AuthContext.jsx"

export default function ChatWindow({ chat }) {
    const [ messages, setMessages ] = useState([])
    const { user } = useContext(AuthContext)
    const endRef = useRef()
    
    useEffect(() => {
    if (!user) return;

    socket.emit("setup", user);

    socket.on("connected", () => {
        console.log("socket connected to backend");
    });

    return () => socket.off("connected");
    }, [user]);

    useEffect(() => {
        if (!chat || !user) return

        fetchMessages(chat._id, user.token).then(setMessages)
        socket.emit("join chat", chat._id)
    }, [chat, user])

    useEffect(() => {
        setMessages([])
    }, [chat])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
    if (!chat) return;

    const messageHandler = (msg) => {
        console.log("message recieved:", msg)
        if (msg.chat._id !== chat._id) return;

        setMessages((prev) => {
            if (prev.find(m => m._id === msg._id)) return prev;
            return [...prev, msg];
        });
    };

    socket.on("message recieved", messageHandler);

    return () => {
        socket.off("message recieved", messageHandler);
    };
    }, [chat]);

    if (!chat) return <div className={styles.empty}>Select a Chat</div>

    return (
        <div className={styles.chat}>
            <div className={styles.header}>{chat.chatName || "Chat"}</div>

            <div className={styles.messages}>
                {messages.map((m) => (
                    <MessageBubble key={m._id} message={m} />
                ))}

                <div ref={endRef}></div>
            </div>

            <MessageInput chat={chat} setMessages={setMessages} />
        </div>
    )
}