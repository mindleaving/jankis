import React, { FormEvent, Fragment, useState } from 'react';
import { MeasurementType } from '../../types/enums.d';
import { StoreButton } from '../../components/StoreButton';
import { PulseMeasurementForm } from '../../components/Patients/PulseMeasurementForm';
import { BloodPressureMeasurementForm } from '../../components/Patients/BloodPressureMeasurementForm';
import { TemperatureMeasurementForm } from '../../components/Patients/TemperatureMeasurementForm';
import { GenericMeasurementForm } from '../../components/Patients/GenericMeasurementForm';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { formatObservation } from '../../helpers/Formatters';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';

interface ObservationsFormProps {
    patientId: string;
    admissionId?: string;
    onStore?: (observations: Models.Observation[]) => void;
}
interface MeasurementForm {
    id: string;
    measurementType: string;
}

export const ObservationsForm = (props: ObservationsFormProps) => {

    const [ measurementForms, setMeasurementForms ] = useState<MeasurementForm[]>([]);
    const [ observations, setObservations ] = useState<Models.Observation[]>([]);
    const [isStoring, setIsStoring ] = useState<boolean>(false);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoring(true);
        try {
            for (const observation of observations) {
                await apiClient.put(`api/observations/${observation.id}`, {}, observation);
            }
            NotificationManager.success(resolveText('Patient_Observation_SuccessfullyStored'));
            if(props.onStore) {
                props.onStore(observations);
            }
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Patient_Observation_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const addMeasurementForm = (measurementType: string) => {
        setMeasurementForms(measurementForms.concat({
            id: uuid(),
            measurementType
        }));
    }
    const removeMeasurementForm = (measurementFormId: string) => {
        setMeasurementForms(measurementForms.filter(x => x.id !== measurementFormId));
    }
    const addObservation = (observation: Models.Observation, measurementFormId: string) => {
        setObservations(observations.concat(observation));
        removeMeasurementForm(measurementFormId);
    }
    const removeObservation = (observationId: string) => {
        setObservations(observations.filter(x => x.id !== observationId));
    }

    return (
        <>
            <Row>
                <Col md="4">{resolveText('Observation_MeasurementType')}</Col>
                <Col md="8">
                    <Row>
                        <Col>
                            <Button className="m-1" onClick={() => addMeasurementForm('')}>{resolveText('CreateNew')}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.Pulse)}>+ {resolveText('MeasurementType_Pulse')}</Button>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.BloodPressure)}>+ {resolveText('MeasurementType_BloodPressure')}</Button>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.Temperature)}>+ {resolveText('MeasurementType_Temperature')}</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {measurementForms.map(measurementForm => {
                let headingText;
                let formControl;
                if(measurementForm.measurementType === MeasurementType.Pulse) {
                    headingText = resolveText('MeasurementType_Pulse');
                    formControl =(<PulseMeasurementForm
                            patientId={props.patientId}
                            admissionId={props.admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.BloodPressure) {
                    headingText = resolveText('MeasurementType_BloodPressure');
                    formControl = (<BloodPressureMeasurementForm
                            patientId={props.patientId}
                            admissionId={props.admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.Temperature) {
                    headingText = resolveText('MeasurementType_Temperature');
                    formControl = (<TemperatureMeasurementForm
                            patientId={props.patientId}
                            admissionId={props.admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                } else {
                    formControl = (<GenericMeasurementForm
                        patientId={props.patientId}
                        admissionId={props.admissionId}
                        onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                        hasSubmitButton
                        submitButtonText={resolveText('Create')}
                    />);
                }
                
                return (<Fragment key={measurementForm.id}>
                    <hr />
                    <Alert dismissible onClose={() => removeMeasurementForm(measurementForm.id)}>
                        <Alert.Heading>{headingText}</Alert.Heading>
                        {formControl}
                    </Alert>
                </Fragment>);
            })}
            <hr className="my-3" />
            <Form onSubmit={store}>
                <Row>
                    <Col>
                        <h4>{resolveText('Observations')}</h4>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        {observations.length > 0
                        ? observations.map(observation => (
                            <Alert 
                                key={observation.id}
                                variant="info" 
                                dismissible
                                onClose={() => removeObservation(observation.id)}
                            >
                                {formatObservation(observation)}
                            </Alert>
                        ))
                        : resolveText('NoEntries')}
                    </Col>
                </Row>
                <StoreButton
                    type="submit"
                    disabled={observations.length === 0}
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}