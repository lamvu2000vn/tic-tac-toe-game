import {IModel, IMoveTableFields} from "@/shared/interfaces";
import {Position} from "@/shared/types";
import {Database, ISqlite} from "sqlite";
import {Statement} from "sqlite3";

class Move implements IModel<IMoveTableFields> {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async findById(id: string | number): Promise<IMoveTableFields | null> {
        try {
            const result = await this.db.get("SELECT * FROM moves WHERE id = ? LIMIT 1", [id]);

            return result || null;
        } catch (err) {
            return null;
        }
    }

    async getPlayerMoves(matchId: string, playerId: number): Promise<Position[] | null> {
        try {
            const result = await this.db.all("SELECT x, y FROM moves WHERE match_id = ? AND player_id = ?", [
                matchId,
                playerId,
            ]);

            return result || null;
        } catch (err) {
            return null;
        }
    }

    async insert({
        matchId,
        playerId,
        x,
        y,
    }: {
        matchId: string;
        playerId: number;
        x: number;
        y: number;
    }): Promise<ISqlite.RunResult<Statement>> {
        const query = "INSERT INTO moves (match_id, player_id, x, y) VALUES (?, ?, ?, ?)";
        const values = [matchId, playerId, x, y];

        return await this.db.run(query, values);
    }

    async deleteByMatchId(matchId: string): Promise<ISqlite.RunResult<Statement>> {
        return this.db.run("DELETE FROM moves WHERE match_id = ?", [matchId]);
    }
}

export default Move;
