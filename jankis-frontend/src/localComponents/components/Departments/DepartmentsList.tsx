import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { deleteObject } from '../../../sharedCommonComponents/helpers/DeleteHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { DepartmentsFilter } from '../../../sharedHealthComponents/types/frontendTypes';
import { ViewModels } from '../../types/viewModels';

interface DepartmentsListProps {
    filter?: DepartmentsFilter;
}

export const DepartmentsList = (props: DepartmentsListProps) => {

    const [ departments, setDepartments ] = useState<ViewModels.DepartmentViewModel[]>([]);
    const navigate = useNavigate();
    const filter = props.filter;

    const departmentsLoader = useMemo(() => new PagedTableLoader<ViewModels.DepartmentViewModel>(
        'api/departments',
        resolveText('Departments_CouldNotLoad'),
        setDepartments,
        filter
    ), [ filter ]);

    const confirmDeleteDepartment = (id: string, name: string) => {
        confirmAlert({
            title: resolveText('Department_ConfirmDelete_Title'),
            message: resolveText('Department_ConfirmDelete_Message').replace('{0}', name),
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                },
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => deleteDepartment(id, name, true)
                }
            ]
        });
    }
    const deleteDepartment = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            confirmDeleteDepartment(id, name);
            return;
        }
        await deleteObject(
            `api/departments/${id}`,
            {},
            resolveText('Department_SuccessfullyDeleted'),
            resolveText('Department_CouldNotDelete'),
            () => setDepartments(departments.filter(x => x.id !== id))
        )
    }

    return (
        <PagedTable
            onPageChanged={departmentsLoader.load}
            hasCreateNewButton
            onCreateNew={() => navigate('/create/department')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Department_Name')}</th>
                    <th>{resolveText('Department_ParentDepartment')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {departments.length > 0
                ? departments.map(department => (
                    <tr key={department.id}>
                        <td><i className="fa fa-trash red clickable" onClick={() => deleteDepartment(department.id, department.name)} /></td>
                        <td>{department.name}</td>
                        <td>{department.parentDepartment?.name}</td>
                        <td><Button variant="link" onClick={() => navigate(`/departments/${department.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={3}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}