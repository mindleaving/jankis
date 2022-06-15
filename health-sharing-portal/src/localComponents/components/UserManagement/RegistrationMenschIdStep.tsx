import React from 'react';
import { Models } from '../../types/models';

interface RegistrationMenschIdStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
}

export const RegistrationMenschIdStep = (props: RegistrationMenschIdStepProps) => {

    return (
        <>
            <h1>Step 1</h1>
        </>
    );

}