import {memo, useId} from "react";
import BaseModal from "./BaseModal";
import {IPlayerInfo} from "@/shared/interfaces";
import {Button} from "../UI";

interface Props {
    show: boolean;
    requester: IPlayerInfo | null;
    onDeclineInvitation: () => void;
    onAcceptInvitation: () => void;
}

export default memo(function InvitePlayAgainModal(props: Props) {
    const id = useId();

    return (
        <BaseModal id={id} show={props.show}>
            <div className="sm:px-10 sm:py-5">
                <div className="font-bold text-xl mb-5">Bạn ơi !</div>
                <div className="text-base">
                    <strong>{props.requester?.name}</strong> muốn chơi lại với bạn.
                </div>
                <div className="flex items-center justify-center mt-10 gap-2">
                    <Button type="button" className="flex-1 bg-gray-200" onClick={props.onDeclineInvitation}>
                        Từ chối
                    </Button>
                    <Button type="button" className="flex-1 bg-primary-5" onClick={props.onAcceptInvitation}>
                        Đồng ý
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
});
