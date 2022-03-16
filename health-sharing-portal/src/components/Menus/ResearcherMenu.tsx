import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface ResearcherMenuProps {}

export const ResearcherMenu = (props: ResearcherMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem>
                <NavLink onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavLink>
            </NavItem>
        </Nav>
    );

}