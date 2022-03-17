import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { DepartmentsFilter } from '../../../sharedHealthComponents/types/frontendTypes';
import { DepartmentFilterView } from '../../components/Departments/DepartmentFilterView';
import { DepartmentsList } from '../../components/Departments/DepartmentsList';

interface DepartmentsListPageProps {}

export const DepartmentsListPage = (props: DepartmentsListPageProps) => {

    const [ filter, setFilter ] = useState<DepartmentsFilter>({});
    return (
        <>
            <h1>{resolveText('Departments')}</h1>
            <DepartmentFilterView setFilter={setFilter}/>
            <DepartmentsList filter={filter} />
        </>
    );

}