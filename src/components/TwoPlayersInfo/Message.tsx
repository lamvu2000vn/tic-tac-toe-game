import {IMessage} from "@/shared/interfaces";
import StickerItem from "../NavBar/ChatBox/Sticker/StickerItem";
import {Card} from "../UI";
import {Transition} from "react-transition-group";
import {useContext, useRef} from "react";
import {BoardContext} from "@/app/[matchId]/page";

interface Props {
    show: boolean;
    message: IMessage | null;
    side: "left" | "right";
}

export default function Message(props: Props) {
    const boardContext = useContext(BoardContext);
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const boardRef = boardContext?.boardRef.current;
    const boardRect = boardRef?.getBoundingClientRect();

    const isLeftSide = props.side === "left";
    const nonRadius = isLeftSide ? "rounded-tl-none" : "rounded-tr-none";
    const justifyContent = isLeftSide ? "justify-start" : "justify-end";
    const padding = isLeftSide ? "pl-16 pr-2" : "pr-16 pl-2";
    const translateXStyled = isLeftSide ? "translateX(-8rem)" : "translateX(8rem)";

    const defaultStyle: React.CSSProperties = {
        left: isLeftSide ? boardRect?.left : "calc(50% + 28px)",
        right: isLeftSide ? "calc(50% + 28px)" : boardRect?.left,
        transform: `${translateXStyled} translateY(-2rem)`,
        opacity: "0",
        transition: "all 300ms ease-in-out",
    };

    const transitionStyles: {
        entering: React.CSSProperties;
        entered: React.CSSProperties;
        exiting: React.CSSProperties;
        exited: React.CSSProperties;
    } = {
        entering: {
            opacity: 1,
            transform: `translateY(0)`,
        },
        entered: {
            opacity: 1,
            transform: `translateY(0)`,
        },
        exiting: {
            opacity: 0,
            transform: `translateY(-2rem)`,
        },
        exited: {
            opacity: 0,
            transform: `translateY(-2rem)`,
        },
    };

    return (
        <Transition nodeRef={nodeRef} in={props.show} timeout={300} mountOnEnter unmountOnExit>
            {(state) => (
                <div
                    ref={nodeRef}
                    className={`fixed z-10 top-9`}
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}
                >
                    {props.message && (
                        <div className={`w-full flex ${padding} ${justifyContent}`}>
                            <Card className={`${nonRadius} p-2 overflow-hidden`}>
                                {props.message.type === "sticker" ? (
                                    <StickerItem stickerUrl={props.message!.content} width={84} />
                                ) : (
                                    <span className="text-wrap break-words">{props.message.content}</span>
                                )}
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </Transition>
    );
}
