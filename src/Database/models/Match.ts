import {IModel, IMatchTableFields} from "@/shared/interfaces";
import {MatchStatus} from "@/shared/types";
import {Database, ISqlite} from "sqlite";
import {Statement} from "sqlite3";

interface FullMatchInfoResults {
    match_id: string;
    player_1_id: number;
    player_1_name: string;
    player_1_socket_id: string;
    player_1_score: number;
    player_2_id: number;
    player_2_name: string;
    player_2_socket_id: string;
    player_2_score: number;
    match_status: string;
    winner_id: number | null;
}

class Room implements IModel<IMatchTableFields> {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    findById = async (id: string): Promise<IMatchTableFields | null> => {
        try {
            const result = await this.db.get("SELECT * FROM matches WHERE id = ? LIMIT  1", [id]);
            return result || null;
        } catch {
            return null;
        }
    };

    insert = async (data: IMatchTableFields): Promise<ISqlite.RunResult<Statement>> => {
        return this.db.run(
            "INSERT INTO matches (id, player_1_id, player_2_id, player_1_score, player_2_score, match_status, winner_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                data.id,
                data.player_1_id,
                data.player_2_id,
                data.player_1_score,
                data.player_2_score,
                data.match_status,
                data.winner_id,
            ]
        );
    };

    update = async (
        matchId: string,
        data: {
            player_1_id?: number;
            player_2_id?: number;
            player_1_score?: number;
            player_2_score?: number;
            match_status?: MatchStatus;
            winner_id?: number | null;
        }
    ): Promise<ISqlite.RunResult<Statement>> => {
        const fields = Object.entries(data)
            .filter(([key, value]) => value !== undefined) // Loại bỏ các giá trị `undefined`
            .map(([key]) => `${key} = ?`); // Sử dụng placeholders thay cho giá trị trực tiếp

        const values = Object.values(data).filter((value) => value !== undefined); // Lấy các giá trị tương ứng

        const query = `UPDATE matches SET ${fields.join(", ")} WHERE id = ?`;

        return await this.db.run(query, [...values, matchId]); // Truyền mảng giá trị cùng với matchId
    };

    delete = async (id: string): Promise<ISqlite.RunResult<Statement>> => {
        return this.db.run("DELETE FROM matches WHERE id = ?", [id]);
    };

    getFullMatchInfo = async (matchId: string): Promise<FullMatchInfoResults | null> => {
        try {
            const results = this.db.get(
                `
                SELECT
                    match.id AS match_id,
                    player_1.id AS player_1_id,
                    player_1.name AS player_1_name,
                    player_1.socket_id AS player_1_socket_id,
                    player_2.id AS player_2_id,
                    player_2.name AS player_2_name,
                    player_2.socket_id AS player_2_socket_id,
                    match.player_1_score,
                    match.player_2_score,
                    match.match_status,
                    match.winner_id
                FROM matches match
                JOIN players player_1 ON match.player_1_id = player_1.id
                JOIN players player_2 ON match.player_2_id = player_2.id
                WHERE match.id = ?
                LIMIT 1
            `,
                [matchId]
            );

            return results || null;
        } catch (err) {
            return null;
        }
    };

    getTheMatchThePlayerIsPlaying = async (playerId: number): Promise<IMatchTableFields | undefined> => {
        return this.db.get(
            "SELECT * FROM matches WHERE (player_1_id = ? OR player_2_id = ?) AND match_status = ? LIMIT 1",
            [playerId, playerId, "in-progress"]
        );
    };
}

export default Room;
