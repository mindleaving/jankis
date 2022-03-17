import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { DrugsFilterView } from '../../../sharedHealthComponents/components/Drugs/DrugsFilterView';
import { DrugsList } from '../../../sharedHealthComponents/components/Drugs/DrugsList';
import { DrugsFilter } from '../../../sharedHealthComponents/types/frontendTypes';

interface DrugsListPageProps {}

export const DrugsListPage = (props: DrugsListPageProps) => {

    const [ filter, setFilter] = useState<DrugsFilter>({});
    return (
        <>
            <h1>{resolveText('Drugs')}</h1>
            <DrugsFilterView setFilter={setFilter} />
            <DrugsList filter={filter} />
        </>
    );

}