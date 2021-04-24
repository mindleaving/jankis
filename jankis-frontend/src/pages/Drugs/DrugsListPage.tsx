import React, { useState } from 'react';
import { DrugsFilterView } from '../../components/Drugs/DrugsFilterView';
import { resolveText } from '../../helpers/Globalizer';
import { DrugsFilter } from '../../types/frontendTypes';
import { DrugsList } from '../../components/Drugs/DrugsList';

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