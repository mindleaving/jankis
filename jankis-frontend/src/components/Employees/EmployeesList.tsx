import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';
import { deleteObject } from '../../helpers/DeleteHelpers';
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

    const confirmDeleteEmployee = (id: string, name: string) => {
        confirmAlert({
            title: resolveText('Employee_ConfirmDelete_Title'),
            message: resolveText('Employee_ConfirmDelete_Message').replace('{0}', name),
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                }, 
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => deleteEmployee(id, name, true)
                }
            ]
        });
    }
    const deleteEmployee = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            confirmDeleteEmployee(id, name);
            return;
        }
        await deleteObject(
            `api/employees/${id}`,
            {},
            resolveText('Employee_SuccessfullyDeleted'),
            resolveText('Employee_CouldNotDelete'),
            () => setUsers(users.filter(x => x.id !== id))
        )
    }
    
    return (
        <PagedTable
            onPageChanged={employeesLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/employee')}
        >
            <thead>
                <tr>
                    <th></th>
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
                        <td><i className="fa fa-trash red clickable" onClick={() => deleteEmployee(user.id, `${user.firstName} ${user.lastName}`)} /></td>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.roles.join(', ')}</td>
                        <td><Button className="p-0" variant="link" onClick={() => history.push(`/employees/${user.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}