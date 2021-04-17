import { FormEvent, useContext, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { AutoCompleteContext, PatientEventType } from '../../types/enums.d';
import { Form, FormGroup, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { MemoryFormControl } from '../MemoryFormControl';

interface GenericMeasurementFormProps {
    patientId: string;
    admissionId?: string;
    onSubmit: (observation: Models.GenericObservation) => void;
    hasSubmitButton?: boolean;
    submitButtonText?: string;
    id?: string;
}

export const GenericMeasurementForm = (props: GenericMeasurementFormProps) => {

    const user = useContext(UserContext);

    const [ measurementType, setMeasurementType ] = useState<string>('');
    const [ value, setValue ] = useState<string>('');
    const [ unit, setUnit ] = useState<string>('');

    const buildAndSubmitObservation = (e: FormEvent) => {
        e.preventDefault();
        const observation: Models.GenericObservation = {
            id: uuid(),
            type: PatientEventType.Observation,
            measurementType: measurementType,
            createdBy: user!.username,
            patientId: props.patientId,
            admissionId: props.admissionId,
            timestamp: new Date(),
            value: value,
            unit: unit
        };
        props.onSubmit(observation);
    }
    return (
        <Form id={props.id} onSubmit={buildAndSubmitObservation}>
            <FormGroup as={Row}>
                <Col>
                    <MemoryFormControl required
                        context={AutoCompleteContext.MeasurementType}
                        onChange={setMeasurementType}
                        placeholder={resolveText('MeasurementType')}
                    />
                </Col>
                <Col>
                    <InputGroup>
                        <FormControl required
                            value={value}
                            onChange={(e:any) => setValue(e.target.value)}
                            placeholder={resolveText('Observation_Value')}
                        />
                        <MemoryFormControl
                            context={AutoCompleteContext.Unit}
                            onChange={setUnit}
                            placeholder={resolveText('Unit')}
                            minSearchTextLength={1}
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