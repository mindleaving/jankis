import React from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountType } from '../../types/enums.d';
import { AccountSelectionButton } from './AccountSelectionButton';

interface AccountSelectionButtonsProps {
    variant?: string;
    onAccountTypeSelected: (accountType: AccountType) => void;
}

export const AccountSelectionButtons = (props: AccountSelectionButtonsProps) => {

    return (
        <div className="d-flex align-items-center">
            <div className="d-flex align-items-stretch mx-auto">
                {[ AccountType.Sharer, AccountType.HealthProfessional, AccountType.Researcher ].map(accountType => (
                    <AccountSelectionButton
                        key={accountType}
                        variant={props.variant}
                        title={resolveText(`AccountType_${accountType}`)}
                        imageUrl={`/img/${accountType.toLowerCase()}.jpg`}
                        imageAltText={resolveText(`${accountType}_ImageAltText`)}
                        onClick={() => props.onAccountTypeSelected(accountType)}
                    />
                ))}
            </div>
        </div>
    );

}