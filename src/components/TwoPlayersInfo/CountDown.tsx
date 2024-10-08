"use client";

import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import socket from "@/libs/socket.io/socketClient";
import {IPlayerTimeoutPayload} from "@/shared/interfaces";
import {useCallback, useEffect, useRef, useState} from "react";
import {useRecoilValue} from "recoil";

const TIMEOUT = 600;

export default function CountDown() {
    const [counter, setCounter] = useState<number>(TIMEOUT);
    const [isTimeout, setIsTimeout] = useState<boolean>(false);
    const myMatchInfo = useRecoilValue(myMatchInfoState);

    const {currentTurn, matchId, matchStatus, myInfo} = myMatchInfo!;

    const timerId = useRef<NodeJS.Timeout | null>(null);

    const handleTimeout = useCallback(() => {
        if (currentTurn === "me") {
            socket.emitWithAck("playerTimeout", {matchId, player: myInfo} as IPlayerTimeoutPayload);
        }
    }, [currentTurn, matchId, myInfo]);

    useEffect(() => {
        if (isTimeout || matchStatus === "completed") return;

        timerId.current = setTimeout(() => {
            setCounter((state) => (state > 0 ? state - 1 : state));

            if (counter <= 0) {
                setIsTimeout(true);
            }
        }, 1000);

        return () => {
            timerId.current && clearTimeout(timerId.current);
        };
    }, [counter, isTimeout, matchStatus]);

    useEffect(() => {
        return () => {
            timerId.current && clearTimeout(timerId.current);
            setCounter(TIMEOUT);
        };
    }, [currentTurn]);

    useEffect(() => {
        if (isTimeout) {
            handleTimeout();
        }
    }, [handleTimeout, isTimeout]);

    return (
        <div className="w-14 sm:w-16 flex items-center justify-center">
            <span className="text-xl sm:text-2xl">{counter}</span>
        </div>
    );
}
