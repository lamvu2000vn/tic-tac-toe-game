import Button from "./Button";

interface SubmitButtonProps {
    isSubmitting: boolean;
    value: string;
    className?: string;
}

export default function SubmitButton(props: SubmitButtonProps) {
    if (props.isSubmitting) {
        return (
            <Button type="submit" className={`bg-primary-5 w-full ${props.className || ""}`} disabled={true}>
                <span className="loading loading-spinner mr-2"></span>
                {props.value}...
            </Button>
        );
    }

    return (
        <Button type="submit" className={`w-full bg-primary-5 ${props.className || ""}`}>
            <span>{props.value}</span>
        </Button>
    );
}
