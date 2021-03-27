import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { ServicesList } from '../../components/Services/ServicesList';
import { resolveText } from '../../helpers/Globalizer';

interface ServicesListPageProps {}

export const ServicesListPage = (props: ServicesListPageProps) => {

    const history = useHistory();
    return (
        <>
            <h1>{resolveText('Services')}</h1>
            <Button onClick={() => history.push('/services/new')}>{resolveText('Service_CreateNew')}</Button>
            <ServicesList />
        </>
    );

}