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
            <div className={`h-[60px] w-full flex items-center justify-center ${bgClass} ${shadowClass}`}>
                <GiTrophyCup className="w-6 h-6 mr-3" />
                <div className="text-xl font-semibole">
                    <span>
                        The winner is{" "}
                        <strong className={`${textColorClass}`}>
                            {winner === "me" ? myInfo.name : opponentInfo.name}
                        </strong>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex items-stretch">
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
