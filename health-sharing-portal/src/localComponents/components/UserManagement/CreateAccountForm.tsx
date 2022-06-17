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
import { parseEnum } from '../../../sharedCommonComponents/helpers/StringExtensions';

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

    const accountTypeSteps: { [key:string]: RegistrationSteps[] } = {
        [AccountType.Sharer]: [
            RegistrationSteps.AccountType,
            RegistrationSteps.FirstPrivacyWarning,
            RegistrationSteps.MenschId,
            RegistrationSteps.PersonalInformation,
            RegistrationSteps.ContactInformation,
            RegistrationSteps.HealthInsurance,
            RegistrationSteps.TermsAndConditions,
            RegistrationSteps.Summary
        ],
        [AccountType.HealthProfessional]: [
            RegistrationSteps.AccountType,
            RegistrationSteps.MenschId,
            RegistrationSteps.PersonalInformation,
            RegistrationSteps.ContactInformation,
            RegistrationSteps.TermsAndConditions,
            RegistrationSteps.Summary
        ],
        [AccountType.Researcher]: [
            RegistrationSteps.AccountType,
            RegistrationSteps.MenschId,
            RegistrationSteps.PersonalInformation,
            RegistrationSteps.ContactInformation,
            RegistrationSteps.TermsAndConditions,
            RegistrationSteps.Summary
        ]
    };

    const { accountType: matchedAccountType} = useParams();
    const [ accountType, setAccountType ] = useState<AccountType | undefined>(
        matchedAccountType 
            ? parseEnum<AccountType>(AccountType, matchedAccountType) 
            : undefined
    );
    const [ steps, setSteps ] = useState<RegistrationSteps[]>([ RegistrationSteps.AccountType ]);
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
            setSteps(accountTypeSteps[accountType]);
        }
    }, [ accountType ]);

    useEffect(() => {
        if(steps.length > 1) {
            setStep(steps[1]);
        } else if(steps.length === 1) {
            setStep(steps[0]);
        }
    }, [ steps ]);

    const store = async () => {
        if(!accountType) {
            return;
        }
        switch(accountType) {
            case AccountType.Sharer:
                await storeSharerAccount();
                break;
            case AccountType.HealthProfessional:
                await storeHealthProfessionalAccount();
                break;
            case AccountType.Researcher:
                await storeResearcherAccount();
                break;
        }
        
    }

    const storeSharerAccount = async () => {
        const cleanedProfileData: Models.Person = { ...profileData };
        if(!profileData.addresses[0].street
            && !profileData.addresses[0].postalCode
            && !profileData.addresses[0].city 
            && !profileData.addresses[0].country
        ) {
            cleanedProfileData.addresses = [];
        }
        const accountCreationInfo: ViewModels.AccountCreationInfo = {
            accountType: accountType!,
            person: cleanedProfileData
        };
        await sendPostRequest(
            'api/accounts',
            resolveText("Account_CouldNotStore"),
            accountCreationInfo,
            props.onAccountCreated);
    }

    const storeHealthProfessionalAccount = async () => {
        await storeSharerAccount();
    }

    const storeResearcherAccount = async () => {
        await storeSharerAccount();
    }

    const updateProfileData = (update: Update<Models.Person>) => {
        setProfileData(state => update(state));
    }

    const stepIndex = steps.indexOf(step);
    const previousStep = stepIndex > 0 ? steps[stepIndex-1] : undefined;
    const previousStepFunc = previousStep ? () => setStep(previousStep) : () => navigate(-1);
    const nextStep = stepIndex + 1 < steps.length ? steps[stepIndex+1] : undefined;
    const nextStepFunc = nextStep ? () => setStep(nextStep) : store;
    let stepView;
    switch(step) {
        case RegistrationSteps.AccountType:
            stepView = (<RegistrationAccountTypeStep  
                onChange={setAccountType}
                onPrevious={previousStepFunc}
            />);
            break;
        case RegistrationSteps.FirstPrivacyWarning:
            stepView = (<RegistrationFirstPrivacyWarningStep 
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
        case RegistrationSteps.MenschId:
            stepView = (<RegistrationMenschIdStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
        case RegistrationSteps.PersonalInformation:
            stepView = (<RegistrationPersonalInformationStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
        case RegistrationSteps.ContactInformation:
            stepView = (<RegistrationContactInformationStep 
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;    
        case RegistrationSteps.HealthInsurance:
            stepView = (<RegistrationHealthInsuranceStep
                profileData={profileData} 
                onChange={updateProfileData}
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
        case RegistrationSteps.TermsAndConditions:
            stepView = (<RegistrationTermsAndConditionsStep
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
        case RegistrationSteps.Summary:
            stepView = (<RegistrationSummaryStep
                accountType={accountType!}
                profileData={profileData}
                onPrevious={previousStepFunc}
                onNext={nextStepFunc}
            />);
            break;
    }

    return (
        <>
            {stepView}
        </>
    );

}