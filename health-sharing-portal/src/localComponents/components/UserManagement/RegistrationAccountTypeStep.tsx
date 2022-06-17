import React from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountType } from '../../types/enums.d';
import { AccountSelectionButtons } from '../Home/AccountSelectionButtons';

interface RegistrationAccountTypeStepProps {
    onChange: (accountType: AccountType) => void;
    onPrevious: () => void;
}

export const RegistrationAccountTypeStep = (props: RegistrationAccountTypeStepProps) => {

    return (
        <>
            <h3 style={{ marginTop: '60px', marginBottom: '30px' }}>{resolveText("SelectAccountType")}:</h3>
            <AccountSelectionButtons
                onAccountTypeSelected={props.onChange}
            />
        </>
    );

}