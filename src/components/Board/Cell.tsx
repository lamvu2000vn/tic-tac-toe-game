import Image from "next/image";
import xIcon from "../../images/icons/X-icon.svg";
import oIcon from "../../images/icons/O-icon.svg";
import {MatchStatus, PlayerType, Position} from "@/shared/types";

interface Props {
    position: Position;
    markedBy: PlayerType | null;
    myType: PlayerType;
    isMyTurn: boolean;
    matchStatus: MatchStatus;
    highlightMark: PlayerType | null;
    onMove: (pos: Position) => void;
}

export default function Cell(props: Props) {
    const marked =
        props.markedBy !== null ? (
            <Image src={props.markedBy === "XPlayer" ? xIcon : oIcon} alt="step" width={20} height={20} />
        ) : null;

    const handleClick = () => {
        if (props.isMyTurn && props.matchStatus !== "completed") {
            return props.onMove(props.position);
        }

        return;
    };

    const cursorClass = props.isMyTurn && props.matchStatus !== "completed" ? "cursor-pointer" : "cursor-default";
    const highlightCellClass =
        props.highlightMark === "XPlayer" ? "bg-rose-100" : props.highlightMark === "OPlayer" ? "bg-blue-100" : "";

    return (
        <div
            className={`w-full h-full border ${cursorClass} flex items-center justify-center text-2xl font-bold group ${highlightCellClass}`}
            onClick={handleClick}
        >
            {marked}
            {!marked && props.isMyTurn && props.matchStatus !== "completed" ? (
                props.myType === "OPlayer" ? (
                    <Image
                        src={oIcon}
                        alt="step"
                        width={20}
                        height={20}
                        className="hidden group-hover:block opacity-40"
                    />
                ) : (
                    <Image
                        src={xIcon}
                        alt="step"
                        width={20}
                        height={20}
                        className="hidden group-hover:block opacity-40"
                    />
                )
            ) : null}
        </div>
    );
}
