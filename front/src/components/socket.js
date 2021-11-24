import { io } from "socket.io-client";

// console.log("Desde socket.js", localStorage.token)
let socket = io('//localhost:9000',{
    auth: {
      token: localStorage.token,
      user: localStorage.user,
      id: localStorage.id,
      isInRoom: localStorage.isInRoom,
      roomId: localStorage.roomId,
    }
});

export default socket;