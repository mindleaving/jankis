import React, { useMemo, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PagedTable } from '../components/PagedTable';
import { resolveText } from '../helpers/Globalizer';
import PagedTableLoader from '../helpers/PagedTableLoader';
import { Models } from '../types/models';

interface PatientsListPageProps {}
interface PatientFilter {
    searchText?: string;
}

export const PatientsListPage = (props: PatientsListPageProps) => {

    const [ filter, setFilter ] = useState<PatientFilter>({});
    const [ patients, setPatients ] = useState<Models.Person[]>([]);
    const patientsLoader = useMemo(() => new PagedTableLoader<Models.Person>(
        'api/patients',
        resolveText("Patients_CouldNotLoad"),
        setPatients,
        filter
    ), [ filter ]);
    const navigate = useNavigate();

    return (
        <>
            <h1>{resolveText("Patients")}</h1>
            <FormGroup>
                <FormLabel>{resolveText("Search")}</FormLabel>
                <FormControl
                    value={filter.searchText ?? ''}
                    onChange={(e:any) => setFilter({ searchText: e.target.value })}
                    placeholder={resolveText("Search")}
                />
            </FormGroup>
            <PagedTable
                onPageChanged={patientsLoader.load}
            >
                <thead>
                    <tr>
                        <th>{resolveText("Person_ID")}</th>
                        <th>{resolveText("Person_Name")}</th>
                        <th>{resolveText("Person_BirthDate")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.firstName} {patient.lastName}</td>
                            <td>{patient.birthDate}</td>
                            <td>
                                <Button onClick={() => navigate(`/patient/${patient.id}`)}>{resolveText("Open")}</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </PagedTable>
        </>
    );

}