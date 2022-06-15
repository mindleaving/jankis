import { useEffect, useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { AccountType, Sex } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { useNavigate, useParams } from 'react-router-dom';
import { RegistrationMenschIdStep } from './RegistrationMenschIdStep';
import { RegistrationPersonalInformationStep } from './RegistrationPersonalInformationStep';
import { RegistrationHealthInsuranceStep } from './RegistrationHealthInsuranceStep';
import { RegistrationAccountTypeStep } from './RegistrationAccountTypeStep';
import { RegistrationFirstPrivacyWarningStep } from './RegistrationFirstPrivacyWarningStep';

interface CreateAccountFormProps {
    onAccountCreated: () => void;
}

enum RegistrationSteps {
    AccountType,
    FirstPrivacyWarning,
    MenschId,
    PersonalInformation,
    HealthInsurance
}

export const CreateAccountForm = (props: CreateAccountFormProps) => {

    const { accountType: matchedAccountType} = useParams();
    const [ accountType, setAccountType ] = useState<AccountType | undefined>(matchedAccountType as AccountType);
    const [ step, setStep ] = useState<RegistrationSteps>(RegistrationSteps.AccountType);
    const [ profileData, setProfileData ] = useState<Models.Person>({
        id: '',
        personId: '',
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        sex: Sex.Other,
        addresses: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        if(accountType) {
            setStep(RegistrationSteps.MenschId);
        }
    }, [ accountType ]);

    const store = async () => {
        if(!accountType) {
            return;
        }
        const accountCreationInfo: ViewModels.AccountCreationInfo = {
            accountType: accountType,
            person: profileData
        };
        await sendPostRequest(
            'api/accounts',
            resolveText("Account_CouldNotStore"),
            accountCreationInfo,
            () => props.onAccountCreated());
    }

    const updateProfileData = (update: Update<Models.Person>) => {
        setProfileData(state => update(state));
    }

    let stepView;
    switch(step) {
        case RegistrationSteps.AccountType:
            stepView = (<RegistrationAccountTypeStep  
                onChange={setAccountType}
                onPrevious={() => navigate(-1)}
            />);
            break;
        case RegistrationSteps.FirstPrivacyWarning:
            stepView = (<RegistrationFirstPrivacyWarningStep 
                onPrevious={() => setStep(RegistrationSteps.AccountType)}
                onNext={() => setStep(RegistrationSteps.MenschId)}
            />);
            break;
        case RegistrationSteps.MenschId:
            stepView = (<RegistrationMenschIdStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={() => setStep(RegistrationSteps.FirstPrivacyWarning)}
                onNext={() => setStep(RegistrationSteps.PersonalInformation)}
            />);
            break;
        case RegistrationSteps.PersonalInformation:
            stepView = (<RegistrationPersonalInformationStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={() => setStep(RegistrationSteps.MenschId)}
                onNext={() => setStep(RegistrationSteps.HealthInsurance)}
            />);
            break;
        case RegistrationSteps.HealthInsurance:
            stepView = (<RegistrationHealthInsuranceStep
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={() => setStep(RegistrationSteps.PersonalInformation)}
                onNext={store}
            />);
            break;
    }

    return (
        <>
            {stepView}
        </>
    );

}