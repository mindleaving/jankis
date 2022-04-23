import React, { FormEvent, useContext, useState } from 'react';
import { Card, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { buildTemporaryParameterResponse } from '../../helpers/ServiceParameterResponseBuilder';
import { Models } from '../../types/models';
import { ServiceParameterResponseFormControl } from './ServiceParameterResponseFormControl';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { ServiceParameterValueType, ServiceRequestState } from '../../types/enums.d';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { toDictionary } from '../../../sharedCommonComponents/helpers/Transformations';

interface RequestServiceFormProps {
    service: Models.Services.ServiceDefinition;
    patient?: Models.Person;
}

export const RequestServiceForm = (props: RequestServiceFormProps) => {

    const loggedInUser = useContext(UserContext);
    const initialParameterResponses = props.service.parameters.map(parameter => {
        if(props.patient && parameter.valueType === ServiceParameterValueType.Patient) {
            const patientParameterResponse: Models.Services.PatientServiceParameterResponse = {
                parameterName: parameter.name,
                valueType: parameter.valueType,
                patient: props.patient
            };
            return patientParameterResponse;
        }
        return buildTemporaryParameterResponse(parameter);
    });
    const [ parameterResponses, setParameterResponses ] = useState<Models.Services.ServiceParameterResponse[]>(initialParameterResponses);
    const [ note, setNote ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    const updateParameterResponse = (changedParameterResponse: Models.Services.ServiceParameterResponse) => {
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
            await apiClient.instance!.post(`api/services/${props.service.id}/request`, {}, serviceRequest);
            NotificationManager.success(resolveText('ServiceRequest_SuccessfullySubmitted'));
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('ServiceRequest_CouldNotSubmit'));
        } finally {
            setIsSubmitting(false);
        }
    }

    const buildServiceRequest = () => {
        const serviceRequest: Models.Services.ServiceRequest = {
            id: uuid(),
            service: props.service,
            requester: loggedInUser!.accountId,
            parameterResponses: toDictionary(parameterResponses, x => x.parameterName),
            state: ServiceRequestState.Requested,
            timestamps: [],
            requesterNote: note,
            handlerNote: ''
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
                <FormLabel>{resolveText('ServiceRequest_RequesterNote')}</FormLabel>
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