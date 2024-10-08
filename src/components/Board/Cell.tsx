import Image from "next/image";
import xIcon from "../../images/icons/X-icon.svg";
import oIcon from "../../images/icons/O-icon.svg";
import {MatchStatus, PlayerType, Position} from "@/shared/types";
import {memo, useEffect, useState} from "react";

interface Props {
    position: Position;
    markedBy: PlayerType | null;
    myType: PlayerType;
    matchStatus: MatchStatus;
    isMyTurn: boolean;
    isHighlightMark: boolean;
    onMove: (pos: Position) => void;
}

export default memo(function Cell(props: Props) {
    const [isMoved, setIsMoved] = useState<boolean>(false);

    const {position, markedBy, myType, matchStatus, isMyTurn, isHighlightMark, onMove} = props;

    const marked =
        markedBy !== null ? (
            <Image src={markedBy === "XPlayer" ? xIcon : oIcon} alt="step" width={20} height={20} />
        ) : null;

    const handleClick = () => {
        if (!markedBy && isMyTurn && matchStatus !== "completed" && !isMoved) {
            setIsMoved(true);
        }

        return;
    };

    const cursorClass = isMyTurn && matchStatus !== "completed" ? "cursor-pointer" : "cursor-default";
    const highlightCellClass = isHighlightMark ? (markedBy === "XPlayer" ? "bg-rose-100" : "bg-blue-100") : "";

    useEffect(() => {
        if (isMoved) {
            onMove(position);
        }
    }, [isMoved, onMove, position]);

    useEffect(() => {
        return () => {
            setIsMoved(false);
        };
    }, [matchStatus]);

    return (
        <div
            className={`w-full h-full border ${cursorClass} flex items-center justify-center text-2xl font-bold group select-none ${highlightCellClass}`}
            onClick={handleClick}
        >
            {marked}
            {!marked && isMyTurn && matchStatus !== "completed" ? (
                myType === "OPlayer" ? (
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
});
