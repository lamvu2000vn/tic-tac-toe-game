import {IoFlagOutline} from "react-icons/io5";
import {Button} from "../UI";
import {useRecoilValue} from "recoil";
import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import {MdOutlineReplay} from "react-icons/md";
import {GoHomeFill} from "react-icons/go";
import {useEffect, useState} from "react";
import {ConfirmLeaveRoomModal} from "../Modal";

interface Props {
    onRequestPlayAgain: () => void;
    onLeaveRoom: () => void;
}

export default function NavBar(props: Props) {
    const myMatchInfo = useRecoilValue(myMatchInfoState)!;
    const [showConfirmLeaveRoomModal, setShowConfirmLeaveRoomModal] = useState<boolean>(false);

    useEffect(() => {
        if (myMatchInfo.matchStatus === "completed") {
            setShowConfirmLeaveRoomModal(false);
        }
    }, [myMatchInfo.matchStatus]);

    if (myMatchInfo.matchStatus === "in-progress") {
        return (
            <>
                <div className="w-full border-t border-zinc-200 p-2">
                    <div className="w-full h-full flex items-center justify-between">
                        <Button
                            type="button"
                            className="flex gap-2 bg-primary-1 h-9 rounded-lg"
                            onClick={() => setShowConfirmLeaveRoomModal(true)}
                        >
                            <IoFlagOutline className="w-5 h-5" />
                            <span className="text-base">Hủy trận đấu</span>
                        </Button>
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
        <div className="w-full border-t border-zinc-200 p-2">
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
