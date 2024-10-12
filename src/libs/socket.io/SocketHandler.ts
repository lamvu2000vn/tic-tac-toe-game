import {Server, Socket} from "socket.io";
import {Database} from "sqlite";
import {
    ILeaveSocketRoomPayload,
    IConnectPlayerPayload,
    IConnectPlayerWSResponse,
    INewMatchIdWSResponse,
    IBoardUpdatePayload,
    ICancelRequestPlayAgainPayload,
    IEndTheGamePayload,
    ILeaveTheMatchPayload,
    IPlayerInfo,
    IPlayerInfoOfMatch,
    IPlayerMovePayload,
    IPlayerTimeoutPayload,
    IRequestPlayAgainPayload,
    IRoomCancelledPayload,
    IJoinSocketRoomPayload,
    INewPlayerPayload,
    INewPlayerWSResponse,
    IReadyToStartPayload,
    IWSResponse,
    ISendMessagePayload,
    IShowMessagePayload,
} from "@/shared/interfaces";
import {
    checkWin,
    generateUniqueString,
    initializeMatchInfo,
    initializePlayerInfoOfMatch,
    randomPlayerType,
} from "../../utils/serverUtils";
import {Player, Match, Move} from "../../Database/models";
import {JoinRoomError, PlayerType} from "@/shared/types";

export default class SocketHandle {
    private player: IPlayerInfo | null = null;

    constructor(
        private io: Server,
        private socket: Socket,
        private db: Database,
        private readyToStartRooms: Map<string, IPlayerInfoOfMatch[]>
    ) {
        this.socket.on("newPlayer", this.handleNewPlayer.bind(this));
        this.socket.on("connectPlayer", this.handleConnectPlayer.bind(this));
        this.socket.on("newSocketRoom", this.handleNewSocketRoom.bind(this));
        this.socket.on("leaveSocketRoom", this.handleLeaveSocketRoom.bind(this));
        this.socket.on("joinSocketRoom", this.handleJoinSocketRoom.bind(this));
        this.socket.on("readyToStart", this.handleReadyToStart.bind(this));
        this.socket.on("playerMove", this.handlePlayerMove.bind(this));
        this.socket.on("playerTimeout", this.handlePlayerTimeout.bind(this));
        this.socket.on("requestPlayAgain", this.handleRequestPlayAgain.bind(this));
        this.socket.on("cancelRequestPlayAgain", this.handleCancelRequestPlayAgain.bind(this));
        this.socket.on("acceptInvitation", this.handleAcceptInvitation.bind(this));
        this.socket.on("leaveTheMatch", this.handleLeaveTheMatch.bind(this));
        this.socket.on("sendMessage", this.handleSendMessage.bind(this));
        this.socket.on("disconnect", this.handleDisconnect.bind(this));
    }

