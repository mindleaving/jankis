import React, { useState } from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { EmployeesList } from '../../components/Employees/EmployeesList';
import { EmployeesFilter } from '../../types/frontendTypes';
import { EmployeesFilterView } from '../../components/Employees/EmployeesFilterView';

interface EmployeesListPageProps {
    
}

export const EmployeesListPage = (props: EmployeesListPageProps) => {

    const [ filter, setFilter ] = useState<EmployeesFilter>({});
    return (
        <>
            <h1>{resolveText('UserManagement')}</h1>
            <EmployeesFilterView setFilter={setFilter} />
            <EmployeesList filter={filter} />
        </>
    );

}