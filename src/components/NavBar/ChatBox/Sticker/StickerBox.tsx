import StickerItem from "./StickerItem";
import {memo} from "react";
import {IMessage} from "@/shared/interfaces";

interface Props {
    onSendMessage: (payload: IMessage) => void;
}

const stickerUrls = [
    "/images/stickers/laugh-1.webp",
    "/images/stickers/laugh-2.webp",
    "/images/stickers/laugh-3.webp",
    "/images/stickers/laugh-4.webp",
    "/images/stickers/laugh-5.webp",
    "/images/stickers/like-1.webp",
    "/images/stickers/like-2.webp",
    "/images/stickers/cool-1.webp",
    "/images/stickers/cool-2.webp",
    "/images/stickers/cool-3.webp",
    "/images/stickers/cool-4.webp",
    "/images/stickers/cool-5.webp",
    "/images/stickers/nervous-1.webp",
    "/images/stickers/nervous-2.webp",
    "/images/stickers/nervous-3.webp",
    "/images/stickers/nervous-4.webp",
    "/images/stickers/nervous-5.webp",
    "/images/stickers/happy-1.webp",
    "/images/stickers/happy-2.webp",
    "/images/stickers/happy-3.webp",
    "/images/stickers/happy-4.webp",
    "/images/stickers/happy-5.webp",
    "/images/stickers/angry-1.webp",
    "/images/stickers/angry-2.webp",
    "/images/stickers/angry-3.webp",
    "/images/stickers/angry-4.webp",
    "/images/stickers/angry-5.webp",
    "/images/stickers/cry-1.webp",
    "/images/stickers/cry-2.webp",
    "/images/stickers/cry-3.webp",
    "/images/stickers/cry-4.webp",
    "/images/stickers/cry-5.webp",
    "/images/stickers/bye-1.webp",
    "/images/stickers/bye-2.webp",
    "/images/stickers/bye-3.webp",
    "/images/stickers/bye-4.webp",
    "/images/stickers/bye-5.webp",
    "/images/stickers/send-love-1.webp",
    "/images/stickers/send-love-2.webp",
    "/images/stickers/send-love-3.webp",
    "/images/stickers/send-love-4.webp",
    "/images/stickers/thumb-down-1.webp",
    "/images/stickers/thumb-down-2.webp",
];

export default memo(function StickerBox(props: Props) {
    return (
        <div className="flex-grow px-4 my-4 overflow-auto">
            <div className="columns-3">
                {stickerUrls.map((stickerUrl, index) => (
                    <div
                        key={index}
                        className="w-full p-2 bg-primary-1 cursor-pointer hover:brightness-95 rounded-2xl"
                        onClick={() => props.onSendMessage({type: "sticker", content: stickerUrl})}
                    >
                        <StickerItem key={index} stickerUrl={stickerUrl} />
                    </div>
                ))}
            </div>
        </div>
    );
});
