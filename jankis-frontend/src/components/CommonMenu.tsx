import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../helpers/Globalizer';

interface CommonMenuProps {}

export const CommonMenu = (props: CommonMenuProps) => {

    const history = useHistory();
    return (
        <Nav className="mr-auto">
            <NavDropdown title={resolveText('Menu_Common')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/contacts')}>{resolveText('Menu_Contacts')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}