import React from 'react';
import { resolveText } from '../helpers/Globalizer';
import { AsyncButton } from './AsyncButton';

interface StoreButtonProps {
    type?: string;
    form?: string;
    onClick?: () => void;
    isStoring: boolean;
}

export const StoreButton = (props: StoreButtonProps) => {

    return (
        <AsyncButton
            type={props.type}
            form={props.form}
            onClick={props.onClick}
            className="m-2"
            activeText={resolveText('Store')}
            executingText={resolveText('Storing...')}
            isExecuting={props.isStoring}
        />
    );

}