import {PlayerType} from "@/shared/types";
import {FaUser} from "react-icons/fa";

interface Props {
    playerType: PlayerType;
}

export default function Avatar(props: Props) {
    return (
        <div
            className={`h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                props.playerType === "XPlayer" ? "bg-rose-500" : "bg-blue-500"
            }  rounded-full`}
        >
            <FaUser className="w-5 h-5 text-white" />
        </div>
    );
}
