import {Card} from "@/components/UI";
import {memo, useCallback, useRef, useState} from "react";
import {Transition} from "react-transition-group";
import Chat from "./Chat";
import BackButton from "@/components/pages/Home/BackButton";
import StickerPopup from "./Sticker/StickerBox";
import {IMessage} from "@/shared/interfaces";

interface Props {
    show: boolean;
    onSendMessage: (payload: IMessage) => void;
}

type Breadcrumbs = "chat" | "stickers";

const defaultStyle: React.CSSProperties = {
    transform: "translate(0, 2rem)",
    opacity: "0",
    transition: "all .3s ease-in-out",
};

const transitionStyles: {
    entering: React.CSSProperties;
    entered: React.CSSProperties;
    exiting: React.CSSProperties;
    exited: React.CSSProperties;
} = {
    entering: {opacity: 1, transform: "translate(0, 0)"},
    entered: {opacity: 1, transform: "translate(0, 0)"},
    exiting: {opacity: 0, transform: "translate(0, 2rem)"},
    exited: {opacity: 0, transform: "translate(0, 2rem)"},
};

export default memo(function ChatBox(props: Props) {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumbs[]>(["chat"]);
    const nodeRef = useRef<HTMLDivElement | null>(null);

    const currentCrumb = breadcrumbs[breadcrumbs.length - 1];
    let component: JSX.Element | null = null;

    const handleAddCrumb = useCallback((crumb: Breadcrumbs) => {
        setBreadcrumbs((state) => [...state, crumb]);
    }, []);

    const handleBackToPrevCrumb = useCallback(() => {
        setBreadcrumbs((state) => state.slice(0, -1));
    }, []);

    const handleExisted = () => {
        setBreadcrumbs(["chat"]);
    };

    switch (currentCrumb) {
        case "stickers":
            component = <StickerPopup onSendMessage={props.onSendMessage} />;
            break;
        case "chat":
        default:
            component = (
                <Chat onShowStickersPopup={() => handleAddCrumb("stickers")} onSendMessage={props.onSendMessage} />
            );
    }

    return (
        <Transition nodeRef={nodeRef} in={props.show} timeout={250} mountOnEnter unmountOnExit onExited={handleExisted}>
            {(state) => (
                <div
                    ref={nodeRef}
                    className="absolute right-0 bottom-full"
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}
                >
                    <Card className="mb-2 w-[20rem] max-h-[22rem] sm:w-[24rem] sm:max-h-[26rem] overflow-hidden flex flex-col">
                        {breadcrumbs.length > 1 && (
                            <div className="w-full px-2 pt-2">
                                <BackButton onBack={handleBackToPrevCrumb} />
                            </div>
                        )}
                        {component}
                    </Card>
                </div>
            )}
        </Transition>
    );
});
