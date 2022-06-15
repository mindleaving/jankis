import React from 'react';
import { AccountType } from '../../types/enums.d';
import { AccountSelectionButtons } from '../Home/AccountSelectionButtons';

interface RegistrationAccountTypeStepProps {
    onChange: (accountType: AccountType) => void;
    onPrevious: () => void;
}

export const RegistrationAccountTypeStep = (props: RegistrationAccountTypeStepProps) => {

    return (
        <AccountSelectionButtons
            onAccountTypeSelected={props.onChange}
        />
    );

}