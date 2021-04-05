import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { EmployeesFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';

interface EmployeesListProps {
    filter?: EmployeesFilter;
}

export const EmployeesList = (props: EmployeesListProps) => {

    const [ users, setUsers ] = useState<Models.Employee[]>([]);
    const filter = props.filter;
    const employeesLoader = useMemo(() => new PagedTableLoader<Models.Employee>(
        'api/employees', 
        resolveText('Employees_CouldNotLoad'),
        setUsers,
        filter), 
    [ filter ]);
    const history = useHistory();
    
    return (
        <PagedTable
            onPageChanged={employeesLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/employee')}
        >
            <thead>
                <tr>
                    <th>{resolveText('ID')}</th>
                    <th>{resolveText('FirstName')}</th>
                    <th>{resolveText('LastName')}</th>
                    <th>{resolveText('UserManagement_Roles')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0
                ? users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.roles.join(', ')}</td>
                        <td><a href={`/employees/${user.id}/edit`} target="_blank" rel="noreferrer">Edit...</a></td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}