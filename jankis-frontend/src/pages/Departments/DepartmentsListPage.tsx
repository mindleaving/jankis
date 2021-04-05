import React, { useState } from 'react';
import { DepartmentFilterView } from '../../components/Departments/DepartmentFilterView';
import { DepartmentsList } from '../../components/Departments/DepartmentsList';
import { resolveText } from '../../helpers/Globalizer';
import { DepartmentsFilter } from '../../types/frontendTypes';

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