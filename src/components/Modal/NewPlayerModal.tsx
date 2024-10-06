import {memo, useId, useState} from "react";
import BaseModal from "./BaseModal";
import {Field, Formik} from "formik";
import * as Yup from "yup";
import {SubmitButton} from "../UI";

interface Props {
    show: boolean;
    onNewPlayer: (playerName: string) => void;
}

export default memo(function NewPlayerModal(props: Props) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const randomId = useId();

    return (
        <BaseModal id={randomId} show={props.show}>
            <Formik
                initialValues={{
                    name: "",
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .max(20, "Tên người chơi tối đa 20 ký tự")
                        .required("Vui lòng nhập tên người chơi"),
                })}
                onSubmit={async (values) => {
                    setIsSubmitting(true);
                    props.onNewPlayer(values.name);
                }}
            >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit} className="w-full sm:p-10">
                        <div className="flex flex-start gap-3 mb-4 flex-nowrap">
                            <label htmlFor="name" className="h-12 flex-shrink-0 font-semibold flex items-center">
                                Bạn là:
                            </label>
                            <div className="flex flex-1 flex-col gap-2">
                                <Field type="text" id="name" name="name" placeholder="Tên người chơi" />
                                {formik.touched.name && formik.errors.name && (
                                    <small className="text-sm text-red-400">*{formik.errors.name}</small>
                                )}
                            </div>
                        </div>
                        <SubmitButton isSubmitting={isSubmitting} value="Tạo mới" />
                    </form>
                )}
            </Formik>
        </BaseModal>
    );
});
