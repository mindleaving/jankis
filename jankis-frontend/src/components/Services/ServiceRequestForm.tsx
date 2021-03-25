import React, { FormEvent, useContext, useState } from 'react';
import { Card, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { buildParameterResponse } from '../../helpers/ServiceParameterResponseBuilder';
import { Models } from '../../types/models';
import { AsyncButton } from '../AsyncButton';
import { ServiceParameterResponseFormControl } from './ServiceParameterResponseFormControl';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { ServiceRequestState } from '../../types/enums';
import { toDictionary } from '../../helpers/Transformations';
import UserContext from '../../Contexts/UserContext';

interface ServiceRequestFormProps {
    service: Models.ServiceDefinition;
}

export const ServiceRequestForm = (props: ServiceRequestFormProps) => {

    const loggedInUser = useContext(UserContext);
    const [ parameterResponses, setParameterResponses ] = useState<Models.ServiceParameterResponse[]>(props.service.parameters.map(buildParameterResponse));
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const updateParameterResponse = (changedParameterResponse: Models.ServiceParameterResponse) => {
        setParameterResponses(parameterResponses.map(x => {
            if(x.parameterName === changedParameterResponse.parameterName) {
                return changedParameterResponse;
            }
            return x;
        }));
    }

    const submitRequest = async (e: FormEvent) => {
        try {
            setIsSubmitting(true);
            const serviceRequest = buildServiceRequest();
            await apiClient.post(`api/services/${props.service.id}/request`, {}, serviceRequest);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('ServiceRequest_CouldNotSubmit'));
        } finally {
            setIsSubmitting(false);
        }
    }

    const buildServiceRequest = () => {
        const serviceRequest: Models.ServiceRequest = {
            id: uuid(),
            serviceId: props.service.id,
            requester: {
                type: loggedInUser!.type,
                id: loggedInUser!.id
            },
            parameterResponses: toDictionary(parameterResponses, x => x.parameterName),
            state: ServiceRequestState.Requested,
            timestamps: {},
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
                    <FormGroup>
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
            <AsyncButton
                type="submit"
                activeText={resolveText('Submit')}
                executingText={resolveText('Submitting...')}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}