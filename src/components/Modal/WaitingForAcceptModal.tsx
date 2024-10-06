import {memo, useId} from "react";
import BaseModal from "./BaseModal";
import {Button} from "../UI";

interface Props {
    show: boolean;
    onCancelWaiting: () => void;
}

export default memo(function WaitingForAcceptModal(props: Props) {
    const id = useId();

    return (
        <BaseModal id={id} show={props.show}>
            <div className="flex items-end justify-center gap-2 text-lg font-semibold my-5">
                Đang đợi đối thủ phản hồi
                <span className="loading loading-dots loading-sm"></span>
            </div>
            <div className="modal-action justify-center">
                <Button type="button" className="bg-gray-200" onClick={props.onCancelWaiting}>
                    Hủy
                </Button>
            </div>
        </BaseModal>
    );
});
