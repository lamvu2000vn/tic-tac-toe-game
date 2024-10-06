import {IMatchInfo} from "@/shared/interfaces";
import {atom} from "recoil";

export const matchInfoState = atom<IMatchInfo | null>({
    key: "matchInfo",
    default: null,
});
