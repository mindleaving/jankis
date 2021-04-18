import React, { Fragment } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';

interface DepartmentMenuProps {
    departments: Models.Department[];
}

export const DepartmentMenu = (props: DepartmentMenuProps) => {

    const history = useHistory();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Department')} id="menu-department">
                <NavDropdown.Item onClick={() => history.push('/rooms')}>{resolveText('Rooms')}</NavDropdown.Item>
                {props.departments.map(department => (
                    <Fragment key={department.id}>
                        <NavDropdown.Divider />
                        <NavDropdown.Header><b>{department.name}</b></NavDropdown.Header>
                        <NavDropdown.Item onClick={() => history.push(`/departments/${department.id}/services`)}>{resolveText('Services')}</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => history.push(`/departments/${department.id}/requests`)}>{resolveText('ServiceRequests')}</NavDropdown.Item>
                    </Fragment>
                ))}
            </NavDropdown>
        </Nav>
    );

}