    private async handleNewPlayer(payload: INewPlayerPayload, callback: (response: INewPlayerWSResponse) => void) {
        const response: INewPlayerWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const _Player = new Player(this.db);

            const result = await _Player.insert({name: payload.name, socket_id: this.socket.id});

            const newPlayer: IPlayerInfo = {
                id: result.lastID!,
                name: payload.name,
                socketId: this.socket.id,
            };

            this.player = newPlayer;

            response.status = "ok";
            response.message = "success";
            response.data = {
                player: newPlayer,
            };
        } catch (err) {
            console.log("🚀 ~ SocketHandle ~ handleNewPlayer ~ err:", err);
            response.status = "not ok";
        } finally {
            callback(response);
        }
    }

    private async handleConnectPlayer(
        payload: IConnectPlayerPayload,
        callback: (response: IConnectPlayerWSResponse) => void
    ) {
        const response: IConnectPlayerWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const _Player = new Player(this.db);
            const exists = await _Player.findById(payload.player.id);

            if (!exists) throw new Error("Player not found");

            await _Player.setSocketId(exists.id, this.socket.id);

            const playerConnected: IPlayerInfo = {
                id: exists.id,
                name: exists.name,
                socketId: this.socket.id,
            };

            this.player = playerConnected;

            response.status = "ok";
            response.message = "success";
            response.data.playerConnected = playerConnected;
        } catch (err: Error | unknown) {
            console.log("🚀 ~ SocketHandle ~ err:", err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleNewSocketRoom(callback: (response: INewMatchIdWSResponse) => void) {
        const response: INewMatchIdWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const socketRoomId = generateUniqueString(15);

            this.socket.join(socketRoomId);

            response.status = "ok";
            response.message = "success";
            response.data = {
                roomId: socketRoomId,
            };
        } catch (err) {
            console.log("🚀 ~ SocketHandle ~ handleNewSocketRoom ~ err:", err);
            console.log(err);
            response.status = "not ok";
        } finally {
            callback(response);
        }
    }

    private async handleLeaveSocketRoom(payload: ILeaveSocketRoomPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        this.socket.leave(payload.roomId);

        response.status = "ok";

        callback(response);
    }

    private async handleJoinSocketRoom(payload: IJoinSocketRoomPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "error",
            data: {},
        };

        try {
            const {roomId} = payload;
            const socketRoom = this.io.sockets.adapter.rooms.get(roomId);

            if (!socketRoom) throw new Error("Room not found" as JoinRoomError);
            if (socketRoom.size >= 2) throw new Error("Match started" as JoinRoomError);

            this.socket.join(roomId);

            const _Player = new Player(this.db);
            const _Match = new Match(this.db);

            const players = await Promise.all(
                Array.from(this.io.sockets.adapter.rooms.get(roomId)!).map((socketId) =>
                    _Player.findBySocketId(socketId)
                )
            );

            if (players.length !== 2) throw new Error("Couldn't join room" as JoinRoomError);

            await _Match.insert({
                id: roomId,
                player_1_id: players[0]!.id,
                player_2_id: players[1]!.id,
                player_1_score: 0,
                player_2_score: 0,
                match_status: "in-progress",
            });

            await this.io.to(roomId).timeout(10000).emitWithAck("prepareTheGame", {matchId: roomId});

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log("🚀 ~ SocketHandle ~ handleJoinSocketRoom ~ Error:", err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleReadyToStart(payload: IReadyToStartPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        const upgradePlayerAddPlayerToReadyList = (roomId: string, player: IPlayerInfo): IPlayerInfoOfMatch[] => {
            if (!this.readyToStartRooms.has(roomId)) this.readyToStartRooms.set(roomId, []);

            const room = this.readyToStartRooms.get(roomId)!;

            if (!room.find((p) => p.id === player.id)) {
                const firstPlayer = room[0] || null;
                const playerType: PlayerType = firstPlayer ? firstPlayer.playerType : randomPlayerType();
                const newPlayerInfo = initializePlayerInfoOfMatch(
                    player,
                    playerType === "OPlayer" ? "XPlayer" : "OPlayer"
                );

                const newValue = [...room, newPlayerInfo] as IPlayerInfoOfMatch[];

                this.readyToStartRooms.set(roomId, newValue);

                return newValue;
            }

            return room;
        };

        try {
            const {matchId, player} = payload;
            const socketRoom = this.io.sockets.adapter.rooms.get(matchId);

            if (!socketRoom) throw new Error("Room not found");

            const _Match = new Match(this.db);
            const matchInfo = await _Match.findById(matchId);
            const playerIds = [matchInfo?.player_1_id, matchInfo?.player_2_id];

            const isJoined = socketRoom && socketRoom.has(player.socketId) && playerIds.includes(player.id);

            if (!isJoined) throw new Error("Player not joined");

            const readyRoom = upgradePlayerAddPlayerToReadyList(matchId, payload.player);

            if (readyRoom.length === 2) {
                const xPlayer = readyRoom.find((player) => player.playerType === "XPlayer")!;
                const oPlayer = readyRoom.find((player) => player.playerType === "OPlayer")!;
                const matchInfo = initializeMatchInfo(matchId, xPlayer, oPlayer);

                await this.io.to(matchId).timeout(10000).emitWithAck("startTheGame", matchInfo);

                this.readyToStartRooms.delete(matchId);
            }

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log("🚀 ~ SocketHandle ~ readyToStart ~ err:", err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handlePlayerMove(payload: IPlayerMovePayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, player, position} = payload;

            const _Move = new Move(this.db);

            await _Move.insert({
                matchId,
                playerId: player.id,
                x: position.x,
                y: position.y,
            });

            const moves = await _Move.getPlayerMoves(matchId, player.id);

            if (!moves) throw new Error("Could not get player moves");

            const check = checkWin(moves);

            if (check.isWin) {
                const _Match = new Match(this.db);

                const matchInfo = await _Match.findById(matchId);

                await _Match.update(matchId, {
                    player_1_score:
                        player.id === matchInfo!.player_1_id
                            ? matchInfo!.player_1_score + 1
                            : matchInfo!.player_1_score,
                    player_2_score:
                        player.id === matchInfo!.player_2_id
                            ? matchInfo!.player_2_score + 1
                            : matchInfo!.player_2_score,
                    match_status: "completed",
                    winner_id: player.id,
                });
            }

            const boardUpdatePayload: IBoardUpdatePayload = {
                playerType: payload.player.playerType,
                position: payload.position,
                isWin: check.isWin,
                winMoves: check.isWin ? check.moves : [],
            };

            this.io.to(matchId).timeout(10000).emitWithAck("boardUpdate", boardUpdatePayload);

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log("🚀 ~ this.socket.on ~ err:", err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handlePlayerTimeout(payload: IPlayerTimeoutPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, player} = payload;
            const _Match = new Match(this.db);
            const matchInfo = await _Match.findById(matchId);
            const isPlayer1 = player.id === matchInfo!.player_1_id;
            const player1Score = !isPlayer1 ? matchInfo!.player_1_score + 1 : matchInfo!.player_1_score;
            const player2Score = isPlayer1 ? matchInfo!.player_2_score + 1 : matchInfo!.player_2_score;
            const winnerId = isPlayer1 ? matchInfo!.player_2_id : matchInfo!.player_1_id;

            await _Match.update(matchId, {
                player_1_score: player1Score,
                player_2_score: player2Score,
                winner_id: winnerId,
                match_status: "completed",
            });

            await this.io
                .to(matchId)
                .timeout(10000)
                .emitWithAck("endTheGame", {
                    winner: player.playerType === "XPlayer" ? "OPlayer" : "XPlayer",
                } as IEndTheGamePayload);

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log(err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleRequestPlayAgain(payload: IRequestPlayAgainPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, requester} = payload;

            const socketRoom = this.io.sockets.adapter.rooms.get(matchId);

            if (!socketRoom) throw new Error("Room not found");

            const requestId = this.socket.id;
            const receiveIds = Array.from(socketRoom).filter((id) => id !== requestId);

            this.socket
                .to(receiveIds)
                .timeout(10000)
                .emitWithAck("invitePlayAgain", {
                    requester,
                } as {requester: IPlayerInfo});

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log(err);

            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleCancelRequestPlayAgain(
        payload: ICancelRequestPlayAgainPayload,
        callback: (response: IWSResponse) => void
    ) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, canceller} = payload;

            if (!this.io.sockets.adapter.rooms.has(matchId)) throw new Error("Room not found");

            this.io
                .to(matchId)
                .timeout(10000)
                .emitWithAck("canceledInvitePlayAgain", {
                    canceller: canceller,
                } as {canceller: IPlayerInfo});

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleAcceptInvitation(payload: {matchId: string}, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const _Match = new Match(this.db);
            const _Move = new Move(this.db);

            const matchInfo = await _Match.getFullMatchInfo(payload.matchId);

            if (!matchInfo) throw new Error("Could not create a match");

            const randType = randomPlayerType();

            const newPlayer1: IPlayerInfoOfMatch = {
                id: matchInfo.player_1_id,
                name: matchInfo.player_1_name,
                socketId: matchInfo.player_1_socket_id,
                playerType: randType,
                scores: matchInfo.player_1_score,
            };

            const newPlayer2: IPlayerInfoOfMatch = {
                id: matchInfo.player_2_id,
                name: matchInfo.player_2_name,
                socketId: matchInfo.player_2_socket_id,
                playerType: randType === "XPlayer" ? "OPlayer" : "XPlayer",
                scores: matchInfo.player_2_score,
            };

            const newMatchInfo = initializeMatchInfo(
                payload.matchId,
                randType === "XPlayer" ? newPlayer1 : newPlayer2,
                randType === "OPlayer" ? newPlayer1 : newPlayer2
            );

            await _Match.update(payload.matchId, {
                winner_id: null,
                match_status: "in-progress",
            });
            await _Move.deleteByMatchId(payload.matchId);

            await this.io.to(payload.matchId).timeout(10000).emitWithAck("startTheGame", newMatchInfo);

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log(err);

            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleLeaveTheMatch(payload: ILeaveTheMatchPayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, player} = payload;

            const socketRoom = this.io.sockets.adapter.rooms.get(matchId)!;

            const _Match = new Match(this.db);
            const _Move = new Move(this.db);
            const socketIds = Array.from(socketRoom);

            this.io.sockets.adapter.rooms.delete(matchId);

            await _Move.deleteByMatchId(matchId);
            await _Match.delete(matchId);
            await this.io
                .to(socketIds)
                .timeout(10000)
                .emitWithAck("playerHasLeft", {canceller: player} as IRoomCancelledPayload);

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log(err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleSendMessage(payload: ISendMessagePayload, callback: (response: IWSResponse) => void) {
        const response: IWSResponse = {
            status: "not ok",
            message: "",
            data: {},
        };

        try {
            const {matchId, type, content, senderId} = payload;

            await this.io
                .to(matchId)
                .timeout(10000)
                .emitWithAck("showMessage", {senderId, content, type} as IShowMessagePayload);

            response.status = "ok";
            response.message = "success";
        } catch (err: Error | unknown) {
            console.log(err);
            response.status = "not ok";
            response.message = err instanceof Error ? err.message : "error";
        } finally {
            callback(response);
        }
    }

    private async handleDisconnect() {
        console.log("a user disconnected");

        try {
            if (this.player) {
                const _Match = new Match(this.db);
                const _Player = new Player(this.db);
                const _Move = new Move(this.db);

                const theMatch = await _Match.getTheMatchThePlayerIsPlaying(this.player.id);

                if (theMatch) {
                    const socketRoom = this.io.sockets.adapter.rooms.get(theMatch.id);
                    console.log("🚀 ~ SocketHandle ~ handleDisconnect ~ socketRoom:", socketRoom);

                    if (socketRoom) {
                        const socketIds = Array.from(socketRoom);

                        this.io.sockets.adapter.rooms.delete(theMatch.id);

                        await _Move.deleteByMatchId(theMatch.id);
                        await _Match.delete(theMatch.id);
                        await this.io
                            .to(socketIds)
                            .timeout(10000)
                            .emitWithAck("playerHasLeft", {canceller: this.player} as IRoomCancelledPayload);
                    } else {
                        console.log("room not exists when disconnected");
                    }
                }

                await _Player.setSocketId(this.player.id, null);

                this.player = null;
            }
        } catch (err) {
            console.log("🚀 ~ SocketHandle ~ handleDisconnect ~ err:", err);
        }
    }
}
