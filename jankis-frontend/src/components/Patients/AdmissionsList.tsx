import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { AdmissionsFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';

interface AdmissionsListProps {
    filter: AdmissionsFilter;
}

export const AdmissionsList = (props: AdmissionsListProps) => {

    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const admissionsLoader = useMemo(() => new PagedTableLoader<Models.Admission>('api/admissions', resolveText('Admissions_CouldNotLoad'), setAdmissions, props.filter), [ props.filter ]);
    const history = useHistory();

    return (
        <>
            <h1>{resolveText('Admissions')}</h1>
            <PagedTable
                onPageChanged={admissionsLoader.load}
                hasCreateNewButton
                onCreateNew={() => history.push('/create/admission')}
            >
                <thead>
                    <tr>
                        <th>{resolveText('Admission_Name')}</th>
                        <th>{resolveText('Admission_AdmissionDate')}</th>
                        <th>{resolveText('Admission_Ward')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {admissions.length > 0
                    ? admissions.map(admission => (
                        <tr key={admission.id}>
                            <td>{}</td>
                            <td>{}</td>
                            <td>{}</td>
                            <td><Button onClick={() => history.push(`/admissions/${admission.id}`)}>{resolveText('Open')}</Button></td>
                        </tr>
                    ))
                    : <tr>
                        <td colSpan={4}>{resolveText('NoEntries')}</td>
                    </tr>}
                </tbody>
            </PagedTable>
        </>
    );

}