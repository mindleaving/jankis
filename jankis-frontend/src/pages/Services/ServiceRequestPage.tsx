import React, { FormEvent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { ServiceRequestState } from '../../types/enums.d';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { ServiceParameterResponse } from '../../components/Services/ServiceParameterResponse';
import { ServiceRequestStateChangeButtons } from '../../components/Services/ServiceRequestStateChangeButtons';
import { PersonAutocomplete } from '../../components/PersonAutocomplete';
import { StoreButton } from '../../components/StoreButton';

interface ServiceRequestParams {
    requestId?: string;
}
interface ServiceRequestPageProps extends RouteComponentProps<ServiceRequestParams> {}

export const ServiceRequestPage = (props: ServiceRequestPageProps) => {

    const matchedId = props.match.params.requestId;
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ request, setRequest ] = useState<Models.ServiceRequest>();
    const [ assignedTo, setAssignee ] = useState<Models.Person>();
    const [ state, setState ] = useState<ServiceRequestState>(ServiceRequestState.Requested);
    const [ note, setNote ] = useState<string>('');
    const [ isStoringAssignee, setIsStoringAssignee ] = useState<boolean>(false);
    const [ isStoringState, setIsStoringState ] = useState<boolean>(false);
    const [ isStoringNote, setIsStoringNote ] = useState<boolean>(false);

    useEffect(() => {
        if(!matchedId) return;
        setIsLoading(true);
        const loadRequest = buildLoadObjectFunc<Models.ServiceRequest>(
            `api/servicerequests/${matchedId}`,
            {},
            resolveText('ServiceRequest_CouldNotLoad'),
            item => {
                setRequest(item);
                setState(item.state);
            },
            () => setIsLoading(false)
        );
        loadRequest();
    }, [ matchedId ]);

    const changeState = async (newState: ServiceRequestState) => {
        setIsStoringState(true);
        try {
            await apiClient.post(`api/servicerequests/${matchedId}/changestate`, {}, `"${newState}"`);
            NotificationManager.success(resolveText('ServiceRequest_State_SuccessfullyChanged'));
            setState(newState);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('ServiceRequest_State_CouldNotChange'));
        } finally {
            setIsStoringState(false)
        }
    }
    const storeAssignee = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoringAssignee(true);
        try {
            await apiClient.post(`api/servicerequests/${matchedId}/assignee`, {}, `"${assignedTo}"`);
            NotificationManager.success(resolveText('ServiceRequest_Assignee_SuccessfullySet'));
        } catch(error) {
            NotificationManager.error(error.message, resolveText('ServiceRequest_Assignee_CouldNotSet'));
        } finally {
            setIsStoringState(false)
        }
    }
    const storeNote = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoringNote(true);
        await buidlAndStoreObject<string>(
            `api/servicerequests/${matchedId}/handlernote`,
            resolveText('ServiceRequest_SuccessfullyStored'),
            resolveText('ServiceRequest_CouldNotStore'),
            () => `"${note}"`,
            () => { },
            () => setIsStoringNote(false)
        );
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    // This page shows a single service request
    // TODO: Show request details and provide options for providing the requested service
    return (
        <>
            <h1>{resolveText('ServiceRequest')}</h1>
            <Card>
                <Card.Header>{resolveText('ServiceRequest')}</Card.Header>
                <Card.Body>
                    {request
                    ? <>
                        <Row>
                            <Col>{resolveText('Service')}</Col>
                            <Col>{request.service.name}</Col>
                        </Row>
                        <Row>
                            <Col>{resolveText('ServiceRequest_Requester')}</Col>
                            <Col>{request.requester}</Col>
                        </Row>
                        <Row className="mt-2">
                            <Col><b>{resolveText('ServiceRequest_ParameterResponses')}</b></Col>
                            <Col></Col>
                        </Row>
                        {Object.values(request.parameterResponses).map((parameterResponse) => (
                            <Row>
                                <Col>{parameterResponse.parameterName}</Col>
                                <Col>
                                    <ServiceParameterResponse parameterResponse={parameterResponse} />
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col>{resolveText('ServiceRequest_RequesterNote')}</Col>
                            <Col>{request.requesterNote}</Col>
                        </Row>
                    </>: null}
                </Card.Body>
            </Card>
            <ServiceRequestStateChangeButtons
                isChanging={isStoringState}
                state={state}
                onStateChange={changeState}
            />
            {![ServiceRequestState.Declined, ServiceRequestState.CancelledByRequester, ServiceRequestState.Fulfilled].includes(state)
            ? <Form onSubmit={storeAssignee}>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('ServiceRequest_AssignedTo')}</FormLabel>
                    <Col>
                        <InputGroup>
                            <div className="m-2">
                                <PersonAutocomplete
                                    value={assignedTo}
                                    onChange={setAssignee}
                                />
                            </div>
                            <StoreButton
                                type="submit"
                                isStoring={isStoringAssignee}
                            />
                        </InputGroup>
                    </Col>
                </FormGroup>
            </Form> : null}
            <Form onSubmit={storeNote}>
                <FormGroup>
                    <FormLabel>{resolveText('ServiceRequest_HandlerNote')}</FormLabel>
                    <FormControl
                        as="textarea"
                        value={note}
                        onChange={(e:any) => setNote(e.target.value)}
                    />
                    <StoreButton
                        type="submit"
                        isStoring={isStoringNote}
                    />
                </FormGroup>
            </Form>
        </>
    );

}