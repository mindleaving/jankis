import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface RegistrationHealthInsuranceStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const RegistrationHealthInsuranceStep = (props: RegistrationHealthInsuranceStepProps) => {

    return (
        <>
            <h1>{resolveText("Registration_HealthInsuranceStep_Title")}</h1>
            <RowFormGroup
                label={resolveText("HealthInsurance_InsurerName")}
                value={props.profileData.healthInsurance?.insurerName ?? ''}
                onChange={value => props.onChange(state => ({
                    ...state,
                    healthInsurance: {
                        insurerName: value,
                        insuranceNumber: state.healthInsurance?.insuranceNumber ?? '',
                        insurerNumber: state.healthInsurance?.insurerNumber ?? ''
                    }
                }))}
            />
            <RowFormGroup
                label={resolveText("HealthInsurance_InsurerNumber")}
                value={props.profileData.healthInsurance?.insurerNumber ?? ''}
                onChange={value => props.onChange(state => ({
                    ...state,
                    healthInsurance: {
                        insurerName: state.healthInsurance?.insurerName ?? '',
                        insuranceNumber: state.healthInsurance?.insuranceNumber ?? '',
                        insurerNumber: value
                    }
                }))}
            />
            <RowFormGroup
                label={resolveText("HealthInsurance_InsuranceNumber")}
                value={props.profileData.healthInsurance?.insuranceNumber ?? ''}
                onChange={value => props.onChange(state => ({
                    ...state,
                    healthInsurance: {
                        insurerName: state.healthInsurance?.insurerName ?? '',
                        insuranceNumber: value,
                        insurerNumber: state.healthInsurance?.insurerNumber ?? ''
                    }
                }))}
            />
            <Row>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}