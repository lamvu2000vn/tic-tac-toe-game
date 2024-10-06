import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";
import sqlite3 from "sqlite3";
import {Database, open} from "sqlite";
import SocketHandle from "./src/libs/socket.io/SocketHandler";
import {IPlayerInfoOfMatch} from "@/shared/interfaces";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({dev, hostname, port});
const handler = app.getRequestHandler();

const readyToStartRooms: Map<string, IPlayerInfoOfMatch[]> = new Map();

app.prepare().then(async () => {
    const db = await open({
        filename: "TicTacToe.db",
        driver: sqlite3.Database,
    });

    await dbPrepare(db);

    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("a user connected");

        new SocketHandle(io, socket, db, readyToStartRooms);
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});

async function dbPrepare(db: Database) {
    return db.exec(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(20) NOT NULL,
            socket_id VARCHAR(20) DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS matches (
            id VARCHAR(20) PRIMARY KEY,
            player_1_id INT NOT NULL,
            player_2_id INT NOT NULL,
            player_1_score TINYINT DEFAULT 0,
            player_2_score TINYINT DEFAULT 0,
            match_status VARCHAR(10) NOT NULL,
            winner_id INT DEFAULT NULL,
            FOREIGN KEY (player_1_id) REFERENCES players (id),
            FOREIGN KEY (player_2_id) REFERENCES players (id)
            FOREIGN KEY (winner_id) REFERENCES players (id)
        );

        CREATE TABLE IF NOT EXISTS moves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id VARCHAR(20) NOT NULL,
            player_id INT NOT NULL,
            x TINYINT NOT NULL,
            y TINYINT NOT NULL,
            FOREIGN KEY (match_id) REFERENCES matches (id),
            FOREIGN KEY (player_id) REFERENCES players (id)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_socket_id on players (socket_id);
        CREATE INDEX IF NOT EXISTS idx_playerMoves on moves (match_id, player_id);
    `);
}
