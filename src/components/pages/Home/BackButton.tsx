import {MdKeyboardArrowLeft} from "react-icons/md";

interface Props {
    onBack: React.MouseEventHandler;
}

export default function BackButton(props: Props) {
    return (
        <div className="flex mb-4">
            <button type="button" className="btn btn-ghost btn-sm p-0" onClick={props.onBack}>
                <MdKeyboardArrowLeft className="w-8 h-8" />
            </button>
        </div>
    );
}
