import {memo, useId} from "react";
import BaseModal from "./BaseModal";
import {Button} from "../UI";

interface Props {
    show: boolean;
    onClose: () => void;
    onLeaveRoom: () => void;
}

export default memo(function ConfirmLeaveRoomModal(props: Props) {
    const id = useId();
    return (
        <BaseModal id={id} show={props.show}>
            <div className="sm:px-10 sm:py-5">
                <div className="text-base font-semibold text-center">Bạn có muốn hủy trận đấu không?</div>
                <div className="flex gap-2 mt-10">
                    <Button type="button" className="flex-1 bg-gray-200" onClick={props.onClose}>
                        Đóng
                    </Button>
                    <Button type="button" className="flex-1 bg-primary-5" onClick={props.onLeaveRoom}>
                        Có
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
});
