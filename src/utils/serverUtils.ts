import {IMatchInfo, IPlayerInfo, IPlayerInfoOfMatch} from "@/shared/interfaces";
import {PlayerType, Position} from "@/shared/types";

export const generateUniqueString = (length: number = 20): string => {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now().toString(16);

    // Generate random bytes and convert them to a hex string
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((b) => ("0" + b.toString(16)).slice(-2))
        .join("");

    // Combine the timestamp with the random string and trim to the desired length
    return (timestamp + randomPart).slice(0, length);
};

export const checkWin = (playerMoves: Position[]): {isWin: boolean; moves: Position[]; direction: string} => {
    const numberMovesToWin = 5;

    if (playerMoves.length < numberMovesToWin) {
        return {isWin: false, moves: [], direction: ""};
    }

    const playerMoveSet = new Set(playerMoves.map((pos) => `${pos.y}-${pos.x}`));

    const checkLine = (position: Position, dx: number, dy: number): Position[] => {
        const moves: Position[] = [];
        for (let i = 1; i < numberMovesToWin; i++) {
            const newX = position.x + i * dx;
            const newY = position.y + i * dy;
            const move = `${newY}-${newX}`;

            if (!playerMoveSet.has(move)) break;

            moves.push({
                x: newX,
                y: newY,
            });
        }
        return moves;
    };

    for (const position of playerMoves) {
        // Check all directions: left, right, up, down, diagonals
        const directions = [
            {name: "left", line: checkLine(position, -1, 0)},
            {name: "right", line: checkLine(position, 1, 0)},
            {name: "top", line: checkLine(position, 0, -1)},
            {name: "bottom", line: checkLine(position, 0, 1)},
            {name: "top-left", line: checkLine(position, -1, -1)},
            {name: "bottom-left", line: checkLine(position, -1, 1)},
            {name: "top-right", line: checkLine(position, 1, -1)},
            {name: "bottom-right", line: checkLine(position, 1, 1)},
        ];

        for (const {name, line} of directions) {
            if (line.length === numberMovesToWin - 1) {
                return {isWin: true, moves: [position, ...line], direction: name};
            }
        }
    }

    return {isWin: false, moves: [], direction: ""};
};

export const randomIndex = (arrayLength: number): number => Math.floor(Math.random() * arrayLength);

export const randomPlayerType = (): PlayerType => ["XPlayer", "OPlayer"][randomIndex(2)] as PlayerType;

export const initializePlayerInfoOfMatch = (playerInfo: IPlayerInfo, playerType: PlayerType): IPlayerInfoOfMatch => ({
    id: playerInfo.id,
    name: playerInfo.name,
    socketId: playerInfo.socketId,
    playerType,
    scores: 0,
});

export const initializeMatchInfo = (
    matchId: string,
    xPlayer: IPlayerInfoOfMatch,
    oPlayer: IPlayerInfoOfMatch
): IMatchInfo => ({
    matchId,
    xPlayer,
    oPlayer,
    firstTurn: randomPlayerType(),
    winner: null,
    matchStatus: "in-progress",
});

export const randomMatchInfo = (
    players: IPlayerInfoOfMatch[]
): {
    xPlayer: IPlayerInfoOfMatch;
    oPlayer: IPlayerInfoOfMatch;
    firstTurn: PlayerType;
} => {
    const xPlayer = players[randomIndex(players.length)]!;
    const oPlayer = players.find((p) => p.id !== xPlayer.id)!;
    const firstTurn = randomPlayerType();

    return {
        xPlayer,
        oPlayer,
        firstTurn,
    };
};
