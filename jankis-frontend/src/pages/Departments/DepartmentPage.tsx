import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';

interface DepartmentParams {
    departmentId?: string;
}
interface DepartmentPageProps extends RouteComponentProps<DepartmentParams> {}

export const DepartmentPage = (props: DepartmentPageProps) => {

    const id = props.match.params.departmentId;
    const [ department, setDepartment ] = useState<Models.Department>();

    useEffect(() => {
        if(!id) {
            return;
        }
        const loadDepartment = buildLoadObjectFunc<Models.Department>(
            `api/departments/${id}`,
            {},
            resolveText('Department_CouldNotLoad'),
            setDepartment
        );
        loadDepartment();
    }, [ id ]);

    if(!department) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('Department')} - {department.name}</h1>
            <h2>{resolveText('Department_Employees')}</h2>
            <h2>{resolveText('Department_Stocks')}</h2>
        </>
    );

}