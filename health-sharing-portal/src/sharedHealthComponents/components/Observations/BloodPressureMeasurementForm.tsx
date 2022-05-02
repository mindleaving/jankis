import React, { FormEvent, useContext, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { InputGroup } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType, MeasurementType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface BloodPressureMeasurementFormProps {
    personId: string;
    onSubmit: (observation: Models.Observations.BloodPressureObservation) => void;
    hasSubmitButton?: boolean;
    submitButtonText?: string;
    id?: string;
}

export const BloodPressureMeasurementForm = (props: BloodPressureMeasurementFormProps) => {

    const user = useContext(UserContext);
    const [ systolic, setSystolic ] = useState<number>(0);
    const [ diastolic, setDiastolic ] = useState<number>(0);
    const buildAndSubmitObservation = (e: FormEvent) => {
        e.preventDefault();
        const observation: Models.Observations.BloodPressureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            measurementType: MeasurementType.BloodPressure,
            personId: props.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.personId,
            createdBy: user!.accountId,
            systolic: systolic,
            diastolic: diastolic
        };
        props.onSubmit(observation);
    }
    return (
        <Form id={props.id} onSubmit={buildAndSubmitObservation}>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('BloodPressure')}</FormLabel>
                <Col>
                    <InputGroup>
                        <FormControl
                            type="number"
                            value={systolic}
                            onChange={(e:any) => setSystolic(e.target.value)}
                        />
                        /
                        <FormControl
                            type="number"
                            value={diastolic}
                            onChange={(e:any) => setDiastolic(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </FormGroup>
            {props.hasSubmitButton
            ? <Button type="submit">{props.submitButtonText ?? resolveText('Submit')}</Button>
            : null}
        </Form>
    );

}