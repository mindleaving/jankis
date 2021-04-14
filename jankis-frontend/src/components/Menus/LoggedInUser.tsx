import React from 'react';
import { Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface LoggedInUserProps {
    user: ViewModels.LoggedInUserViewModel;
    onLogOut: () => void;
}

export const LoggedInUser = (props: LoggedInUserProps) => {

    return (
        <>
            <div className="mx-2">{resolveText('Hello')}, {props.user.profileData.firstName}</div>
            <Button variant="danger" onClick={props.onLogOut}>{resolveText('LogOut')}</Button>
        </>
    );

}