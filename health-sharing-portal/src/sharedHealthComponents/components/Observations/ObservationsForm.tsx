import { FormEvent, Fragment, useEffect, useState } from 'react';
import { PulseMeasurementForm } from './PulseMeasurementForm';
import { BloodPressureMeasurementForm } from './BloodPressureMeasurementForm';
import { TemperatureMeasurementForm } from './TemperatureMeasurementForm';
import { GenericMeasurementForm } from './GenericMeasurementForm';
import { v4 as uuid } from 'uuid';
import { Alert, Button, Col, Form, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { formatObservation } from '../../helpers/Formatters';
import { MeasurementType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { DateFormControl } from '../../../sharedCommonComponents/components/DateFormControl';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addObservation as addObservationToStore } from '../../redux/slices/observationsSlice';

interface ObservationsFormProps {
    personId: string;
    onStore?: (observations: Models.Observations.Observation[]) => void;
}
interface MeasurementForm {
    id: string;
    measurementType: string;
}

export const ObservationsForm = (props: ObservationsFormProps) => {

    const [ timestamp, setTimestamp ] = useState<Date | undefined>(new Date());
    const [ measurementForms, setMeasurementForms ] = useState<MeasurementForm[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const isStoring = useAppSelector(state => state.observations.isSubmitting);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!timestamp) {
            return;
        }
        setObservations(state => state.map(observation => ({
            ...observation,
            timestamp: timestamp
        })));
    }, [ timestamp ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        let isSuccess = true;
        for (const observation of observations) {
            dispatch(addObservationToStore({
                args: observation,
                body: observation,
                onFailure: () => isSuccess = false
            }))
        }
        if(isSuccess && props.onStore) {
            props.onStore(observations);
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
    const addObservation = (observation: Models.Observations.Observation, measurementFormId: string) => {
        if(timestamp) {
            observation.timestamp = timestamp;
        }
        setObservations(observations.concat(observation));
        removeMeasurementForm(measurementFormId);
    }
    const removeObservation = (observationId: string) => {
        setObservations(observations.filter(x => x.id !== observationId));
    }

    return (
        <>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText("Observation_Timestamp")}</FormLabel>
                <Col>
                    <InputGroup>
                        <DateFormControl required
                            value={timestamp}
                            onChange={setTimestamp}
                            enableTime
                        />
                        <Button onClick={() => setTimestamp(new Date().toISOString() as any)}>
                            {resolveText("Now")}
                        </Button>
                    </InputGroup>
                </Col>
            </FormGroup>
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
                            personId={props.personId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.BloodPressure) {
                    headingText = resolveText('MeasurementType_BloodPressure');
                    formControl = (<BloodPressureMeasurementForm
                            personId={props.personId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.Temperature) {
                    headingText = resolveText('MeasurementType_Temperature');
                    formControl = (<TemperatureMeasurementForm
                            personId={props.personId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                } else {
                    formControl = (<GenericMeasurementForm
                        personId={props.personId}
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