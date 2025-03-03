import { io } from "socket.io-client";
const url = import.meta.env.VITE_CHAT_URL
// 建立socket连接
class Socket {
    constructor() {
        this.server = null;
    }
    connectSocekt() {
        this.server = io(url, { transports: ["websocket"] });
    }
}

export default new Socket()