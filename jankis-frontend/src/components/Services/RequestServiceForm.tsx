import React, { FormEvent, useContext, useState } from 'react';
import { Card, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { buildTemporaryParameterResponse } from '../../helpers/ServiceParameterResponseBuilder';
import { Models } from '../../types/models';
import { AsyncButton } from '../AsyncButton';
import { ServiceParameterResponseFormControl } from './ServiceParameterResponseFormControl';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { ServiceParameterValueType, ServiceRequestState } from '../../types/enums.d';
import { toDictionary } from '../../helpers/Transformations';
import UserContext from '../../contexts/UserContext';
import { useHistory } from 'react-router';

interface RequestServiceFormProps {
    service: Models.ServiceDefinition;
    patient?: Models.Person;
}

export const RequestServiceForm = (props: RequestServiceFormProps) => {

    const loggedInUser = useContext(UserContext);
    const initialParameterResponses = props.service.parameters.map(parameter => {
        if(props.patient && parameter.valueType === ServiceParameterValueType.Patient) {
            const patientParameterResponse: Models.PatientServiceParameterResponse = {
                parameterName: parameter.name,
                valueType: parameter.valueType,
                patientId: props.patient.id
            };
            return patientParameterResponse;
        }
        return buildTemporaryParameterResponse(parameter);
    });
    const [ parameterResponses, setParameterResponses ] = useState<Models.ServiceParameterResponse[]>(initialParameterResponses);
    const [ note, setNote ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const history = useHistory();

    const updateParameterResponse = (changedParameterResponse: Models.ServiceParameterResponse) => {
        setParameterResponses(parameterResponses.map(x => {
            if(x.parameterName === changedParameterResponse.parameterName) {
                return changedParameterResponse;
            }
            return x;
        }));
    }

    const submitRequest = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const serviceRequest = buildServiceRequest();
            await apiClient.post(`api/services/${props.service.id}/request`, {}, serviceRequest);
            NotificationManager.success(resolveText('ServiceRequest_SuccessfullySubmitted'));
            history.goBack();
        } catch(error) {
            NotificationManager.error(error.message, resolveText('ServiceRequest_CouldNotSubmit'));
        } finally {
            setIsSubmitting(false);
        }
    }

    const buildServiceRequest = () => {
        const serviceRequest: Models.ServiceRequest = {
            id: uuid(),
            service: props.service,
            requester: loggedInUser!.username,
            parameterResponses: toDictionary(parameterResponses, x => x.parameterName),
            state: ServiceRequestState.Requested,
            timestamps: [],
            note: note
        };
        return serviceRequest;
    }

    return (
        <Form className="needs-validation was-validated" onSubmit={submitRequest}>
            <Card>
                <Card.Header>{props.service.name}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md="auto"><b>{resolveText('Service_Department')}</b></Col>
                        <Col>{props.service.departmentId}</Col>
                    </Row>
                    <Row>
                        <Col md="auto"><b>{resolveText('Service_Description')}</b></Col>
                        <Col>{props.service.description}</Col>
                    </Row>
                </Card.Body>
            </Card>
            {props.service.parameters.map(parameter => {
                const parameterResponse = parameterResponses.find(x => x.parameterName === parameter.name)!;
                return (
                    <FormGroup key={parameter.name}>
                        <FormLabel>
                            {parameter.name}
                            <div><small>{parameter.description}</small></div>
                        </FormLabel>
                        <ServiceParameterResponseFormControl
                            parameter={parameter}
                            value={parameterResponse}
                            onChange={updateParameterResponse}
                        />
                    </FormGroup>
                );
            })}
            <FormGroup>
                <FormLabel>{resolveText('ServiceRequest_Note')}</FormLabel>
                <FormControl
                    as="textarea"
                    value={note}
                    onChange={(e:any) => setNote(e.target.value)}
                />
            </FormGroup>
            <AsyncButton
                type="submit"
                activeText={resolveText('Submit')}
                executingText={resolveText('Submitting...')}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}