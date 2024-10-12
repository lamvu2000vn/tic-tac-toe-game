import {FaRegSmile} from "react-icons/fa";
import {IoSend} from "react-icons/io5";
import {Field, Formik} from "formik";
import * as Yup from "yup";
import {Button} from "@/components/UI";
import {IMessage} from "@/shared/interfaces";

interface Props {
    onShowStickersPopup: () => void;
    onSendMessage: (payload: IMessage) => void;
}

export default function Chat(props: Props) {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = "auto"; // Reset chiều cao để đo lại
        textarea.style.height = `${textarea.scrollHeight}px`; // Điều chỉnh chiều cao
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            return props.onSendMessage({
                type: "message",
                content: e.currentTarget.value,
            });
        }
    };

    return (
        <Formik
            initialValues={{
                content: "",
            }}
            validationSchema={Yup.object({
                content: Yup.string().max(100, "Nội dung tin nhắn tối đa 100 ký tự"),
            })}
            onSubmit={async (values) => {
                if (values.content) {
                    props.onSendMessage({
                        type: "message",
                        content: values.content,
                    });
                }
            }}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className="flex items-end gap-2 p-2">
                        <Button type="button" className="bg-primary-1 !px-3" onClick={props.onShowStickersPopup}>
                            <FaRegSmile className="w-5 h-5" />
                        </Button>
                        <Field name="content">
                            {({field, meta}) => (
                                <>
                                    <textarea
                                        {...field}
                                        onInput={handleInput}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập tin nhắn..."
                                        rows={1}
                                        maxLength={100}
                                        className="w-full min-h-5"
                                    />
                                    {meta.touched && meta.error && (
                                        <small className="text-sm text-red-400">*{meta.error}</small>
                                    )}
                                </>
                            )}
                        </Field>
                        <Button type="submit" className="!px-3">
                            <IoSend />
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );
}
