import {useEffect, useRef} from "react";

interface Props {
    children: React.ReactNode;
    id: string;
    show: boolean;
}

export default function BaseModal(props: Props) {
    const ref = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        props.show && ref.current!.showModal();
        !props.show && ref.current!.close();
    }, [props.show]);

    return (
        <dialog ref={ref} id={props.id} className="modal">
            <div className="modal-box bg-white">{props.children}</div>
        </dialog>
    );
}
