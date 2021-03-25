import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { resolveText } from '../../helpers/Globalizer';
import { apiClient } from '../../communication/ApiClient';
import { Models } from '../../types/models';
import { ServiceRequestForm } from '../../components/Services/ServiceRequestForm';

interface ServiceRequestParams {
    serviceId?: string;
}
interface ServiceRequestPageProps extends RouteComponentProps<ServiceRequestParams> { }

export const ServiceRequestPage = (props: ServiceRequestPageProps) => {

    const matchedServiceId = props.match.params.serviceId;
    const [ service, setService ] = useState<Models.ServiceDefinition>();
    useEffect(() => {
        const loadService = async () => {
            if(!matchedServiceId) { return; }
            try {
                const response = await apiClient.get(`api/services/${matchedServiceId}`, {});
                const data = await response.json() as Models.ServiceDefinition;
                setService(data);
            } catch(error) {
                NotificationManager.error(error.message, resolveText('Service_CouldNotLoad'));
            }
        }
        loadService();
    }, [ matchedServiceId ]);

    if(!service) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('ServiceRequest')} - {service.name}</h1>
            <ServiceRequestForm
                service={service}
            />
        </>
    );

}