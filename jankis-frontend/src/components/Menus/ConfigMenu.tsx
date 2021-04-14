import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';

interface ConfigMenuProps {}

export const ConfigMenu = (props: ConfigMenuProps) => {

    const history = useHistory();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Config')} id="menu-config">
                <NavDropdown.Item onClick={() => history.push('/institution')}>{resolveText('Menu_Config_Institution')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/departments')}>{resolveText('Menu_Config_Departments')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/accounts')}>{resolveText('Menu_Config_Accounts')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/roles')}>{resolveText('Menu_Config_Roles')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}