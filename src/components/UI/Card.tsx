import {memo} from "react";

interface Props {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export default memo(function Card(props: Props) {
    return <div className={`bg-primary-1 rounded-2xl shadow-custom-1  ${props.className || ""}`}>{props.children}</div>;
});
