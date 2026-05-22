import { AuthContext } from "../../context/AuthContext.jsx";
import styles from "./MessageBubble.module.css"
import { useContext } from "react"

export default function MessageBubble({ message }) {
    const { user } = useContext(AuthContext)

    const isMe = message.sender?._id === user?._id

    return (
        <div className={isMe ? styles.meWrapper : styles.otherWrapper}>
            <div className={isMe ? styles.me : styles.other}>
                {message.content}
            </div>
        </div>
    )
}