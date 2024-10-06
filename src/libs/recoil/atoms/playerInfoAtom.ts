import {IPlayerInfo} from "@/shared/interfaces";
import {atom} from "recoil";

export const playerInfoState = atom<IPlayerInfo | null>({
    key: "playerInfo",
    default: null,
});
