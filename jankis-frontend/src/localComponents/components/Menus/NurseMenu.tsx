import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface NurseMenuProps {}

export const NurseMenu = (props: NurseMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Nursing')} id="menu-nursing">
                <NavDropdown.Item onClick={() => navigate('/nursing/rooms')}>{resolveText('Menu_Rooms')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/nursing/patients')}>{resolveText('Menu_Patients')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Services')} id="menu-services">
                <NavDropdown.Item onClick={() => navigate('/services/pharmacy')}>{resolveText('Menu_Pharmacy')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/services/kitchen')}>{resolveText('Menu_Kitchen')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/services/physiotherapy')}>{resolveText('Menu_Physio')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/services/beds')}>{resolveText('Menu_Beds')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Ward')} id="menu-ward">
                <NavDropdown.Item onClick={() => navigate('/ward/rooms')}>{resolveText('Menu_Rooms')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/ward/drugstorage')}>{resolveText('Menu_DrugStorage')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/ward/calendar')}>{resolveText('Menu_Calendar')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/ward/handover')}>{resolveText('Menu_Handover')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}