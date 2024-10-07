"use client";

import {Board} from "@/components/Board";
import {InvitePlayAgainModal, PreparingMatchModal, RoomCancelledModal, WaitingForAcceptModal} from "@/components/Modal";
import NavBar from "@/components/NavBar/NavBar";
import {MatchNotExists} from "@/components/pages/Match";
import TwoPlayersInfo from "@/components/TwoPlayersInfo/TwoPlayersInfo";
import {Card} from "@/components/UI";
import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import {playerInfoState} from "@/libs/recoil/atoms/playerInfoAtom";
import socket from "@/libs/socket.io/socketClient";
import {
    IBoardUpdatePayload,
    ICancelRequestPlayAgainPayload,
    IEndTheGamePayload,
    IHighlightMove,
    ILeaveTheMatchPayload,
    IMatchInfo,
    IMyMatchInfo,
    IPlayerInfo,
    IRequestPlayAgainPayload,
    IRoomCancelledPayload,
    IReadyToStartPayload,
    IWSResponse,
} from "@/shared/interfaces";
import {Position} from "@/shared/types";
import {convertToMyMatchInfo, showToast} from "@/utils/clientUtils";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";

interface Props {
    params: {
        matchId: string;
    };
}

const WAITING_ACCEPT_TIMEOUT = 60000; // 60s
const MY_MATCH_INFO_TIMEOUT = 60000; // 60s

