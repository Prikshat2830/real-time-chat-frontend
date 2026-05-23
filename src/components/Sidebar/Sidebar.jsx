import styles from "./Sidebar.module.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { fetchChats, createChatAPI, fetchUsers } from "../../services/Api.js";

export default function Sidebar({ setChat }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [initialized, setInitialized] = useState(false)
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [isGroupMode, setIsGroupMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    console.log(users)
    console.log(groupName)
    console.log(isGroupMode)
    console.log(chats)

    useEffect(() => {
    if (!user?.token || initialized) return;

    const loadData = async () => {
        const chatsData = await fetchChats(user.token);
        const usersData = await fetchUsers(user.token);

        console.log("chats from backend", chatsData);

        const uniqueChats = chatsData.filter(
        (chat, index, self) =>
        index === self.findIndex(c => c._id === chat._id)
        );

        setChats(uniqueChats);
        setUsers(usersData);

        setInitialized(true);
    };

    loadData();
    }, [user, initialized]);

    const handleCreateChat = async (userId) => {
    const chat = await createChatAPI({ userId }, user.token);
    setChat(chat);
};

    const handleUserSelect = (u) => {
        setSelectedUsers((prev) => {
            const exists = prev.find(x => x._id === u._id);
            if (exists) {
                return prev.filter(x => x._id !== u._id);
            }
            return [...prev, u];
        });
    };

    const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
        alert("Enter name and select users");
        return;
    }

    const newChat = await createChatAPI(
        {
            name: groupName,
            users: JSON.stringify(selectedUsers.map(u => u._id))
        },
        user.token
    );

    if (!newChat || newChat.message) {
        console.error("Group creation failed:", newChat);
        return;
    }

    const data = await fetchChats(user.token)
    setChats(data);

    setIsGroupMode(false);
    setSelectedUsers([]);
    setGroupName("");
};

    const handleLogout = () => {
        logout()
        setTimeout(() => navigate("/login"), 0)
    }

    const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;

    const otherUser = chat.users.find(u => u._id !== user?._id);
    return otherUser?.name;
};

    return (
        <div className={styles.sidebar}>
            
            <div className={styles.header}>
                <h2>Chats</h2>
            </div>

            <div className={styles.newGroup}>
                <button className={styles.logout} onClick={handleLogout}>Logout</button>
                <button className={styles.groupbtn} onClick={() => setIsGroupMode(!isGroupMode)}>
                    {isGroupMode ? "Cancel" : "+ New Group"}
                </button>
            </div>

            {isGroupMode && (
                <div className={styles.groupBox}>
                    <input
                        className={styles.groupname}
                        type="text"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    <div className={styles.users}>
                        {users
                            .filter(u => u._id !== user?._id)
                            .map(u => (
                                <div
                                    key={u._id}
                                    className={
                                        selectedUsers.find(s => s._id === u._id)
                                            ? styles.selectedUser
                                            : styles.userItem
                                    }
                                    onClick={() => handleUserSelect(u)}
                                >
                                    {u.name}
                                </div>
                            ))}
                    </div>

                    <button className={styles.groupbtn} onClick={handleCreateGroup}>
                        Create Group
                    </button>
                </div>
            )}

            <div className={styles.chatList}>
            <h4>Group List</h4>
                {chats.map(chat => (
                    <div
                        key={chat._id}
                        className={styles.chatItem}
                        onClick={() => setChat(chat)}
                    >
                        <div className={styles.chatAvatar}>
                {getChatName(chat)?.charAt(0).toUpperCase()}
            </div>

            <div className={styles.chatInfo}>

                <div className={styles.chatTop}>
                    <h4>{getChatName(chat)}</h4>
                </div>

                {chat.isGroupChat ? (
                    <div className={styles.chatMembers}>

                        {chat.users
                            ?.filter(u => u._id !== user?._id)
                            .slice(0, 3)
                            .map(u => u.name)
                            .join(", ")}

                        {chat.users?.length > 4 &&
                            ` +${chat.users.length - 4}`}

                    </div>
                ) : (
                    <div className={styles.chatMembers}>
                        Tap to chat
                    </div>
                )}

                </div>
                </div>
                ))}
            </div>

            {!isGroupMode && (
                <div className={styles.users}>
                    <h4>Chat List</h4>
                    {users
                        .filter(u => u._id !== user?._id)
                        .map(u => (
                            <div
                                key={u._id}
                                className={styles.chatItem}
                                onClick={() => handleCreateChat(u._id)}
                            >
                                <div className={styles.chatAvatar}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>

                            <div className={styles.chatInfo}>

                                <div className={styles.chatTop}>
                                    <h4>{u.name}</h4>
                                </div>

                            </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

