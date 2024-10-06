import {Button} from "@/components/UI";
import {useEffect, useRef, useState} from "react";
import {FaClipboardCheck, FaRegCopy} from "react-icons/fa";

interface Props {
    socketRoomId: string;
}

export default function NewGame(props: Props) {
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    const timerId = useRef<NodeJS.Timeout | null>(null);

    const handleCopyToClipboard = () => {
        navigator.clipboard
            .writeText(props.socketRoomId)
            .then(() => {
                setCopySuccess(true);
            })
            .catch((err) => {
                alert(err);
            });
    };

    useEffect(() => {
        if (copySuccess) {
            timerId.current = setTimeout(() => {
                setCopySuccess(false);
            }, 3000);
        }

        return () => {
            timerId.current && clearTimeout(timerId.current);
        };
    }, [copySuccess]);

    return (
        <div>
            <div className="w-full mb-5">
                <span className="text-xl">
                    Copy <strong>ID</strong> bên dưới gửi cho bạn bè cùng chơi
                </span>
            </div>
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <h5 className="font-semibold">ID</h5>
                </div>
                <div className="flex gap-2">
                    <div
                        className="flex-1 overflow-hidden h-12 rounded-lg flex items-center px-3 justify-center bg-gray-200"
                        title={props.socketRoomId}
                    >
                        <div className="truncate">{props.socketRoomId}</div>
                    </div>
                    <Button
                        type="button"
                        className="bg-primary-5 w-28 rounded-lg"
                        onClick={handleCopyToClipboard}
                        disabled={!props.socketRoomId}
                    >
                        {copySuccess ? (
                            <FaClipboardCheck className="w-6 h-6" />
                        ) : (
                            <>
                                <FaRegCopy className="w-5 h-5" />
                                <h5>Copy</h5>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
