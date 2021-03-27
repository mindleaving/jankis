import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { ServiceEditForm } from '../../components/Services/ServiceEditForm';
import { resolveText } from '../../helpers/Globalizer';

interface CreateEditServiceParams {
    serviceId?: string;
}

interface ServiceEditPageProps extends RouteComponentProps<CreateEditServiceParams> {}

export const ServiceEditPage = (props: ServiceEditPageProps) => {

    const isNewService = props.match.path === "/services/new";
    const matchedServiceId = props.match.params.serviceId;

    useEffect(() => {

    }, []);

    return (
        <>
            <h1>{resolveText(isNewService ? 'Service_Create' : 'Service_Edit')}</h1>
            <ServiceEditForm serviceId={matchedServiceId} />
        </>
    );

}