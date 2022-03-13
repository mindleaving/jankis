import React, { useContext, useMemo, useState } from 'react';
import { FormControl, FormGroup, FormLabel, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PagedTable } from '../components/PagedTable';
import UserContext from '../contexts/UserContext';
import { resolveText } from '../helpers/Globalizer';
import PagedTableLoader from '../helpers/PagedTableLoader';
import { AccountType } from '../types/enums';
import { Models } from '../types/models';

interface StudiesPageProps {}
interface StudyFilter {
    searchText?: string;
}

export const StudiesPage = (props: StudiesPageProps) => {

    const [ studies, setStudies ] = useState<Models.Study[]>([]);
    const [ filter, setFilter ] = useState<StudyFilter>({});
    const studiesLoader = useMemo(() => new PagedTableLoader<Models.Study>('api/studies', resolveText("Studies_CouldNotLoad"), setStudies, filter), [ filter ]);
    const user = useContext(UserContext)!;
    const navigate = useNavigate();

    return (
        <>
            <h1>Studies</h1>
            <FormGroup>
                <FormLabel>{resolveText("Search")}</FormLabel>
                <FormControl
                    value={filter.searchText ?? ''}
                    onChange={(e:any) => setFilter({ searchText: e.target.value })}
                    placeholder={resolveText("Search...")}
                />
            </FormGroup>
            <PagedTable
                onPageChanged={studiesLoader.load}
                hasCreateNewButton={user.accountType === AccountType.Researcher}
                onCreateNew={() => navigate("/create/study")}
            >
                <tbody>
                    {studies.map(study => (
                        <tr key={study.id}>
                            <td>
                                <b>{study.title}</b>
                                <div><small>{study.description}</small></div>
                            </td>
                            <td>
                                <ul>
                                    {study.contactPersons.map(contactPerson => (
                                        <li key={contactPerson.id}>{contactPerson.name}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </PagedTable>
        </>
    );

}