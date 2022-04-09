import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface EmergencyGuestMenuProps {}

export const EmergencyGuestMenu = (props: EmergencyGuestMenuProps) => {

    const navigate = useNavigate();
    const emergencyPersonId = sessionStorage.getItem("emergencyPersonId");

    return (
        <Nav>
            <NavItem>
                <NavLink onClick={() => navigate(`/healthrecord/${emergencyPersonId}`)}>
                    <b className='red'>{resolveText("Menu_BackToEmergencyProfile")}</b>
                </NavLink>
            </NavItem>
        </Nav>
    );

}