import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { Models } from '../../types/models';
import { RequestServiceForm } from '../../components/Services/RequestServiceForm';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { ServiceAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/ServiceAutocomplete';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';


interface RequestServicePageProps { }

export const RequestServicePage = (props: RequestServicePageProps) => {

    const { serviceId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!serviceId);
    const [ service, setService ] = useState<Models.Services.ServiceDefinition>();
    useEffect(() => {
        if(!serviceId) return;
        setIsLoading(true);
        const loadService = async () => {
            try {
                const response = await apiClient.instance!.get(`api/services/${serviceId}`, {});
                const data = await response.json() as Models.Services.ServiceDefinition;
                setService(data);
            } catch(error: any) {
                NotificationManager.error(error.message, resolveText('Service_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        }
        loadService();
    }, [ serviceId ]);

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