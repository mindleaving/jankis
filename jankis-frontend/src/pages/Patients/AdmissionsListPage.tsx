import React, { useState } from 'react';
import { AdmissionsFilterView } from '../../components/Patients/AdmissionsFilterView';
import { AdmissionsList } from '../../components/Patients/AdmissionsList';
import { resolveText } from '../../helpers/Globalizer';
import { AdmissionsFilter } from '../../types/frontendTypes';

interface AdmissionsListPageProps {}

export const AdmissionsListPage = (props: AdmissionsListPageProps) => {

    const [ filter, setFilter ] = useState<AdmissionsFilter>({});

    return (
        <>
            <h1>{resolveText('Admissions')}</h1>
            <AdmissionsFilterView setFilter={setFilter} />
            <AdmissionsList filter={filter} />
        </>
    )

}