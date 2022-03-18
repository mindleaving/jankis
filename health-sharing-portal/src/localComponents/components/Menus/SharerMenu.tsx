import React, { useContext } from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../contexts/UserContext';

interface SharerMenuProps {}

export const SharerMenu = (props: SharerMenuProps) => {

    const user = useContext(UserContext)!;
    const navigate = useNavigate();
    return (
        <Nav>
            <NavItem>
                <NavLink onClick={() => navigate(`/healthrecord/${user.profileData.id}`)}>{resolveText("Menu_MyData")}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink onClick={() => navigate("/studies")}>{resolveText("Menu_Studies")}</NavLink>
            </NavItem>
        </Nav>
    );

}