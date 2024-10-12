import {atom} from "recoil";

export const boardInfoState = atom<HTMLDivElement | null>({
    key: "boardInfoState",
    default: null,
});
