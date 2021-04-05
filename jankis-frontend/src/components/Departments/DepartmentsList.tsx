import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { DepartmentsFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';

interface DepartmentsListProps {
    filter?: DepartmentsFilter;
}

export const DepartmentsList = (props: DepartmentsListProps) => {

    const [ departments, setDepartments ] = useState<Models.Department[]>([]);
    const history = useHistory();
    const filter = props.filter;

    const departmentsLoader = new PagedTableLoader<Models.Department>(
        'api/departments',
        resolveText('Departments_CouldNotLoad'),
        setDepartments,
        filter
    )

    return (
        <PagedTable
            onPageChanged={departmentsLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/department')}
        >
            <thead>
                <tr>
                    <th>{resolveText('Department_Name')}</th>
                    <th>{resolveText('Department_ParentDepartment')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {departments.map(department => (
                    <tr>
                        <td>{department.name}</td>
                        <td>{department.parentDepartment}</td>
                        <td><Button variant="link" onClick={() => history.push(`/departments/${department.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))}
            </tbody>
        </PagedTable>
    );

}