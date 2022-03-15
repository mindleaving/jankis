import React from 'react';
import { Button, Nav, Navbar, NavItem } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface LoggedInUserProps {
    user: ViewModels.LoggedInUserViewModel;
    onLogOut: () => void;
}

export const LoggedInUser = (props: LoggedInUserProps) => {

    return (
        <Nav className='ms-auto'>
            <Navbar.Text className='me-2'>
                {resolveText('Hello')}, {props.user.profileData.firstName}
            </Navbar.Text>
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