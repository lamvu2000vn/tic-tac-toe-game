import {Database} from "sqlite";
import SocketHandle from "./SocketHandler";
import {Server} from "http";
import {Server as SocketServer} from "socket.io";
import {IPlayerInfoOfMatch} from "@/shared/interfaces";

export const initializeSocket = (
    httpServer: Server,
    db: Database,
    readyToStartRooms: Map<string, IPlayerInfoOfMatch[]>
) => {
    const io = new SocketServer(httpServer);

    io.on("connection", (socket) => {
        console.log("a user connected");
        new SocketHandle(io, socket, db, readyToStartRooms);
    });
};
