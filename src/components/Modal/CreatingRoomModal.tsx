import {memo, useId} from "react";
import BaseModal from "./BaseModal";

interface Props {
    show: boolean;
}

export default memo(function CreatingRoomModal(props: Props) {
    const id = useId();

    return (
        <BaseModal id={id} show={props.show}>
            <div className="py-5">
                <div className="flex items-center justify-center gap-2">
                    <h5 className="font-semibold text-xl">Đang tạo phòng</h5>
                    <span className="loading loading-spinner loading-sm"></span>
                </div>
            </div>
        </BaseModal>
    );
});
