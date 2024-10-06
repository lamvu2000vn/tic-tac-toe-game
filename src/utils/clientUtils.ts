import {IMatchInfo, IMyMatchInfo, IPlayerInfo} from "@/shared/interfaces";
import {PlayerType} from "@/shared/types";
import {toast} from "react-toastify";

export const getPlayerInfoFromStorage = (): IPlayerInfo | null => {
    try {
        const userInfoString = window.localStorage.getItem("playerInfo") || "";

        return userInfoString ? JSON.parse(userInfoString) : null;
    } catch (error) {
        return null;
    }
};

export const setPlayerInfoIntoStorage = (playerInfo: IPlayerInfo) => {
    return window.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
};

export const removePlayerInfoIntoStorage = () => {
    return window.localStorage.removeItem("playerInfo");
};

export const convertToMyMatchInfo = (playerInfo: IPlayerInfo, matchInfo: IMatchInfo): IMyMatchInfo => {
    const myType: PlayerType = playerInfo.id === matchInfo.xPlayer.id ? "XPlayer" : "OPlayer";

    const myInfo: IMyMatchInfo = {
        matchId: matchInfo.matchId,
        myInfo: myType === "XPlayer" ? matchInfo.xPlayer : matchInfo.oPlayer,
        opponentInfo: myType === "XPlayer" ? matchInfo.oPlayer : matchInfo.xPlayer,
        currentTurn: matchInfo.firstTurn === myType ? "me" : "opponent",
        matchStatus: matchInfo.matchStatus,
        winner: matchInfo.winner ? (matchInfo.winner === myType ? "me" : "opponent") : null,
    };

    return myInfo;
};

export const showToast = (content: string, type: "info" | "success" | "warning" | "error" | "default" = "default") => {
    switch (type) {
        case "info":
            toast.info(content);
            break;
        case "success":
            toast.success(content);
            break;
        case "warning":
            toast.warning(content);
            break;
        case "error":
            toast.error(content);
            break;
        case "default":
            toast(content);
            break;
    }
};
