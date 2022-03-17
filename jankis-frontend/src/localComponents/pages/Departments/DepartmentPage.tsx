import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { Models } from '../../types/models';


interface DepartmentPageProps {}

export const DepartmentPage = (props: DepartmentPageProps) => {

    const { departmentId } = useParams();
    const id = departmentId;
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