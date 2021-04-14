import React, { FormEvent, useContext, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import UserContext from '../../contexts/UserContext';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { PatientEventType } from '../../types/enums';
import FrequencyMeasurer from '../../helpers/FrequencyMeasurer';

interface PulseMeasurementFormProps {
    patientId: string;
    onSubmit: (observation: Models.PulseObservation) => void;
    id?: string;
}

export const PulseMeasurementForm = (props: PulseMeasurementFormProps) => {

    const user = useContext(UserContext);
    const [ bpm, setBpm ] = useState<number>(0);
    const [ pulseLocation, setPulseLocation ] = useState<string>('');
    const frequencyMeasurer = useMemo(() => new FrequencyMeasurer(5), []);

    const buildAndSubmitObservation = (e: FormEvent) => {
        e.preventDefault();
        const observation: Models.PulseObservation = {
            id: uuid(),
            type: PatientEventType.Observation,
            createdBy: user!.username,
            location: pulseLocation,
            patientId: props.patientId,
            timestamp: new Date(),
            bpm: bpm
        };
        props.onSubmit(observation);
    }

    const addTap = () => {
        frequencyMeasurer.update();
        if(frequencyMeasurer.isFrequencyAvailable()) {
            setBpm(frequencyMeasurer.getFrequency());
        }
    }


    return (
        <Form id={props.id} onSubmit={buildAndSubmitObservation}>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Pulse_BPM')}</FormLabel>
                <Col>
                    <InputGroup>
                        <FormControl
                            type="number"
                            value={bpm}
                            onChange={(e:any) => setBpm(e.target.value)}
                        />
                        <InputGroup.Append>
                            {resolveText('BPM')}
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Pulse_Location')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={pulseLocation}
                        onChange={(e:any) => setPulseLocation(e.target.value)}
                    >
                        <option value="">{resolveText('Unspecified')}</option>
                        <option value="ARadialisDexter">{resolveText('BodyPart_ARadialis_Dexter')}</option>
                        <option value="ARadialisSinister">{resolveText('BodyPart_ARadialis_Sinister')}</option>
                    </FormControl>
                </Col>
            </FormGroup>
            <hr />
            <Row>
                <Col>
                    <Button onClick={addTap}>
                        {resolveText('Tap')}
                    </Button>
                </Col>
            </Row>
        </Form>
    );

}