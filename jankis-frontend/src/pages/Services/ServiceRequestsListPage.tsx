import React, { useEffect, useState } from 'react';
import { ServiceRequestsFilterView } from '../../components/Services/ServiceRequestsFilterView';
import { ServiceRequestsList } from '../../components/Services/ServiceRequestsList';
import { resolveText } from '../../helpers/Globalizer';
import { ServiceRequestsFilter } from '../../types/frontendTypes';

interface ServiceRequestsListPageProps {
    filter?: ServiceRequestsFilter;
}

export const ServiceRequestsListPage = (props: ServiceRequestsListPageProps) => {

    const [ filter, setFilter ] = useState<ServiceRequestsFilter>(props.filter ?? {});

    useEffect(() => {
        setFilter(props.filter ?? {});
    }, [ props.filter ]);
    
    return (<>
            <h1>{resolveText('ServiceRequests')}</h1>
            <ServiceRequestsFilterView filter={filter} setFilter={setFilter} />
            <ServiceRequestsList filter={filter} />
        </>
    );

}