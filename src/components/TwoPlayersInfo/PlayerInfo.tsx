import {IMessage, IPlayerInfoOfMatch} from "@/shared/interfaces";
import Avatar from "./Avatar";
import {useEffect, useState} from "react";
import Message from "./Message";

interface Props {
    playerInfo: IPlayerInfoOfMatch;
    side: "left" | "right";
    isPlayerTurn: boolean;
    message: IMessage | null;
}

export default function PlayerInfo(props: Props) {
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const {name, playerType, scores} = props.playerInfo;

    // Định nghĩa các lớp CSS theo playerType và side
    const isXPlayer = playerType === "XPlayer";
    const isLeftSide = props.side === "left";
    const bgColor = isXPlayer ? "bg-rose-100" : "bg-blue-100";
    const textColor = isXPlayer ? "text-rose-500" : "text-blue-500";
    const borderRadius = isLeftSide ? "rounded-r-full" : "rounded-l-full";
    const justifyContent = isLeftSide ? "justify-start" : "justify-end";
    const myTurnBg = props.isPlayerTurn ? "" : "grayscale";

    useEffect(() => {
        if (props.message) {
            setShowMessage(true);

            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [props.message]);

    return (
        <div className="relative flex-1 overflow-hidden">
            <div className={`p-2 h-16 ${bgColor} ${borderRadius} ${myTurnBg}`}>
                <div className={`flex h-full ${justifyContent} items-center gap-4 `}>
                    {isLeftSide ? (
                        <>
                            <Avatar playerType={playerType!} />
                            <div className="flex flex-col items-start overflow-hidden">
                                <b className={`${textColor} text-base w-full truncate`}>{name}</b>
                                <b className={`${textColor} text-sm`}>{scores}</b>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-end overflow-hidden">
                                <b className={`${textColor} text-base w-full truncate`}>{name}</b>
                                <b className={`${textColor} text-sm`}>{scores}</b>
                            </div>
                            <Avatar playerType={playerType!} />
                        </>
                    )}
                </div>
            </div>
            <Message show={showMessage} message={props.message} side={props.side} />
        </div>
    );
}
