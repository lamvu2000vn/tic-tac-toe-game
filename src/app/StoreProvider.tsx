"use client";

import {RecoilRoot} from "recoil";

export default function StoreProvider({children}: {children: React.ReactNode}) {
    return <RecoilRoot>{children}</RecoilRoot>;
}
