import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface ResearcherMenuProps {}

export const ResearcherMenu = (props: ResearcherMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavItem>
        </Nav>
    );

}