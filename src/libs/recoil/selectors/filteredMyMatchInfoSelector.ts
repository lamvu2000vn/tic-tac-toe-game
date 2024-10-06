import {selector} from "recoil";
import {playerInfoState} from "../atoms/playerInfoAtom";
import {matchInfoState} from "../atoms/matchInfoAtom";
import {IMyMatchInfo} from "@/shared/interfaces";
import {PlayerType} from "@/shared/types";

export const filteredMyMatchInfoState = selector<IMyMatchInfo | null>({
    key: "myInfo",
    get: ({get}) => {
        const playerInfo = get(playerInfoState);
        const matchInfo = get(matchInfoState);

        if (playerInfo && matchInfo) {
            const myType: PlayerType = playerInfo.id === matchInfo.xPlayer.id ? "XPlayer" : "OPlayer";

            const myInfo: IMyMatchInfo = {
                roomId: matchInfo.roomId,
                myInfo: myType === "XPlayer" ? matchInfo.xPlayer : matchInfo.oPlayer,
                opponentInfo: myType === "XPlayer" ? matchInfo.oPlayer : matchInfo.xPlayer,
                currentTurn: matchInfo.currentTurn === myType ? "me" : "opponent",
                matchStatus: matchInfo.matchStatus,
            };

            return myInfo;
        }

        return null;
    },
});
