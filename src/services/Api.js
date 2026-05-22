const BASE = import.meta.env.VITE_API_URL;
export const loginAPI = async (data) => {
    const res = await fetch(`${BASE}/users/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    return res.json();
};

export const registerAPI = async (data) => {
    const res = await fetch(`${BASE}/users/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    return res.json();
};

export const createChatAPI = async (userId, token) => {
    const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId }),
    });

    return res.json();
};

export const fetchChats = async (token) => {
    const res = await fetch(`${BASE}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const fetchUsers = async (token) => {
    const res = await fetch(`${BASE}/users`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
};

export const fetchMessages = async (chatId, token) => {
    const res = await fetch(`${BASE}/message/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const sendMessageAPI = async (data, token) => {
    const res = await fetch(`${BASE}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};