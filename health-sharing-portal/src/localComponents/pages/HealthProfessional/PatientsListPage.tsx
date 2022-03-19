import { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PersonsFilterView } from '../../../sharedHealthComponents/components/Patients/PersonsFilterView';
import { PersonsList } from '../../../sharedHealthComponents/components/Patients/PersonsList';
import { PersonsFilter } from '../../../sharedHealthComponents/types/frontendTypes';
import { AccessRequestList } from '../../components/AccessRequestList';

interface PatientsListPageProps {}

export const PatientsListPage = (props: PatientsListPageProps) => {

    const [ filter, setFilter ] = useState<PersonsFilter>({});

    return (
        <>
            <h1>{resolveText("Patients")}</h1>

            <h2>{resolveText("AccessInvites")}</h2>
            <AccessRequestList />
            <hr />
            <h2>{resolveText("ActiveAccess")}</h2>
            <PersonsFilterView filter={filter} setFilter={setFilter} />
            <PersonsList filter={filter} />
        </>
    );

}