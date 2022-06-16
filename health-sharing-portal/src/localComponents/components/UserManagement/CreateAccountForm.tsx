import { useEffect, useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { AccountType, AddressRole, Sex } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { useNavigate, useParams } from 'react-router-dom';
import { RegistrationMenschIdStep } from './RegistrationMenschIdStep';
import { RegistrationPersonalInformationStep } from './RegistrationPersonalInformationStep';
import { RegistrationHealthInsuranceStep } from './RegistrationHealthInsuranceStep';
import { RegistrationAccountTypeStep } from './RegistrationAccountTypeStep';
import { RegistrationFirstPrivacyWarningStep } from './RegistrationFirstPrivacyWarningStep';
import { RegistrationSummaryStep } from './RegistrationSummaryStep';
import { RegistrationContactInformationStep } from './RegistrationContactInformationStep';
import { RegistrationTermsAndConditionsStep } from './RegistrationTermsAndConditionsStep';

interface CreateAccountFormProps {
    onAccountCreated: () => void;
}

enum RegistrationSteps {
    AccountType,
    FirstPrivacyWarning,
    MenschId,
    PersonalInformation,
    ContactInformation,
    HealthInsurance,
    TermsAndConditions,
    Summary
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
        birthDate: '' as any,
        sex: Sex.Other,
        addresses: [
            {
                role: AddressRole.Primary,
                street: '',
                houseNumber: '',
                postalCode: '',
                city: '',
                country: ''
            }
        ]
    });
    const navigate = useNavigate();

    useEffect(() => {
        if(accountType) {
            setStep(RegistrationSteps.FirstPrivacyWarning);
        }
    }, [ accountType ]);

    const store = async () => {
        if(!accountType) {
            return;
        }
        const cleanedProfileData: Models.Person = { ...profileData };
        if(!profileData.addresses[0].street
            && !profileData.addresses[0].postalCode
            && !profileData.addresses[0].city 
            && !profileData.addresses[0].country
        ) {
            cleanedProfileData.addresses = [];
        }
        const accountCreationInfo: ViewModels.AccountCreationInfo = {
            accountType: accountType,
            person: cleanedProfileData
        };
        await sendPostRequest(
            'api/accounts',
            resolveText("Account_CouldNotStore"),
            accountCreationInfo,
            props.onAccountCreated);
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
                onNext={() => setStep(RegistrationSteps.ContactInformation)}
            />);
            break;
        case RegistrationSteps.ContactInformation:
            stepView = (<RegistrationContactInformationStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={() => setStep(RegistrationSteps.PersonalInformation)}
                onNext={() => setStep(RegistrationSteps.HealthInsurance)}
            />);
            break;    
        case RegistrationSteps.HealthInsurance:
            stepView = (<RegistrationHealthInsuranceStep
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={() => setStep(RegistrationSteps.ContactInformation)}
                onNext={() => setStep(RegistrationSteps.TermsAndConditions)}
            />);
            break;
        case RegistrationSteps.TermsAndConditions:
            stepView = (<RegistrationTermsAndConditionsStep
                onPrevious={() => setStep(RegistrationSteps.HealthInsurance)}
                onNext={() => setStep(RegistrationSteps.Summary)}
            />);
            break;
        case RegistrationSteps.Summary:
            stepView = (<RegistrationSummaryStep
                accountType={accountType!}
                profileData={profileData}
                onPrevious={() => setStep(RegistrationSteps.TermsAndConditions)}
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