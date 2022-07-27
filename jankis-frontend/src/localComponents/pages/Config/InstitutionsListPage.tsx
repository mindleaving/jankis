import React, { useEffect, useState } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { ViewModels } from '../../types/viewModels';

interface InstitutionsListPageProps {}

export const InstitutionsListPage = (props: InstitutionsListPageProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ institutions, setInstitutions ] = useState<ViewModels.InstitutionViewModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const loadInstitutions = buildLoadObjectFunc<ViewModels.InstitutionViewModel[]>(
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
            openConfirmDeleteAlert(
                name,
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
                    <Button className="m-2" onClick={() => navigate('/create/institution')}>{resolveText('CreateNew')}</Button>
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
                                        <td><Button variant="link" onClick={() => navigate(`/institutions/${institution.id}/edit`)}>{resolveText('Edit...')}</Button></td>
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