export default function Page(props: Props) {
    const router = useRouter();
    const playerInfo = useRecoilValue(playerInfoState)!;
    const [myMatchInfo, setMyMatchInfo] = useRecoilState(myMatchInfoState);
    const [isMatchExists, setIsMatchExists] = useState<boolean>(true);
    const [highlightMoves, setHighlightMoves] = useState<IHighlightMove[]>([]);
    const [playAgainRequester, setPlayAgainRequester] = useState<IPlayerInfo | null>(null);
    const [showPlayAgainModal, setShowPlayAgainModal] = useState<boolean>(false);
    const [showWaitingForAcceptModal, setShowWaitingForAcceptModal] = useState<boolean>(false);
    const [showRoomCancelledModal, setShowRoomCancelledModal] = useState<boolean>(false);
    const [showPreparingMatchModal, setPreparingMatchModal] = useState<boolean>(false);
    const [myMoves, setMyMoves] = useState<Position[]>([]);
    const [opponentMoves, setOpponentMoves] = useState<Position[]>([]);

    const waitingAcceptTimer = useRef<NodeJS.Timeout | null>(null);
    const myMatchInfoTimer = useRef<NodeJS.Timeout | null>(null);

    const handleCancelRequestPlayAgain = useCallback(
        async (canceller: IPlayerInfo | null = null) => {
            await socket.emitWithAck("cancelRequestPlayAgain", {
                matchId: myMatchInfo!.matchId,
                canceller,
            } as ICancelRequestPlayAgainPayload);
        },
        [myMatchInfo]
    );

    const handleRequestPlayerAgain = useCallback(async () => {
        const response = (await socket.emitWithAck("requestPlayAgain", {
            matchId: myMatchInfo!.matchId,
            requester: playerInfo,
        } as IRequestPlayAgainPayload)) as IWSResponse;

        if (response.status === "ok") {
            setShowWaitingForAcceptModal(true);
        } else {
            alert("Không thể gửi lời mời");
        }
    }, [myMatchInfo, playerInfo]);

    const handleAcceptInvitation = useCallback(async () => {
        await socket.emitWithAck("acceptInvitation", {
            matchId: myMatchInfo!.matchId,
        } as {matchId: string});
    }, [myMatchInfo]);

    const handleLeaveRoom = useCallback(async () => {
        await socket.emitWithAck("leaveTheMatch", {
            matchId: myMatchInfo!.matchId,
            player: myMatchInfo!.myInfo,
        } as ILeaveTheMatchPayload);
    }, [myMatchInfo]);

    // Waiting for play again response
    useEffect(() => {
        if (showWaitingForAcceptModal) {
            waitingAcceptTimer.current = setTimeout(() => {
                clearTimeout(waitingAcceptTimer.current!);
                handleCancelRequestPlayAgain();
            }, WAITING_ACCEPT_TIMEOUT);
        }

        return () => {
            waitingAcceptTimer.current && clearTimeout(waitingAcceptTimer.current);
        };
    }, [handleCancelRequestPlayAgain, showWaitingForAcceptModal]);

    // Emit ready to start
    useEffect(() => {
        setPreparingMatchModal(true);

        (async () => {
            const payload: IReadyToStartPayload = {
                player: playerInfo,
                matchId: props.params.matchId,
            };

            const response: IWSResponse = await socket.emitWithAck("readyToStart", payload);

            if (response.status === "not ok") {
                if (response.message === "Player not joined") setIsMatchExists(false);
            }
        })();
    }, [playerInfo, props.params.matchId]);

    // Wait myMatchInfo
    useEffect(() => {
        if (myMatchInfo) return;

        myMatchInfoTimer.current = setTimeout(() => {
            setIsMatchExists(false);
            setPreparingMatchModal(false);
        }, MY_MATCH_INFO_TIMEOUT);

        return () => {
            myMatchInfoTimer.current && clearTimeout(myMatchInfoTimer.current);
        };
    }, [isMatchExists, myMatchInfo]);

    // Handle event from server
    useEffect(() => {
        const onStartTheGame = (payload: IMatchInfo, callback: (response: IWSResponse) => void) => {
            const convertData = convertToMyMatchInfo(playerInfo, payload);

            if (convertData.currentTurn === "me") {
                showToast("Bạn đi lượt đầu tiên");
            } else {
                showToast("Đối thủ lượt đầu tiên");
            }

            setHighlightMoves([]);
            setShowPlayAgainModal(false);
            setShowWaitingForAcceptModal(false);
            setPlayAgainRequester(null);
            setMyMoves([]);
            setOpponentMoves([]);
            setPreparingMatchModal(false);

            setMyMatchInfo(convertData);

            callback({
                status: "ok",
                message: "",
                data: {},
            });
        };

        const onBoardUpdate = (payload: IBoardUpdatePayload, callback: (response: IWSResponse) => void) => {
            const updatedInfo: IMyMatchInfo = {
                ...myMatchInfo!,
                myInfo: {...myMatchInfo!.myInfo},
                opponentInfo: {...myMatchInfo!.opponentInfo},
            };
            const {isWin, playerType, position, winMoves} = payload;

            if (isWin) {
                const winner = playerType === myMatchInfo!.myInfo.playerType ? "me" : "opponent";

                winner === "me" ? updatedInfo.myInfo.scores++ : updatedInfo.opponentInfo.scores++;
                updatedInfo.winner = winner;
                updatedInfo.matchStatus = "completed";

                setHighlightMoves(
                    winMoves.map((move) => ({
                        position: move,
                        playerType: playerType,
                    }))
                );
            } else {
                updatedInfo.currentTurn = updatedInfo.currentTurn === "me" ? "opponent" : "me";
                setHighlightMoves([
                    {
                        position: position,
                        playerType: playerType,
                    },
                ]);
            }

            myMatchInfo!.myInfo.playerType === playerType
                ? setMyMoves((state) => [...state, position])
                : setOpponentMoves((state) => [...state, position]);

            callback({
                status: "ok",
                message: "success",
                data: {},
            });

            setMyMatchInfo(updatedInfo);
        };

        const onEndTheGame = (payload: IEndTheGamePayload, callback: (response: IWSResponse) => void) => {
            const updatedInfo: IMyMatchInfo = {
                ...myMatchInfo!,
                myInfo: {...myMatchInfo!.myInfo},
                opponentInfo: {...myMatchInfo!.opponentInfo},
            };

            const winner = payload.winner === updatedInfo.myInfo.playerType ? "me" : "opponent";

            updatedInfo.winner = winner;
            winner === "me" ? updatedInfo.myInfo.scores++ : updatedInfo.opponentInfo.scores++;
            updatedInfo.matchStatus = "completed";

            callback({
                status: "ok",
                message: "success",
                data: {},
            });

            setMyMatchInfo(updatedInfo);
        };

        const onInvitePlayAgain = (payload: {requester: IPlayerInfo}, callback: (response: IWSResponse) => void) => {
            setShowPlayAgainModal(true);
            setPlayAgainRequester(payload.requester);

            callback({
                status: "ok",
                message: "success",
                data: {},
            });
        };

        const onCanceledInvitePlayAgain = (
            payload: {canceller: IPlayerInfo},
            callback: (response: IWSResponse) => void
        ) => {
            setShowPlayAgainModal(false);
            setShowWaitingForAcceptModal(false);
            setPlayAgainRequester(null);

            if (!playAgainRequester) {
                const canceller = payload.canceller;
                // canceled by opponent
                if (canceller && canceller.id !== playerInfo.id) {
                    showToast(`${canceller.name} đã từ chối lời mời`, "info");
                } else if (!canceller) {
                    // canceled by timeout
                    showToast("Quá thời gian chờ.", "info");
                }
            }

            callback({
                status: "ok",
                message: "success",
                data: {},
            });
        };

        const onPlayerHasLeft = (payload: IRoomCancelledPayload, callback: (response: IWSResponse) => void) => {
            setMyMatchInfo((state) => ({
                ...state!,
                matchStatus: "completed",
            }));

            if (!payload.canceller || payload.canceller.id !== myMatchInfo!.myInfo.id) {
                setShowRoomCancelledModal(true);
            } else {
                setMyMatchInfo(null);
                router.push("/");
            }

            callback({
                status: "ok",
                message: "success",
                data: {},
            });
        };

        socket.on("boardUpdate", onBoardUpdate);
        socket.on("endTheGame", onEndTheGame);
        socket.on("invitePlayAgain", onInvitePlayAgain);
        socket.on("canceledInvitePlayAgain", onCanceledInvitePlayAgain);
        socket.on("startTheGame", onStartTheGame);
        socket.on("playerHasLeft", onPlayerHasLeft);

        return () => {
            socket.off("boardUpdate", onBoardUpdate);
            socket.off("endTheGame", onEndTheGame);
            socket.off("invitePlayAgain", onInvitePlayAgain);
            socket.off("canceledInvitePlayAgain", onCanceledInvitePlayAgain);
            socket.off("startTheGame", onStartTheGame);
            socket.off("playerHasLeft", onPlayerHasLeft);
        };
    }, [myMatchInfo, playAgainRequester, playerInfo, router, setMyMatchInfo]);

    if (!isMatchExists) {
        return <MatchNotExists />;
    }

    return (
        <Card className="w-full h-full max-w-lg rounded-none overflow-hidden flex flex-col items-stretch gap-8">
            <PreparingMatchModal show={showPreparingMatchModal} />
            {myMatchInfo && (
                <>
                    <TwoPlayersInfo />
                    <Board
                        numberXCells={24}
                        numberYCells={24}
                        highlightMoves={highlightMoves}
                        myMoves={myMoves}
                        opponentMoves={opponentMoves}
                    />
                    <NavBar onRequestPlayAgain={handleRequestPlayerAgain} onLeaveRoom={handleLeaveRoom} />
                    <InvitePlayAgainModal
                        show={showPlayAgainModal}
                        requester={playAgainRequester}
                        onDeclineInvitation={() => handleCancelRequestPlayAgain(playerInfo)}
                        onAcceptInvitation={handleAcceptInvitation}
                    />
                    <WaitingForAcceptModal
                        show={showWaitingForAcceptModal}
                        onCancelWaiting={() => handleCancelRequestPlayAgain(playerInfo)}
                    />
                    <RoomCancelledModal show={showRoomCancelledModal} />
                </>
            )}
        </Card>
    );
}
