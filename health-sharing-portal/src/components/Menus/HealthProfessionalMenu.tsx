import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface HealthProfessionalMenuProps {}

export const HealthProfessionalMenu = (props: HealthProfessionalMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem onClick={() => navigate("/patients")}>{resolveText("Menu_MyPatients")}</NavItem>
        </Nav>
    );

}