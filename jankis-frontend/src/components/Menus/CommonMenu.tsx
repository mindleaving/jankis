import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface CommonMenuProps {}

export const CommonMenu = (props: CommonMenuProps) => {

    const history = useHistory();
    return (
        <Nav className="mr-1">
            <NavDropdown title={resolveText('Menu_Common')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/contacts')}>{resolveText('Menu_Contacts')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/consumables')}>{resolveText('Menu_Consumables')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/resources')}>{resolveText('Menu_Resources')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}