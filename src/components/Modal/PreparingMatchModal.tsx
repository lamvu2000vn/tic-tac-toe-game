import {memo, useId} from "react";
import BaseModal from "./BaseModal";

interface Props {
    show: boolean;
}

export default memo(function PreparingMatchModal(props: Props) {
    const id = useId();

    return (
        <BaseModal id={id} show={props.show}>
            <div className="sm:py-5">
                <div className="flex items-center justify-center mb-5">
                    <div className="flex gap-4">
                        <span className="loading loading-ring w-14 text-blue-500"></span>
                        <span className="loading loading-ring w-14 text-yellow-500"></span>
                        <span className="loading loading-ring w-14 text-rose-500"></span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <h5 className="font-semibold">Đang chuẩn bị trận đấu...</h5>
                </div>
            </div>
        </BaseModal>
    );
});
