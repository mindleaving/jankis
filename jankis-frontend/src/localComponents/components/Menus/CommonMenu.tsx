import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface CommonMenuProps {}

export const CommonMenu = (props: CommonMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav className="mr-1">
            <NavDropdown title={resolveText('Menu_Common')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate('/contacts')}>{resolveText('Menu_Contacts')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/consumables')}>{resolveText('Menu_Consumables')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/resources')}>{resolveText('Menu_Resources')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}