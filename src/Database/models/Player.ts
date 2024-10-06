import {IModel, IPlayerTableFields} from "@/shared/interfaces";
import {Database, ISqlite} from "sqlite";
import {Statement} from "sqlite3";

class Player implements IModel<IPlayerTableFields> {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async findById(id: string | number): Promise<IPlayerTableFields | null> {
        try {
            const result = await this.db.get("SELECT * FROM players WHERE id = ? LIMIT 1", [id]);

            return result || null;
        } catch (err) {
            return null;
        }
    }

    async findBySocketId(socketId: string): Promise<IPlayerTableFields | null> {
        try {
            const result = await this.db.get("SELECT * FROM players WHERE socket_id = ? LIMIT 1", [socketId]);

            return result || null;
        } catch (err) {
            return null;
        }
    }

    async insert(data: {name: string; socket_id: string}): Promise<ISqlite.RunResult<Statement>> {
        return this.db.run("INSERT INTO players (name, socket_id) VALUES (?, ?)", [data.name, data.socket_id]);
    }

    async setSocketId(id: number, socketId: string | null): Promise<ISqlite.RunResult<Statement>> {
        return this.db.run("UPDATE players SET socket_id = ? WHERE id = ?", [socketId, id]);
    }
}

export default Player;
