import React, { useState } from 'react';
import { PersonsFilterView } from '../../components/Patients/PersonsFilterView';
import { PersonsList } from '../../components/Patients/PersonsList';
import { resolveText } from '../../helpers/Globalizer';
import { PersonsFilter } from '../../types/frontendTypes';

interface PersonsListPageProps {
    filter?: PersonsFilter;
}

export const PersonsListPage = (props: PersonsListPageProps) => {

    const [ filter, setFilter ] = useState<PersonsFilter>(props.filter ?? {});
    return (
        <>
            <h1>{resolveText('Persons')}</h1>
            <PersonsFilterView filter={props.filter} setFilter={setFilter} />
            <PersonsList filter={filter} />
        </>
    );

}