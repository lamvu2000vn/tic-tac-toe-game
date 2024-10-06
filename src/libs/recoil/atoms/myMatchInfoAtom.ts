import {IMyMatchInfo} from "@/shared/interfaces";
import {atom} from "recoil";

export const myMatchInfoState = atom<IMyMatchInfo | null>({
    key: "myMatchInfo",
    default: null,
});
