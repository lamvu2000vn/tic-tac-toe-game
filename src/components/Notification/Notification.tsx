interface Props {
    children: React.ReactNode;
}

export default function Notification(props: Props) {
    return (
        <div className="fixed left-1/2 top-0 -translate-x-1/2 z-50">
            <div className="w-max max-w-[90vw] p-4 rounded-2xl bg-primary-1 shadow-lg">{props.children}</div>
        </div>
    );
}
