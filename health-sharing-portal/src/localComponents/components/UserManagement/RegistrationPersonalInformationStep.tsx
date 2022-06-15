import React from 'react';
import { Models } from '../../types/models';

interface RegistrationPersonalInformationStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
}

export const RegistrationPersonalInformationStep = (props: RegistrationPersonalInformationStepProps) => {

    return (
        <>
            <h1>Step 2</h1>
        </>
    );

}