"use client";

import {CreatingRoomModal} from "@/components/Modal";
import {Home, Instruct, NewGame} from "@/components/pages/Home";
import BackButton from "@/components/pages/Home/BackButton";
import JoinRoom from "@/components/pages/Home/JoinRoom";
import {Card} from "@/components/UI";
import {playerInfoState} from "@/libs/recoil/atoms/playerInfoAtom";
import socket from "@/libs/socket.io/socket";
import {ILeaveSocketRoomPayload, INewMatchIdWSResponse, IWSResponse} from "@/shared/interfaces";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {useRecoilValue} from "recoil";

export type AvailableCrumbs = "home" | "new game" | "play with friend" | "instruct";

export default function Page() {
    const router = useRouter();
    const playerInfo = useRecoilValue(playerInfoState);
    const [breadcrumb, setBreadcrumb] = useState<AvailableCrumbs[]>(["home"]);
    const [socketRoomId, setSocketRoomId] = useState<string>("");
    const [matchId, setMatchId] = useState<string>("");
    const [showCreatingRoomModal, setShowCreatingRoomModal] = useState<boolean>(false);

    let Component: JSX.Element;
    const crumb = breadcrumb[breadcrumb.length - 1];

    const handleAddCrumb = useCallback((crumb: AvailableCrumbs) => {
        setBreadcrumb((state) => [...state, crumb]);
    }, []);

    const handleBackToPrevCrumb = useCallback(() => {
        setBreadcrumb((state) => state.slice(0, -1));
    }, []);

    useEffect(() => {
        function onPrepareTheGame(payload: {matchId: string}, callback: (response: IWSResponse) => void) {
            setShowCreatingRoomModal(true);
            setMatchId(payload.matchId);

            callback({
                status: "ok",
                message: "",
                data: {},
            });
        }

        socket.on("prepareTheGame", onPrepareTheGame);

        return () => {
            socket.off("prepareTheGame", onPrepareTheGame);
        };
    }, [setMatchId]);

    useEffect(() => {
        if (matchId) {
            router.push(matchId);
        }
    }, [matchId, router]);

    useEffect(() => {
        if (crumb === "new game") {
            if (!socketRoomId) {
                socket
                    .emitWithAck("newSocketRoom")
                    .then((response: INewMatchIdWSResponse) => {
                        if (response.status === "ok") {
                            setSocketRoomId(response.data.roomId!);
                        } else {
                            alert("Error creating room");
                        }
                    })
                    .catch(() => {
                        alert("Error creating room");
                    });
            }
        } else {
            if (socketRoomId) {
                socket
                    .emitWithAck("leaveSocketRoom", {
                        roomId: socketRoomId,
                    } as ILeaveSocketRoomPayload)
                    .then(() => {
                        setSocketRoomId("");
                    })
                    .catch(() => {
                        alert("Error cancel room");
                    });
            }
        }
    }, [crumb, socketRoomId, playerInfo]);

    switch (crumb) {
        case "home":
            Component = <Home onAddCrumb={handleAddCrumb} />;
            break;
        case "new game":
            Component = <NewGame socketRoomId={socketRoomId} />;
            break;
        case "play with friend":
            Component = <JoinRoom />;
            break;
        case "instruct":
            Component = <Instruct />;
            break;
    }

    return (
        <>
            <Card className="w-[90%] h-max max-h-[95vh] overflow-auto max-w-lg px-12 py-10 sm:px-20 sm:py-10">
                {breadcrumb.length > 1 && <BackButton onBack={handleBackToPrevCrumb} />}
                {Component}
            </Card>
            <CreatingRoomModal show={showCreatingRoomModal} />
        </>
    );
}
