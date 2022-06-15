import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface RegistrationPersonalInformationStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const RegistrationPersonalInformationStep = (props: RegistrationPersonalInformationStepProps) => {

    return (
        <>
            <h1>{resolveText("Registration_PersonalInformationStep_Title")}</h1>
            <RowFormGroup
                label={resolveText("Person_FirstName")}
                value={props.profileData.firstName}
                onChange={value => props.onChange(state => ({
                    ...state,
                    firstName: value
                }))}
            />
            <RowFormGroup
                label={resolveText("Person_LastName")}
                value={props.profileData.lastName}
                onChange={value => props.onChange(state => ({
                    ...state,
                    lastName: value
                }))}
            />
            {/* TODO: Sex */}
            {/* TODO: Addresses */}

            <Row>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext} disabled={!props.profileData.firstName || !props.profileData.lastName}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}