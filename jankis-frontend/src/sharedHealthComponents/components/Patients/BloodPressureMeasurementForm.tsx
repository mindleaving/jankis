import React, { FormEvent, useContext, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import { InputGroup } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { PatientEventType, MeasurementType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface BloodPressureMeasurementFormProps {
    patientId: string;
    admissionId?: string;
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
            type: PatientEventType.Observation,
            measurementType: MeasurementType.BloodPressure,
            patientId: props.patientId,
            admissionId: props.admissionId,
            timestamp: new Date(),
            createdBy: user!.username,
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