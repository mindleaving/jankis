import React, { useState } from 'react';
import { DiseaseFilter } from '../components/DiseaseList/DiseaseFilter';
import { DiseaseList } from '../components/DiseaseList/DiseaseList';
import { Models } from '../types/models';

interface DiseaseListPageProps {

}

export const DiseaseListPage = (props: DiseaseListPageProps) => {

    const [filter, setFilter] = useState<Models.Filters.DiseaseFilter>({});

    return (
        <>
            <h1>List of diseases</h1>
            <DiseaseFilter setFilter={setFilter} />
            <DiseaseList filter={filter} />
        </>
    );
}