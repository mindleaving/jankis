import React from 'react';
import { Models } from '../../types/models';

interface RegistrationHealthInsuranceStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
}

export const RegistrationHealthInsuranceStep = (props: RegistrationHealthInsuranceStepProps) => {

    return (
        <>
            <h1>Step 3</h1>
        </>
    );

}