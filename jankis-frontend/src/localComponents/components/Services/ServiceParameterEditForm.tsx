import React, { useState } from 'react';
import { Button, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface ServiceParameterEditFormProps {
    addParameter: (parameter: Models.Services.ServiceParameter) => void;
}

export const ServiceParameterEditForm = (props: ServiceParameterEditFormProps) => {

    const [ name, setName ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ valueType, setValueType ] = useState<ServiceParameterValueType>(ServiceParameterValueType.Text);

    const createParameter = () => {
        const parameter: Models.Services.ServiceParameter = {
            name: name,
            description: description,
            valueType: valueType
        };
        props.addParameter(parameter);
    }
    return (
        <>
            <FormGroup>
                <FormLabel>{resolveText('Service_Parameter_Name')}</FormLabel>
                <FormControl
                    value={name}
                    onChange={(e:any) => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText('Service_Parameter_Description')}</FormLabel>
                <FormControl
                    value={description}
                    onChange={(e:any) => setDescription(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText('Service_Parameter_ValueType')}</FormLabel>
                <FormControl
                    as="select"
                    value={valueType}
                    onChange={(e:any) => setValueType(e.target.value)}
                >
                    {Object.keys(ServiceParameterValueType).map(x => (
                        <option key={x} value={x}>{resolveText(`ServiceParameterValueType_${x}`)}</option>
                    ))}
                </FormControl>
            </FormGroup>
            <Row>
                <Col>
                    <Button onClick={createParameter}>{resolveText('Add')}</Button>
                </Col>
            </Row>
        </>
    );

}