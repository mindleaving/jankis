import React, { useEffect, useState } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';

interface InstitutionsListPageProps {}

export const InstitutionsListPage = (props: InstitutionsListPageProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ institutions, setInstitutions ] = useState<Models.Institution[]>([]);
    const history = useHistory();

    useEffect(() => {
        setIsLoading(true);
        const loadInstitutions = buildLoadObjectFunc<Models.Institution[]>(
            'api/institutions',
            {},
            resolveText('Institutions_CouldNotLoad'),
            setInstitutions,
            () => setIsLoading(false)
        );
        loadInstitutions();
    }, []);

    const deleteInstitution = (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmAlert(
                id, name,
                resolveText('Institution_ConfirmDelete_Title'),
                resolveText('Institution_ConfirmDelete_Message'),
                () => deleteInstitution(id, name, true)
            );
            return;
        }
        setInstitutions(institutions.filter(x => x.id !== id));
    }
    return (
        <>
            <h1>{resolveText('Institutions')}</h1>
            <Row>
                <Col></Col>
                <Col xs="auto">
                    <Button className="m-2" onClick={() => history.push('/create/institution')}>{resolveText('CreateNew')}</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table>
                        <colgroup>
                            <col width="100px" />
                            <col width="*" />
                            <col width="150px" />
                            <col width="150px" />
                            <col width="150px" />
                            <col width="150px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th>{resolveText('Institution_Name')}</th>
                                <th>{resolveText('Institution_RoomCount')}</th>
                                <th>{resolveText('Institution_DepartmentCount')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr><td colSpan={3} className="text-center">{resolveText('Loading...')}</td></tr>
                            : institutions.length > 0
                                ? institutions.map(institution => (
                                    <tr key={institution.id}>
                                        <td><i className="fa fa-trash red clickable" onClick={() => deleteInstitution(institution.id, institution.name)} /></td>
                                        <td>{institution.name}</td>
                                        <td>{institution.rooms.length}</td>
                                        <td>{institution.departments.length}</td>
                                        <td><Button variant="link" onClick={() => history.push(`/institutions/${institution.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                                    </tr>
                                ))
                                : <tr>
                                    <td colSpan={3} className="text-center">{resolveText('NoEntries')}</td>
                                </tr>}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );

}