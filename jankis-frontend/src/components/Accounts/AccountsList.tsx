import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { AccountsFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';
import { PagedTable } from '../PagedTable';

interface AccountsListProps {
    filter?: AccountsFilter;
}

export const AccountsList = (props: AccountsListProps) => {

    const [ users, setUsers ] = useState<ViewModels.AccountViewModel[]>([]);
    const filter = props.filter;
    const accountLoader = useMemo(() => new PagedTableLoader<ViewModels.AccountViewModel>(
        'api/accounts', 
        resolveText('Accounts_CouldNotLoad'),
        setUsers,
        filter),
    [ filter ]);
    const history = useHistory();

    const confirmDeleteAccount = (username: string, name: string) => {
        confirmAlert({
            title: resolveText('Account_ConfirmDelete_Title'),
            message: resolveText('Account_ConfirmDelete_Message').replace('{0}', name),
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                }, 
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => deleteAccount(username, name, true)
                }
            ]
        });
    }
    const deleteAccount = async (username: string, name: string, force: boolean = false) => {
        if(!force) {
            confirmDeleteAccount(username, name);
            return;
        }
        await deleteObject(
            `api/accounts/${username}`,
            {},
            resolveText('Account_SuccessfullyDeleted'),
            resolveText('Account_CouldNotDelete'),
            () => setUsers(users.filter(x => x.username !== username))
        )
    }
    
    return (
        <PagedTable
            onPageChanged={accountLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/account')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Username')}</th>
                    <th>{resolveText('FirstName')}</th>
                    <th>{resolveText('LastName')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0
                ? users.map(user => (
                    <tr key={user.username}>
                        <td><i className="fa fa-trash red clickable" onClick={() => deleteAccount(user.username, `${user.profileData.firstName} ${user.profileData.lastName}`)} /></td>
                        <td>{user.username}</td>
                        <td>{user.profileData.firstName}</td>
                        <td>{user.profileData.lastName}</td>
                        <td><Button className="p-0" variant="link" onClick={() => history.push(`/accounts/${user.username}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}