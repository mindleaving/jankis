import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';

interface SharerMenuProps {}

export const SharerMenu = (props: SharerMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem onClick={() => navigate("/sharer")}>{resolveText("Menu_MyData")}</NavItem>
            <NavItem onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavItem>
        </Nav>
    );

}