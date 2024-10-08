import {useCallback, useEffect, useRef, useState} from "react";
import Cell from "./Cell";
import {useRecoilValue} from "recoil";
import socket from "@/libs/socket.io/socketClient";
import {IHighlightMove, IPlayerMovePayload} from "@/shared/interfaces";
import {myMatchInfoState} from "@/libs/recoil/atoms/myMatchInfoAtom";
import {PlayerType, Position} from "@/shared/types";

interface Props {
    numberXCells: number;
    numberYCells: number;
    highlightMoves: IHighlightMove[];
    myMoves: Position[];
    opponentMoves: Position[];
}

export default function Board(props: Props) {
    const myMatchInfo = useRecoilValue(myMatchInfoState)!;
    const [boardMatrix, setBoardMatrix] = useState<Array<Array<number>> | null>(null);

    const {matchId, myInfo, opponentInfo, currentTurn, matchStatus} = myMatchInfo;

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleMove = useCallback(
        async (position: Position) => {
            const isCellOccupied =
                props.myMoves.some((p: Position) => p.x === position.x && p.y === position.y) ||
                props.myMoves.some((p: Position) => p.x === position.x && p.y === position.y);

            if (!isCellOccupied && matchStatus !== "completed") {
                const payload: IPlayerMovePayload = {
                    matchId,
                    position,
                    player: myInfo,
                };
                await socket.emitWithAck("playerMove", payload);
            }
        },
        [matchId, matchStatus, myInfo, props.myMoves]
    );

    const drawCells = (): JSX.Element[] => {
        if (!boardMatrix) return [];

        const myMoveSet = new Set(props.myMoves.map((position: Position) => `${position.y}-${position.x}`));
        const opponentMoveSet = new Set(props.opponentMoves.map((position: Position) => `${position.y}-${position.x}`));

        return boardMatrix.flatMap((xRow, y) =>
            xRow.map((x) => {
                const key = `${y}-${x}`;
                const markedCell: PlayerType | null = myMoveSet.has(key)
                    ? myInfo.playerType
                    : opponentMoveSet.has(key)
                    ? opponentInfo.playerType
                    : null;
                const isHighlightMark = props.highlightMoves.some(
                    (highlight) => highlight.position.x === x && highlight.position.y === y
                );

                return (
                    <Cell
                        key={key}
                        position={{x, y}}
                        markedBy={markedCell}
                        isMyTurn={currentTurn === "me"}
                        myType={myInfo.playerType}
                        matchStatus={matchStatus}
                        isHighlightMark={isHighlightMark}
                        onMove={handleMove}
                    />
                );
            })
        );
    };

    useEffect(() => {
        const container = containerRef.current!;

        const containerHeight = container.clientHeight;
        const containerWidth = container.clientWidth;

        const contentHeight = container.scrollHeight;
        const contentWidth = container.scrollWidth;

        const scrollTop = (contentHeight - containerHeight) / 2;
        const scrollLeft = (contentWidth - containerWidth) / 2;

        container.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: "auto",
        });
    }, []);

    // Generate matrix once when component mounts or when the number of cells changes
    useEffect(() => {
        const matrix = Array.from({length: props.numberYCells}, (_, y) =>
            Array.from({length: props.numberXCells}, (_, x) => x)
        );

        setBoardMatrix(matrix);
    }, [props.numberXCells, props.numberYCells]);

    useEffect(() => {
        if (myMatchInfo!.winner) {
            console.log(myMatchInfo!.winner === "me" ? "You win!" : "You lose!");
        }
    }, [myMatchInfo]);

    return (
        <div ref={containerRef} className="flex-1 overflow-auto">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${props.numberXCells}, 2.5rem)`,
                    gridTemplateRows: `repeat(${props.numberYCells}, 2.5rem)`,
                }}
            >
                {myMatchInfo && drawCells()}
            </div>
        </div>
    );
}
