import {createServer} from "node:http";
import next from "next";
import {IPlayerInfoOfMatch} from "./src/shared/interfaces";
import {initializeDatabase} from "./src/Database/database";
import {initializeSocket} from "./src/libs/socket.io/socketServer";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({dev, hostname, port});
const readyToStartRooms: Map<string, IPlayerInfoOfMatch[]> = new Map();
const handler = app.getRequestHandler();

app.prepare()
    .then(async () => {
        try {
            const db = await initializeDatabase();
            const httpServer = createServer(handler);

            initializeSocket(httpServer, db, readyToStartRooms);

            httpServer.once("error", (err) => {
                console.error("Server error:", err);
                process.exit(1);
            });

            httpServer.listen(port, () => {
                console.log(`> Ready on http://${hostname}:${port}`);
            });
        } catch (error) {
            console.error("Database connection error:", error);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error("Next.js preparation error:", err);
        process.exit(1);
    });
