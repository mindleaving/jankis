import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { resolveText } from '../../helpers/Globalizer';
import { apiClient } from '../../communication/ApiClient';
import { Models } from '../../types/models';
import { RequestServiceForm } from '../../components/Services/RequestServiceForm';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { ServiceAutocomplete } from '../../components/Autocompletes/ServiceAutocomplete';

interface RequestServiceParams {
    serviceId?: string;
}
interface RequestServicePageProps extends RouteComponentProps<RequestServiceParams> { }

export const RequestServicePage = (props: RequestServicePageProps) => {

    const matchedServiceId = props.match.params.serviceId;
    const [ isLoading, setIsLoading ] = useState<boolean>(!!matchedServiceId);
    const [ service, setService ] = useState<Models.ServiceDefinition>();
    useEffect(() => {
        if(!matchedServiceId) return;
        setIsLoading(true);
        const loadService = async () => {
            try {
                const response = await apiClient.get(`api/services/${matchedServiceId}`, {});
                const data = await response.json() as Models.ServiceDefinition;
                setService(data);
            } catch(error) {
                NotificationManager.error(error.message, resolveText('Service_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        }
        loadService();
    }, [ matchedServiceId ]);

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('ServiceRequest')}</h1>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service')}</FormLabel>
                <Col>
                    <ServiceAutocomplete
                        value={service}
                        onChange={setService}
                    />
                </Col>
            </FormGroup>
            {service
            ? <>
                <hr />
                <RequestServiceForm
                    service={service}
                />
            </>
            : null}
        </>
    );

}