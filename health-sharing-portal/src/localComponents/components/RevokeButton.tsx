import React, { useState } from 'react';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { confirmAlert } from 'react-confirm-alert';

interface RevokeButtonProps {
    onClick: () => Promise<void>;
    disabled?: boolean;
    requireConfirm: boolean;
    confirmDialogTitle?: string;
    confirmDialogMessage?: string;
}

export const RevokeButton = (props: RevokeButtonProps) => {

    if(props.requireConfirm && !(props.confirmDialogTitle && props.confirmDialogMessage)) {
        throw new Error("If revoke confirmation is required, title and message for the confirmation dialog must be specified");
    }

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const revoke = async () => {
        setIsSubmitting(true);
        try {
            await props.onClick();
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("RevokeButton_CouldNotRevoke"));
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const confirmRevoke = () => {
        confirmAlert({
            title: props.confirmDialogTitle,
            message: props.confirmDialogMessage,
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Revoke_No'),
                    onClick: () => {}
                },
                {
                    label: resolveText('Revoke_Yes'),
                    onClick: revoke
                }
            ]
        });
    }

    return (
        <AsyncButton
            variant="danger"
            activeText={resolveText("Revoke")}
            executingText={resolveText("Submitting...")}
            isExecuting={isSubmitting}
            onClick={props.requireConfirm ? confirmRevoke : revoke}
            disabled={props.disabled}
        />
    );

}