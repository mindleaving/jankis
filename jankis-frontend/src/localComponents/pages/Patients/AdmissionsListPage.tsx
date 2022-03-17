import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AdmissionsFilter } from '../../../sharedHealthComponents/types/frontendTypes';
import { AdmissionsFilterView } from '../../components/Patients/AdmissionsFilterView';
import { AdmissionsList } from '../../components/Patients/AdmissionsList';

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