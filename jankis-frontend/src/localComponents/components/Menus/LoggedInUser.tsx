import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../contexts/UserContext';

interface LoggedInUserProps {
    onLogOut: () => void;
}

export const LoggedInUser = (props: LoggedInUserProps) => {

    const user = useContext(UserContext);
    return (
        <>
            <div className="mx-2">{resolveText('Hello')}, {user!.profileData.firstName}</div>
            <Button variant="danger" onClick={props.onLogOut}>{resolveText('LogOut')}</Button>
        </>
    );

}