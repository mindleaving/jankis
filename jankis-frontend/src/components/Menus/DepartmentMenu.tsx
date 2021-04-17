import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';

interface DepartmentMenuProps {}

export const DepartmentMenu = (props: DepartmentMenuProps) => {

    const history = useHistory();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Department')} id="menu-department">
                <NavDropdown.Item onClick={() => history.push('/rooms')}>{resolveText('Rooms')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/departments/services')}>{resolveText('Services')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/departments/requests')}>{resolveText('ServiceRequests')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}