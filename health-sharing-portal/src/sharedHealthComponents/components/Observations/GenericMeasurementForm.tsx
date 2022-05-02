import { FormEvent, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Form, FormGroup, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType, AutoCompleteContext } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface GenericMeasurementFormProps {
    personId: string;
    onSubmit: (observation: Models.Observations.GenericObservation) => void;
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
        const observation: Models.Observations.GenericObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            measurementType: measurementType,
            createdBy: user!.accountId,
            personId: props.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.personId,
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