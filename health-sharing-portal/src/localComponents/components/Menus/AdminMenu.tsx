import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface AdminMenuProps {}

export const AdminMenu = (props: AdminMenuProps) => {

    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem>
                <NavLink onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavLink>
            </NavItem>
            <NavItem >
                <NavLink onClick={() => navigate("/accounts")}>{resolveText("Menu_Accounts")}</NavLink>
            </NavItem>
        </Nav>
    );

}