import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import CountDown from "./CountDown";
import PlayerInfo from "./PlayerInfo";
import {useRecoilValue} from "recoil";
import {GiTrophyCup} from "react-icons/gi";

export default function TwoPlayersInfo() {
    const myMatchInfo = useRecoilValue(myMatchInfoState)!;

    const {myInfo, opponentInfo, winner} = myMatchInfo;

    if (winner) {
        const winnerType = winner === "me" ? myInfo.playerType : opponentInfo.playerType;

        const bgClass = winnerType === "XPlayer" ? "bg-rose-100" : "bg-blue-100";
        const shadowClass = winnerType === "XPlayer" ? "shadow-lg shadow-rose-300" : "shadow-lg shadow-blue-300";
        const textColorClass = winnerType === "XPlayer" ? "text-rose-500" : "text-blue-500";

        return (
            <div className={`h-[60px] w-full px-2 flex items-center justify-center gap-2 ${bgClass} ${shadowClass}`}>
                <GiTrophyCup className="w-6 h-6" />
                <div className="text-lg sm:text-xl flex items-center gap-2">
                    <span className="flex-shrink-0">Người chiến thắng là</span>
                    <strong className={`${textColorClass} truncate`}>
                        {winner === "me" ? myInfo.name : opponentInfo.name}
                    </strong>
                </div>
                <GiTrophyCup className="w-6 h-6" />
            </div>
        );
    }

    return (
        <div className="w-full flex items-stretch gap-1 sm:gap-2">
            <PlayerInfo playerInfo={myMatchInfo.myInfo} side="left" isPlayerTurn={myMatchInfo.currentTurn === "me"} />
            <CountDown />
            <PlayerInfo
                playerInfo={myMatchInfo.opponentInfo}
                side="right"
                isPlayerTurn={myMatchInfo.currentTurn === "opponent"}
            />
        </div>
    );
}
