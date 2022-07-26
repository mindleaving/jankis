import React from 'react';
import { Button, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface LoggedInUserProps {
    user: ViewModels.IUserViewModel;
    onLogOut: () => void;
}

export const LoggedInUser = (props: LoggedInUserProps) => {

    const navigate = useNavigate();
    return (
        <Nav className='ms-auto'>
            <NavDropdown 
                title={`${resolveText('Hello')}, ${props.user.profileData?.firstName}`}
                className='me-2'
            >
                <NavDropdown.Item onClick={() => navigate('/account')}>{resolveText("Account_ManageAccount")}</NavDropdown.Item>
            </NavDropdown>
            <NavItem>
                <Button 
                    className="me-3"
                    variant="danger"
                    onClick={props.onLogOut}
                >
                    {resolveText('LogOut')}
                </Button>
            </NavItem>
        </Nav>
    );

}