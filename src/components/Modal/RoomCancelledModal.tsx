import {memo, useId} from "react";
import BaseModal from "./BaseModal";
import {Button} from "../UI";
import {useRouter} from "next/navigation";
import {useSetRecoilState} from "recoil";
import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";

interface Props {
    show: boolean;
}

export default memo(function RoomCancelledModal(props: Props) {
    const setMyMatchInfo = useSetRecoilState(myMatchInfoState);
    const id = useId();
    const router = useRouter();

    const handleClick = () => {
        setMyMatchInfo(null);
        router.push("/");
    };

    return (
        <BaseModal show={props.show} id={id}>
            <div className="sm:px-10 sm:py-5">
                <div className="text-center font-semibold">Đối thủ đã rời khỏi phòng.</div>
                <div className="flex justify-center mt-10">
                    <Button type="button" className="w-28 bg-primary-5" onClick={handleClick}>
                        OK
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
});
