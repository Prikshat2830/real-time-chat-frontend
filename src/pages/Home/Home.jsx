import styles from "./Home.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import ChatWindow from "../../components/ChatWindow/ChatWindow.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Home() {
    const { user } = useContext(AuthContext)
    const [chat, setChat] = useState(null)

    console.log("User:", user)

    // if (!user) return <h2>Login First</h2>

    return (
        <div className={styles.container}>
            <Sidebar setChat={setChat} />
            <ChatWindow chat={chat} />
        </div>
    )
}