import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Socket conectado, id:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Error conexión socket:", err);
});

export default socket;
