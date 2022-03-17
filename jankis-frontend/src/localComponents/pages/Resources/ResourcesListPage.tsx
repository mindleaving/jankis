import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ResourcesFilterView } from '../../components/Resources/ResourcesFilterView';
import { ResourcesList } from '../../components/Resources/ResourcesList';
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