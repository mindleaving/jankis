import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface SharerMenuProps {}

export const SharerMenu = (props: SharerMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem>
                <NavLink onClick={() => navigate("/sharer")}>{resolveText("Menu_MyData")}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavLink>
            </NavItem>
        </Nav>
    );

}