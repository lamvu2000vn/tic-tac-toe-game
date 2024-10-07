import {SubmitButton} from "@/components/UI";
import socket from "@/libs/socket.io/socketClient";
import {IJoinSocketRoomPayload, IWSResponse} from "@/shared/interfaces";
import {showToast} from "@/utils/clientUtils";
import {Field, Formik} from "formik";
import {useState} from "react";
import * as Yup from "yup";

export default function JoinRoom() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleJoinRoom = async (values: {roomId: string}) => {
        const payload: IJoinSocketRoomPayload = {
            roomId: values.roomId,
        };

        try {
            const response = (await socket.emitWithAck("joinSocketRoom", payload)) as IWSResponse;

            if (response.status === "ok") {
                console.log("Join room successfully");
            } else {
                switch (response.message) {
                    case "room not found":
                        showToast("Không tìm thấy trận đấu", "info");
                        break;
                    case "missing or full players":
                        showToast("Không thể tham gia vào trận đấu", "info");
                        break;
                    case "error":
                    default:
                        showToast("Đã có lỗi xảy ra", "error");
                        break;
                }
                setIsSubmitting(false);
            }
        } catch (err) {
            alert("Lỗi socket");
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{roomId: ""}}
                validationSchema={Yup.object({
                    roomId: Yup.string().max(20, "ID phòng không hợp lệ").required("Vui lòng nhập ID phòng"),
                })}
                onSubmit={async (values) => {
                    setIsSubmitting(true);
                    handleJoinRoom(values);
                }}
            >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex gap-3 mb-4">
                            <label htmlFor="roomId" className="h-12 flex flex-shrink-0 items-center font-semibold">
                                ID Phòng:
                            </label>
                            <div className="flex flex-col gap-1 flex-1">
                                <Field
                                    type="text"
                                    id="roomId"
                                    name="roomId"
                                    placeholder="Nhập mã phòng"
                                    autoComplete="false"
                                />
                                {formik.touched.roomId && formik.errors.roomId && (
                                    <small className="text-sm text-red-400">*{formik.errors.roomId}</small>
                                )}
                            </div>
                        </div>
                        <SubmitButton isSubmitting={isSubmitting} value="Vào phòng" />
                    </form>
                )}
            </Formik>
        </div>
    );
}
