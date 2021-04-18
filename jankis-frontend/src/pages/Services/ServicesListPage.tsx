import React, { useState } from 'react';
import { ServicesList } from '../../components/Services/ServicesList';
import { resolveText } from '../../helpers/Globalizer';
import { ServicesFilter } from '../../types/frontendTypes';
import { ServicesFilterView } from './ServicesFilterView';

interface ServicesListPageProps {
    filter?: ServicesFilter
}

export const ServicesListPage = (props: ServicesListPageProps) => {

    const [ filter, setFilter ] = useState<ServicesFilter>(props.filter ?? {});
    return (
        <>
            <h1>{resolveText('Services')}</h1>
            <ServicesFilterView filter={filter} setFilter={setFilter} />
            <ServicesList filter={filter} />
        </>
    );

}