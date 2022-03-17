import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface ConfigMenuProps {}

export const ConfigMenu = (props: ConfigMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Config')} id="menu-config">
                <NavDropdown.Item onClick={() => navigate('/institutions')}>{resolveText('Menu_Config_Institutions')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/departments')}>{resolveText('Menu_Config_Departments')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/accounts')}>{resolveText('Menu_Config_Accounts')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/roles')}>{resolveText('Menu_Config_Roles')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/drugs')}>{resolveText('Menu_Config_Drugs')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}