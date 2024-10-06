export type PlayerType = "XPlayer" | "OPlayer";
export type Position = {
    x: number;
    y: number;
};
export type BoardSize = {
    width: number;
    height: number;
};

export type MatchStatus = "in-progress" | "completed";
export type PlayerTurn = "me" | "opponent";
