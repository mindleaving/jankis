import React, { useEffect, useState } from 'react';
import { ServicesList } from '../../components/Services/ServicesList';
import { ServicesFilter } from '../../types/frontendTypes';
import { ServicesFilterView } from '../../components/Services/ServicesFilterView';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useParams } from 'react-router-dom';

interface ServicesListPageProps {
}

export const ServicesListPage = (props: ServicesListPageProps) => {

    const { departmentId } = useParams();
    const [ filter, setFilter ] = useState<ServicesFilter>({ departmentId: departmentId });

    useEffect(() => {
        setFilter({ departmentId: departmentId });
    }, [ departmentId ]);
    
    return (
        <>
            <h1>{resolveText('Services')}</h1>
            <ServicesFilterView filter={filter} setFilter={setFilter} />
            <ServicesList filter={filter} />
        </>
    );

}