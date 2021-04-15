import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { ServiceEditForm } from '../../components/Services/ServiceEditForm';
import { resolveText } from '../../helpers/Globalizer';
import { v4 as uuid } from 'uuid';

interface CreateEditServiceParams {
    serviceId?: string;
}

interface ServiceEditPageProps extends RouteComponentProps<CreateEditServiceParams> {}

export const ServiceEditPage = (props: ServiceEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.serviceId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.serviceId ?? uuid();

    useEffect(() => {

    }, []);

    return (
        <>
            <h1>{resolveText(isNew ? 'Service_Create' : 'Service_Edit')}</h1>
            <ServiceEditForm serviceId={id} />
        </>
    );

}