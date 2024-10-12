import Image from "next/image";

interface Props {
    stickerUrl: string;
    width?: number;
    height?: number;
}

export default function StickerItem(props: Props) {
    return (
        <Image
            src={props.stickerUrl}
            width={0}
            height={0}
            className="w-full"
            alt={props.stickerUrl}
            loading="lazy"
            style={{width: props.width, height: props.height}}
            unoptimized={true}
        />
    );
}
