"use client";

import {NewPlayerModal} from "@/components/Modal";
import {Background, LoadingScreen} from "@/components/UI";
import {playerInfoState} from "@/libs/recoil/atoms/playerInfoAtom";
import socket from "@/libs/socket.io/socket";
import {
    IConnectPlayerPayload,
    IConnectPlayerWSResponse,
    INewPlayerPayload,
    INewPlayerWSResponse,
    IPlayerInfo,
} from "@/shared/interfaces";
import {getPlayerInfoFromStorage, setPlayerInfoIntoStorage} from "@/utils/clientUtils";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import Toastify from "@/components/Toastify/Toastify";

interface Props {
    children: React.ReactNode;
}

type Transport = "N/A" | "polling" | "websocket";

export default function App(props: Props) {
    const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoState);
    const [transport, setTransport] = useState<Transport>("N/A");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isPageReady, setIsPageReady] = useState<boolean>(false);
    const [checkPlayer, setCheckPlayer] = useState<boolean>(false);

    const handleNewPlayer = useCallback(
        async (name: string) => {
            const payload: INewPlayerPayload = {
                name,
            };

            const response = (await socket.emitWithAck("newPlayer", payload)) as INewPlayerWSResponse;

            if (response.status === "ok") {
                const player = response.data.player!;
                setPlayerInfoIntoStorage(player);
                setPlayerInfo(player);
                setCheckPlayer(true);
            } else {
                console.log("Create new player failed");
            }
        },
        [setPlayerInfo]
    );

    const handleConnectPlayer = async (player: IPlayerInfo): Promise<IPlayerInfo | null> => {
        try {
            const response = (await socket.emitWithAck("connectPlayer", {
                player,
            } as IConnectPlayerPayload)) as IConnectPlayerWSResponse;

            if (response.status === "ok") {
                return response.data.playerConnected!;
            }

            return null;
        } catch (err) {
            console.log("🚀 ~ handleConnectPlayer ~ err:", err);
            return null;
        }
    };

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name as Transport);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    // Connect the player to the server
    useEffect(() => {
        if (transport !== "websocket") return;

        (async () => {
            const playerStored = getPlayerInfoFromStorage();

            if (playerStored) {
                const playerConnected = await handleConnectPlayer(playerStored);

                if (playerConnected) {
                    setPlayerInfo(playerConnected);
                }
            }

            setCheckPlayer(true);
            setIsPageReady(true);
        })();
    }, [setPlayerInfo, transport]);

    if (transport !== "websocket" || !isPageReady) return <LoadingScreen />;

    if (checkPlayer && !playerInfo)
        return (
            <Background>
                <NewPlayerModal show={true} onNewPlayer={handleNewPlayer} />;
            </Background>
        );
    return (
        <Background>
            {props.children}
            <Toastify />
        </Background>
    );
}
