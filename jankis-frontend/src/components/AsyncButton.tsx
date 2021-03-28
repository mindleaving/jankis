import React from "react"
import Button from "react-bootstrap/esm/Button"

interface AsyncButtonProps {
    type?: string;
    form?: string;
    onClick?: () => void;
    variant?: string;
    isExecuting?: boolean;
    activeText: string;
    executingText: string;
    className?: string;
    disabled?: boolean;
}

export const AsyncButton = (props: AsyncButtonProps) => {
    return (
        <Button
            type={props.type}
            form={props.form}
            className={props.className}
            variant={props.variant}
            onClick={props.onClick}
            disabled={props.isExecuting || props.disabled}
        >
            {!props.isExecuting
                ? <>{props.activeText}</>
                : <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> {props.executingText}</>
            }
        </Button>
    )
}