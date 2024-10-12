import {IoChatbubbleOutline, IoFlagOutline} from "react-icons/io5";
import {Button} from "../UI";
import {useRecoilValue} from "recoil";
import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import {MdOutlineReplay} from "react-icons/md";
import {GoHomeFill} from "react-icons/go";
import {useCallback, useEffect, useState} from "react";
import {ConfirmLeaveRoomModal} from "../Modal";
import socket from "@/libs/socket.io/socketClient";
import {IMessage, ISendMessagePayload} from "@/shared/interfaces";
import ChatBox from "./ChatBox/ChatBox";

interface Props {
    onRequestPlayAgain: () => void;
    onLeaveRoom: () => void;
}

export default function NavBar(props: Props) {
    const myMatchInfo = useRecoilValue(myMatchInfoState)!;
    const [showConfirmLeaveRoomModal, setShowConfirmLeaveRoomModal] = useState<boolean>(false);
    const [showStickerPopup, setShowChatBox] = useState<boolean>(false);

    const handleSendMessage = useCallback(
        async (payload: IMessage) => {
            await socket.emitWithAck("sendMessage", {
                matchId: myMatchInfo.matchId,
                senderId: myMatchInfo.myInfo.id,
                type: payload.type,
                content: payload.content,
            } as ISendMessagePayload);

            setShowChatBox(false);
        },
        [myMatchInfo.matchId, myMatchInfo.myInfo.id]
    );

    useEffect(() => {
        if (myMatchInfo.matchStatus === "completed") {
            setShowConfirmLeaveRoomModal(false);
            setShowChatBox(false);
        }
    }, [myMatchInfo.matchStatus]);

    if (myMatchInfo.matchStatus === "in-progress") {
        return (
            <>
                <div className="w-full mt-10 border-t border-zinc-200 p-2">
                    <div className="w-full h-full flex items-center justify-between">
                        <Button
                            type="button"
                            className="flex gap-2 bg-primary-1 h-9 rounded-lg"
                            onClick={() => setShowConfirmLeaveRoomModal(true)}
                        >
                            <IoFlagOutline className="w-5 h-5" />
                            <span className="text-base">Hủy trận đấu</span>
                        </Button>
                        <div className="relative">
                            <Button
                                type="button"
                                className="relative flex gap-2 bg-primary-1 h-9 rounded-lg"
                                onClick={() => setShowChatBox((state) => !state)}
                            >
                                <IoChatbubbleOutline className="w-7 h-7" />
                            </Button>
                            <ChatBox show={showStickerPopup} onSendMessage={handleSendMessage} />
                        </div>
                    </div>
                </div>
                <ConfirmLeaveRoomModal
                    show={showConfirmLeaveRoomModal}
                    onClose={() => setShowConfirmLeaveRoomModal(false)}
                    onLeaveRoom={props.onLeaveRoom}
                />
            </>
        );
    }

    return (
        <div className="w-full mt-10 border-t border-zinc-200 p-2">
            <div className="w-full h-full flex items-center justify-between">
                <Button type="button" className="flex gap-2 bg-primary-1 h-9 rounded-lg" onClick={props.onLeaveRoom}>
                    <GoHomeFill className="w-5 h-5" />
                    <span className="text-base">Trang chủ</span>
                </Button>

                <Button
                    type="button"
                    className="flex gap-2 bg-primary-5 h-9 rounded-lg"
                    onClick={props.onRequestPlayAgain}
                >
                    <MdOutlineReplay className="w-5 h-5" />
                    <span className="text-base">Chơi lại</span>
                </Button>
            </div>
        </div>
    );
}
