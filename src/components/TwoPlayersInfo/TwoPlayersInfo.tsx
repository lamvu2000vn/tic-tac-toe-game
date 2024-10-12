import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import CountDown from "./CountDown";
import PlayerInfo from "./PlayerInfo";
import {useRecoilValue} from "recoil";
import {GiTrophyCup} from "react-icons/gi";
import {useEffect, useState} from "react";
import {IMessage, IShowMessagePayload, IWSResponse} from "@/shared/interfaces";
import socket from "@/libs/socket.io/socketClient";

export default function TwoPlayersInfo() {
    const myMatchInfo = useRecoilValue(myMatchInfoState)!;
    const [myMessage, setMyMessage] = useState<IMessage | null>(null);
    const [opponentMessage, setOpponentMessage] = useState<IMessage | null>(null);

    const {myInfo, opponentInfo, winner, matchStatus} = myMatchInfo;

    useEffect(() => {
        const onShowMessage = (payload: IShowMessagePayload, callback: (response: IWSResponse) => void) => {
            const {senderId, content, type} = payload;

            senderId === myInfo.id ? setMyMessage({type, content}) : setOpponentMessage({type, content});

            callback({
                status: "ok",
                message: "success",
                data: {},
            });
        };

        socket.on("showMessage", onShowMessage);

        return () => {
            socket.off("showMessage", onShowMessage);
        };
    }, [myInfo.id]);

    useEffect(() => {
        if (matchStatus === "completed") {
            setMyMessage(null);
            setOpponentMessage(null);
        }
    }, [matchStatus]);

    if (winner) {
        const winnerType = winner === "me" ? myInfo.playerType : opponentInfo.playerType;

        const bgClass = winnerType === "XPlayer" ? "bg-rose-100" : "bg-blue-100";
        const shadowClass = winnerType === "XPlayer" ? "shadow-lg shadow-rose-300" : "shadow-lg shadow-blue-300";
        const textColorClass = winnerType === "XPlayer" ? "text-rose-500" : "text-blue-500";

        return (
            <div className="w-full h-24">
                <div
                    className={`h-[60px] w-full px-2 flex items-center justify-center gap-2 ${bgClass} ${shadowClass}`}
                >
                    <GiTrophyCup className="w-6 h-6" />
                    <div className="text-lg sm:text-xl flex items-center gap-2">
                        <span className="flex-shrink-0">Người chiến thắng là</span>
                        <strong className={`${textColorClass} truncate`}>
                            {winner === "me" ? myInfo.name : opponentInfo.name}
                        </strong>
                    </div>
                    <GiTrophyCup className="w-6 h-6" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-24 flex items-stretch gap-2">
            <PlayerInfo
                playerInfo={myMatchInfo.myInfo}
                side="left"
                isPlayerTurn={myMatchInfo.currentTurn === "me"}
                message={myMessage}
            />
            <CountDown />
            <PlayerInfo
                playerInfo={myMatchInfo.opponentInfo}
                side="right"
                isPlayerTurn={myMatchInfo.currentTurn === "opponent"}
                message={opponentMessage}
            />
        </div>
    );
}
