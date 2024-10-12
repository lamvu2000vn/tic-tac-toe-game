import {MatchStatus, MessageType, PlayerTurn, PlayerType, Position} from "./types";

// ======================= START DB =======================
export interface IModel<T> {
    findById?(id: string | number): Promise<T | null>;
    get?(query: string): void;
}

export interface IMatchTableFields {
    id: string;
    player_1_id: number;
    player_2_id: number;
    player_1_score: number;
    player_2_score: number;
    match_status: MatchStatus;
    winner_id?: number;
}

export interface IPlayerTableFields {
    id: number;
    name: string;
    socket_id?: string;
}

export interface IMoveTableFields {
    id: number;
    match_id: string;
    player_id: number;
    x: number;
    y: number;
}
// ======================= END DB =======================

// ======================= START SOCKET PAYLOAD =======================
export interface INewPlayerPayload {
    name: string;
}

export interface ILeaveSocketRoomPayload {
    roomId: string;
}

export interface IJoinSocketRoomPayload {
    roomId: string;
}

export interface IConnectPlayerPayload {
    player: IPlayerInfo;
}

export interface IReadyToStartPayload {
    player: IPlayerInfo;
    matchId: string;
}

export interface IPlayerMovePayload {
    matchId: string;
    player: IPlayerInfoOfMatch;
    position: Position;
}

export interface IBoardUpdatePayload {
    playerType: PlayerType;
    position: Position;
    isWin: boolean;
    winMoves: Position[];
}

export interface IPlayerTimeoutPayload {
    matchId: string;
    player: IPlayerInfoOfMatch;
}

export interface IEndTheGamePayload {
    winner: PlayerType;
}

export interface IRequestPlayAgainPayload {
    matchId: string;
    requester: IPlayerInfo;
}

export interface ICancelRequestPlayAgainPayload {
    matchId: string;
    canceller: IPlayerInfo | null;
}

export interface ILeaveTheMatchPayload {
    matchId: string;
    player: IPlayerInfoOfMatch;
}

export interface IRoomCancelledPayload {
    canceller: IPlayerInfoOfMatch | null;
}

export interface ISendMessagePayload {
    senderId: number;
    type: MessageType;
    content: string;
    matchId: string;
}

export interface IShowMessagePayload {
    senderId: number;
    type: MessageType;
    content: string;
}
// ======================= START SOCKET PAYLOAD =======================

// ======================= START SOCKET RESPONSE =======================
export interface IWSResponse {
    status: "ok" | "not ok";
    message: string;
    data: object;
}

export interface INewPlayerWSResponse extends IWSResponse {
    data: {
        player?: IPlayerInfo;
    };
}

export interface INewMatchIdWSResponse extends IWSResponse {
    data: {
        roomId?: string;
    };
}

export interface IConnectPlayerWSResponse extends IWSResponse {
    data: {
        playerConnected?: IPlayerInfo;
    };
}
// ======================= END SOCKET RESPONSE =======================

// ======================= START GAME INFO =======================
export interface IPlayerInfo {
    id: number;
    name: string;
    socketId: string;
}

export interface IPlayerInfoOfMatch extends IPlayerInfo {
    playerType: PlayerType;
    scores: number;
}

export interface IHighlightMove {
    position: Position;
    playerType: PlayerType;
}

export interface IMatchInfo {
    matchId: string;
    xPlayer: IPlayerInfoOfMatch;
    oPlayer: IPlayerInfoOfMatch;
    firstTurn: PlayerType;
    winner: PlayerType | null;
    matchStatus: MatchStatus;
}

export interface IListPlayingRoom {
    [key: string]: IMatchInfo;
}

export interface IMyMatchInfo {
    matchId: string;
    myInfo: IPlayerInfoOfMatch;
    opponentInfo: IPlayerInfoOfMatch;
    currentTurn: PlayerTurn;
    winner: PlayerTurn | null;
    matchStatus: MatchStatus;
}

export interface IMessage {
    type: MessageType;
    content: string;
}

// ======================= END GAME INFO =======================
