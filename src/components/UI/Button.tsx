interface Props {
    children: React.ReactNode;
    type: "button" | "submit" | "reset";
    className?: string;
    id?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
}

export default function Button(props: Props) {
    return (
        <button
            type={props.type}
            id={props.id}
            className={`relative border-none outline-none h-[2.625rem] px-5 font-semibold rounded-2xl flex items-center justify-center
                gap-2 ease-in-out duration-150 active:scale-95 hover:brightness-90 disabled:scale-100 disabled:cursor-default
                hover:disabled:brightness-100 disabled:opacity-70 ${props.className || ""}`}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
