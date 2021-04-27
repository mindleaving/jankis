import React, { useState } from 'react';
import { ResourcesFilterView } from '../../components/Resources/ResourcesFilterView';
import { ResourcesList } from '../../components/Resources/ResourcesList';
import { resolveText } from '../../helpers/Globalizer';
import { ResourcessFilter } from '../../types/frontendTypes';

interface ResourcesListPageProps {}

export const ResourcesListPage = (props: ResourcesListPageProps) => {

    const [ filter, setFilter ] = useState<ResourcessFilter>({});

    return (
        <>
            <h1>{resolveText('Resources')}</h1>
            <ResourcesFilterView setFilter={setFilter} />
            <ResourcesList filter={filter} />
        </>
    );

}