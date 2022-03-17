import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ServiceRequestsFilterView } from '../../components/Services/ServiceRequestsFilterView';
import { ServiceRequestsList } from '../../components/Services/ServiceRequestsList';
import { ServiceRequestsFilter } from '../../types/frontendTypes';

interface ServiceRequestsListPageProps {
}

export const ServiceRequestsListPage = (props: ServiceRequestsListPageProps) => {

    const { serviceId, departmentId } = useParams();
    const [ filter, setFilter ] = useState<ServiceRequestsFilter>({ serviceId: serviceId, departmentId: departmentId });

    useEffect(() => {
        setFilter({ 
            serviceId: serviceId, 
            departmentId: departmentId 
        });
    }, [ serviceId, departmentId ]);
    
    return (<>
            <h1>{resolveText('ServiceRequests')}</h1>
            <ServiceRequestsFilterView filter={filter} setFilter={setFilter} />
            <ServiceRequestsList filter={filter} />
        </>
    );

}