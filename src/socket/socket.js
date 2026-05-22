import { io } from "socket.io-client"

export const socket = io("http://localhost:5000", {
    withCredentials: true
})
console.log("socket connected?", socket.connected)


socket.on("connect", () => {
    console.log("connected:", socket.id);
});

console.log("socket connected?", socket.connected)