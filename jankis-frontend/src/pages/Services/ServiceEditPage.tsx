import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ServiceEditForm } from '../../components/Services/ServiceEditForm';
import { resolveText } from '../../helpers/Globalizer';

interface CreateEditServiceParams {
    serviceId?: string;
}

interface ServiceEditPageProps extends RouteComponentProps<CreateEditServiceParams> {}

export const ServiceEditPage = (props: ServiceEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const matchedId = props.match.params.serviceId;
    if(!isNew && !props.match.params.serviceId) {
        throw new Error('Invalid link');
    }
    

    return (
        <>
            <h1>{isNew ? resolveText('Service_Create') : resolveText('Service_Edit')}</h1>
            <ServiceEditForm serviceId={matchedId} />
        </>
    );

}