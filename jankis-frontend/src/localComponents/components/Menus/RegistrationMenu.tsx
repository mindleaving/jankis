import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface RegistrationMenuProps {}

export const RegistrationMenu = (props: RegistrationMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav className="mr-auto">
            <NavDropdown title={resolveText('Menu_Registration')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate('/create/patient')}>{resolveText('Menu_CreatePatient')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/persons')}>{resolveText('Menu_PatientList')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Admission')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate('/admissions')}>{resolveText('Menu_ListOfAdmissions')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/admission/admit')}>{resolveText('Menu_Admit')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/admission/orderdiagnostics')}>{resolveText('Menu_OrderDiagnostics')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/admission/schedulebeds')}>{resolveText('Menu_ScheduleBeds')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}