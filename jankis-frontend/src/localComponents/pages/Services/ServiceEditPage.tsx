import React from 'react';
import { useLocation, useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ServiceEditForm } from '../../components/Services/ServiceEditForm';

interface ServiceEditPageProps {}

export const ServiceEditPage = (props: ServiceEditPageProps) => {

    const location = useLocation();
    const { serviceId } = useParams();
    const isNew = location.pathname.toLowerCase().startsWith('/create');
    const matchedId = serviceId;
    if(!isNew && !matchedId) {
        throw new Error('Invalid link');
    }
    

    return (
        <>
            <h1>{isNew ? resolveText('Service_Create') : resolveText('Service_Edit')}</h1>
            <ServiceEditForm serviceId={matchedId} />
        </>
    );

}