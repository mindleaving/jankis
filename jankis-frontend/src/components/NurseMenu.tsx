import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../helpers/Globalizer';

interface NurseMenuProps {}

export const NurseMenu = (props: NurseMenuProps) => {

    const history = useHistory();
    return (
        <Nav className="mr-auto">
            <NavDropdown title={resolveText('Menu_Nursing')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/nursing/rooms')}>{resolveText('Menu_Rooms')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/nursing/patients')}>{resolveText('Menu_Patients')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Services')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/services/pharmacy')}>{resolveText('Menu_Pharmacy')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/services/kitchen')}>{resolveText('Menu_Kitchen')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/services/physiotherapy')}>{resolveText('Menu_Physio')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/services/beds')}>{resolveText('Menu_Beds')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Ward')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/ward/rooms')}>{resolveText('Menu_Rooms')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/ward/drugstorage')}>{resolveText('Menu_DrugStorage')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/ward/calendar')}>{resolveText('Menu_Calendar')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/ward/handover')}>{resolveText('Menu_Handover')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}