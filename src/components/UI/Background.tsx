interface Props {
    children: React.ReactNode;
}

export default function Background(props: Props) {
    return (
        <div className="fixed left-0 top-0 w-full h-full bg-primary-4 overflow-hidden flex items-center justify-center">
            {props.children}
        </div>
    );
}
