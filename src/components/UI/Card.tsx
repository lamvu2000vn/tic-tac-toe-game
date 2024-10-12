import {forwardRef, memo} from "react";

interface Props {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export default memo(
    forwardRef(function Card(props: Props, ref: React.ForwardedRef<HTMLDivElement>) {
        return (
            <div ref={ref} className={`bg-primary-1 rounded-2xl shadow-custom-1  ${props.className || ""}`}>
                {props.children}
            </div>
        );
    })
);
