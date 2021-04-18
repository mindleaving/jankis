import React from 'react';
import { ServiceRequestsFilter } from '../../types/frontendTypes';

interface ServiceRequestsListPageProps {
    filter?: ServiceRequestsFilter;
}

export const ServiceRequestsListPage = (props: ServiceRequestsListPageProps) => {

    return (
        <h1>ServiceRequestsListPage</h1>
    );

}