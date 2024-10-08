import {IPlayerInfoOfMatch} from "@/shared/interfaces";
import Avatar from "./Avatar";

interface Props {
    playerInfo: IPlayerInfoOfMatch;
    side: "left" | "right";
    isPlayerTurn: boolean;
}

export default function PlayerInfo(props: Props) {
    const {name, playerType, scores} = props.playerInfo;

    // Định nghĩa các lớp CSS theo playerType và side
    const isXPlayer = playerType === "XPlayer";
    const isLeftSide = props.side === "left";
    const bgColor = isXPlayer ? "bg-rose-100" : "bg-blue-100";
    const textColor = isXPlayer ? "text-rose-500" : "text-blue-500";
    const borderRadius = isLeftSide ? "rounded-r-full" : "rounded-l-full";
    const justifyContent = isLeftSide ? "justify-end" : "justify-start";
    const myTurnBg = props.isPlayerTurn
        ? isXPlayer
            ? "shadow-rose-400 shadow-lg"
            : "shadow-blue-400 shadow-lg"
        : "grayscale";

    return (
        <div className={`p-2 flex-1 overflow-hidden ${bgColor} ${borderRadius} ${myTurnBg}`}>
            <div className={`flex ${justifyContent} items-center gap-4 `}>
                {isLeftSide ? (
                    <>
                        <div className="flex flex-col items-end overflow-hidden">
                            <b className={`${textColor} text-base w-full truncate`}>{name}</b>
                            <b className={`${textColor} text-sm`}>{scores}</b>
                        </div>
                        <Avatar playerType={playerType!} />
                    </>
                ) : (
                    <>
                        <Avatar playerType={playerType!} />
                        <div className="flex flex-col overflow-hidden">
                            <b className={`${textColor} text-base w-full truncate`}>{name}</b>
                            <b className={`${textColor} text-sm`}>{scores}</b>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
