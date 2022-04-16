import { FormEvent, useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType, MeasurementType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface TemperatureMeasurementFormProps {
    personId: string;
    onSubmit: (observation: Models.Observations.TemperatureObservation) => void;
    hasSubmitButton?: boolean;
    submitButtonText?: string;
    id?: string;
}

export const TemperatureMeasurementForm = (props: TemperatureMeasurementFormProps) => {

    const user = useContext(UserContext);
    const [ temperature, setTemperature ] = useState<number>(0);
    const [ unit, setUnit ] = useState<string>('°C');
    const [ bodyPart, setBodyPart ] = useState<string>('');

    const buildAndSubmitObservation = (e: FormEvent) => {
        e.preventDefault();
        const observation: Models.Observations.TemperatureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.personId,
            measurementType: MeasurementType.Temperature,
            createdBy: user!.username,
            personId: props.personId,
            timestamp: new Date(),
            value: temperature,
            unit: unit,
            bodyPart: bodyPart
        };
        props.onSubmit(observation);
    }

    return (
        <Form id={props.id} onSubmit={buildAndSubmitObservation}>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('MeasurementType_Temperature')}</FormLabel>
                <Col>
                    <InputGroup>
                        <FormControl
                            type="number"
                            step={0.1}
                            value={temperature}
                            onChange={(e:any) => setTemperature(e.target.value)}
                        />
                        <FormControl
                            as="select"
                            value={unit}
                            onChange={(e:any) => setUnit(e.target.value)}
                        >
                            <option value="°C">°C</option>
                            <option value="°F">°F</option>
                            <option value="°K">°K</option>
                        </FormControl>
                    </InputGroup>
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Temperature_BodyPart')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={bodyPart}
                        onChange={(e:any) => setBodyPart(e.target.value)}
                    >
                        <option value="">{resolveText('Unspecified')}</option>
                        <option value="ARadialisDexter">{resolveText('BodyPart_ARadialis_Dexter')}</option>
                        <option value="ARadialisSinister">{resolveText('BodyPart_ARadialis_Sinister')}</option>
                    </FormControl>
                </Col>
            </FormGroup>
            {props.hasSubmitButton
            ? <Button type="submit">{props.submitButtonText ?? resolveText('Submit')}</Button>
            : null}
        </Form>
    );

}