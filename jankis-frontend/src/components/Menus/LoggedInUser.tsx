import React from 'react';
import { Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';

interface LoggedInUserProps {
    user: Models.PersonWithLogin;
    onLogOut: () => void;
}

export const LoggedInUser = (props: LoggedInUserProps) => {

    return (
        <>
            <div className="mx-2">{resolveText('Hello')}, {props.user.firstName}</div>
            <Button variant="danger" onClick={props.onLogOut}>{resolveText('LogOut')}</Button>
        </>
    );

}