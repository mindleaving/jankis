import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { OrderDirection } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { deleteObject } from '../../../sharedCommonComponents/helpers/DeleteHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { formatPerson } from '../../helpers/Formatters';
import { PersonsFilter } from '../../types/frontendTypes';

interface PersonsListProps {
    filter?: PersonsFilter;
}

export const PersonsList = (props: PersonsListProps) => {

    const [ persons, setPersons ] = useState<Models.Person[]>([]);
    const [ orderBy, setOrderBy ] = useState<string>('lastname');
    const [ orderDirection, setOrderDirection ] = useState<OrderDirection>(OrderDirection.Ascending);
    const navigate = useNavigate();
    const personsLoader = useMemo(() => new PagedTableLoader<Models.Person>(
        'api/persons',
        resolveText('Persons_CouldNotLoad'),
        setPersons,
        props.filter
    ), [ props.filter ]);

    const setOrderByOrOrderDirection = (newOrderBy: string) => {
        if(newOrderBy !== orderBy) {
            setOrderBy(newOrderBy);
            setOrderDirection(OrderDirection.Ascending);
        } else {
            setOrderDirection(orderDirection === OrderDirection.Ascending ? OrderDirection.Descending : OrderDirection.Ascending);
        }
    }

    const deletePerson = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmDeleteAlert(
                name,
                resolveText('Person_ConfirmDelete_Title'),
                resolveText('Person_ConfirmDelete_Message'),
                () => deletePerson(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/persons/${id}`,
            {},
            resolveText('Person_SuccessfullyDeleted'),
            resolveText('Person_CouldNotDelete'),
            () => setPersons(persons.filter(x => x.id !== id))
        );
    }

    return (
        <PagedTable
            onPageChanged={personsLoader.load}
            orderBy={orderBy}
            orderDirection={orderDirection}
            hasCreateNewButton
            onCreateNew={() => navigate('/create/person')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th onClick={() => setOrderByOrOrderDirection('lastname')}>{resolveText('Person_Name')}</th>
                    <th onClick={() => setOrderByOrOrderDirection('birthdate')}>{resolveText('Person_BirthDate')}</th>
                    <th onClick={() => setOrderByOrOrderDirection('insurer')}>{resolveText('Insurance_InsurerName')}</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {persons.length > 0
                ? persons.map(person => (
                    <tr key={person.id}>
                        <td><i className="fa fa-trash red clickable" onClick={() => deletePerson(person.id, formatPerson(person))} /></td>
                        <td>{`${person.firstName} ${person.lastName}`}</td>
                        <td>{new Date(person.birthDate).toLocaleDateString()}</td>
                        <td>{person.healthInsurance?.insurerName}</td>
                        <td>
                            <Button variant="primary" onClick={() => navigate(`/healthrecord/${person.id}`)}>{resolveText('Open')}</Button>
                        </td>
                        <td><Button variant="link" onClick={() => navigate(`/persons/${person.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={6}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}