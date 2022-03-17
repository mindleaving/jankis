import React, { Fragment } from 'react';
import { Accordion, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface DepartmentMenuProps {
    departments: Models.Department[];
}

export const DepartmentMenu = (props: DepartmentMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Department')} id="menu-department">
                <NavDropdown.Item onClick={() => navigate('/rooms')}>{resolveText('Rooms')}</NavDropdown.Item>
                <Accordion>
                {props.departments.map(department => (
                    <Fragment key={department.id}>
                        <NavDropdown.Divider />
                        <Accordion.Header as={NavDropdown.Header} className="clickable" eventKey={department.id}>
                            <b>{department.name}</b>
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={department.id}>
                            <>
                                <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/services`)}>{resolveText('Services')}</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/requests`)}>{resolveText('ServiceRequests')}</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/stocks`)}>{resolveText('Stocks')}</NavDropdown.Item>
                            </>
                        </Accordion.Collapse>
                    </Fragment>
                ))}
                </Accordion>
            </NavDropdown>
        </Nav>
    );

}