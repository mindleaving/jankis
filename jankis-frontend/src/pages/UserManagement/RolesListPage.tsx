import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router';
import { PagedTable } from '../../components/PagedTable';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { Models } from '../../types/models';

interface RolesListPageProps {}

export const RolesListPage = (props: RolesListPageProps) => {

    const [ roles, setRoles ] = useState<Models.Role[]>([]);
    const rolesLoader = useMemo(() => new PagedTableLoader<Models.Role>('api/roles', resolveText('Roles_CouldNotLoad'), setRoles), []);
    const history = useHistory();

    const confirmDeleteRole = (id: string, name: string) => {
        confirmAlert({
            title: resolveText('Role_ConfirmDelete_Title'),
            message: resolveText('Role_ConfirmDelete_Message').replace('{0}', name),
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                },
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => deleteRole(id, name, true)
                }
            ]
        });
    }
    const deleteRole = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            confirmDeleteRole(id, name);
            return;
        }
        await deleteObject(
            `api/roles/${id}`, 
            {}, 
            resolveText('Role_SuccessfullyDeleted'), 
            resolveText('Role_CouldNotDelete'), 
            () => {
                setRoles(roles.filter(x => x.id !== id));
            }
        );
    }
    return (
        <>
            <h1>{resolveText('Roles')}</h1>
            <PagedTable
                onPageChanged={rolesLoader.load}
                hasCreateNewButton
                onCreateNew={() => history.push('/create/role')}
            >
                <thead>
                    <tr>
                        <th></th>
                        <th>{resolveText('Role_Name')}</th>
                        <th>{resolveText('Role_Permissions')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr>
                            <td>{!role.isSystemRole ? <i className="fa fa-trash red clickable" onClick={() => deleteRole(role.id, role.name)} /> : null}</td>
                            <td>{role.name}</td>
                            <td><small>{role.permissions.map(permission => resolveText(`Permission_${permission}`)).join(" | ")}</small></td>
                            <td><Button variant="link" onClick={() => history.push(`/roles/${role.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                        </tr>
                    ))}
                </tbody>
            </PagedTable>
        </>
    );

}