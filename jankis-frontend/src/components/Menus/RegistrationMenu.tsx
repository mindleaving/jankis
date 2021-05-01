import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface RegistrationMenuProps {}

export const RegistrationMenu = (props: RegistrationMenuProps) => {

    const history = useHistory();
    return (
        <Nav className="mr-auto">
            <NavDropdown title={resolveText('Menu_Registration')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/create/patient')}>{resolveText('Menu_CreatePatient')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/persons')}>{resolveText('Menu_PatientList')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={resolveText('Menu_Admission')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => history.push('/admissions')}>{resolveText('Menu_ListOfAdmissions')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/admission/admit')}>{resolveText('Menu_Admit')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/admission/orderdiagnostics')}>{resolveText('Menu_OrderDiagnostics')}</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push('/admission/schedulebeds')}>{resolveText('Menu_ScheduleBeds')}</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );

}