import React, { useState } from 'react';
import { PagedTable } from '../../components/PagedTable';
import { resolveText } from '../../helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';
import { Models } from '../../types/models';

interface UserManagementPageProps {}

export const UserManagementPage = (props: UserManagementPageProps) => {

    const [ users, setUsers ] = useState<Models.Employee[]>([]);
    const loadUsers = async (pageIndex: number, entriesPerPage: number) => {
        try {
            const response = await apiClient.get('api/employees', {
                count: entriesPerPage + '',
                skip: (pageIndex * entriesPerPage) + ''
            });
            const users = await response.json() as Models.Employee[];
            setUsers(users);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('UserManagement_CouldNotLoadUsers'));
        }
    }

    return (
        <>
            <h1>{resolveText('UserManagement')}</h1>
            <PagedTable
                bordered
                onPageChanged={loadUsers}
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
                            <td>{user.roles.map(role => role.name).join(', ')}</td>
                            <td><a href={`/employees/${user.id}/edit`} target="_blank" rel="noreferrer">Edit...</a></td>
                        </tr>
                    ))
                    : <tr>
                        <td colSpan={5} className="text-center">{resolveText('NoEntries')}</td>
                    </tr>}
                </tbody>
            </PagedTable>
        </>
    );

}