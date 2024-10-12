"use client";

import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import socket from "@/libs/socket.io/socketClient";
import {IPlayerTimeoutPayload} from "@/shared/interfaces";
import {useCallback, useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

const TIMEOUT = 60;

export default function CountDown() {
    const [key, setKey] = useState<number>(0);
    const [isCountdownPlaying, setIsCountdownPlaying] = useState<boolean>(true);
    const myMatchInfo = useRecoilValue(myMatchInfoState);

    const {currentTurn, matchId, myInfo, matchStatus} = myMatchInfo!;

    const handleTimeout = useCallback(() => {
        if (currentTurn === "me") {
            socket.emitWithAck("playerTimeout", {matchId, player: myInfo} as IPlayerTimeoutPayload);
        }
    }, [currentTurn, matchId, myInfo]);

    useEffect(() => {
        return () => {
            setKey((state) => state + 1);
        };
    }, [currentTurn]);

    useEffect(() => {
        matchStatus === "completed" && setIsCountdownPlaying(false);
    }, [matchStatus]);

    return (
        <div className="w-14 h-16 flex items-center justify-center">
            <CountdownCircleTimer
                key={key}
                isPlaying={isCountdownPlaying}
                duration={TIMEOUT}
                initialRemainingTime={TIMEOUT}
                size={56}
                strokeWidth={8}
                colors={["#2dd4bf", "#4ade80", "#facc15", "#f87171", "#dc2626"]}
                colorsTime={[TIMEOUT, TIMEOUT * 0.75, TIMEOUT * 0.5, TIMEOUT * 0.25, 0]}
                onComplete={() => {
                    handleTimeout();
                    return {
                        shouldRepeat: false,
                    };
                }}
            >
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
        </div>
    );
}
