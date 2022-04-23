import { useState } from 'react';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { AccountType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { MenschIdWidget } from '../../../sharedHealthComponents/components/Widgets/MenschIdWidget';
import { useParams } from 'react-router-dom';
import { FlatpickrDateWidget } from '../../../sharedHealthComponents/components/Widgets/FlatpickrDateWidget';

interface CreateAccountFormProps {
    onAccountCreated: () => void;
}

export const CreateAccountForm = (props: CreateAccountFormProps) => {

    const { accountType: matchedAccountType} = useParams();
    const [ accountType, setAccountType ] = useState<AccountType | undefined>(matchedAccountType as AccountType);

    const store = async (person: Models.Person) => {
        if(!accountType || !person) {
            return;
        }
        const accountCreationInfo: ViewModels.AccountCreationInfo = {
            accountType: accountType,
            person: person
        };
        await sendPostRequest(
            'api/accounts',
            resolveText("Account_CouldNotStore"),
            accountCreationInfo,
            () => props.onAccountCreated());
    }

    return (
        <>
            <RowFormGroup required
                label={resolveText("AccountType")}
                as="select"
                value={accountType ?? ''}
                onChange={setAccountType}
            >
                <option value="" disabled>{resolveText("PleaseSelect...")}</option>
                {[ AccountType.Sharer, AccountType.HealthProfessional, AccountType.Researcher ].map(x => (
                    <option key={x} value={x}>{resolveText(`AccountType_${x}`)}</option>
                ))}
            </RowFormGroup>
            <GenericTypeCreateEditPage
                typeName='person'
                onSubmit={store}
                uiSchema={{
                    "id": {
                        "ui:widget": MenschIdWidget
                    },
                    "personId": {
                        "ui:widget": "hidden"
                    },
                    "birthDate": {
                        "ui:widget": FlatpickrDateWidget
                    }
                }}
            />
        </>
    );

}