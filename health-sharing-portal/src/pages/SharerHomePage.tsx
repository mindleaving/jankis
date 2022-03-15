import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../helpers/Globalizer';

interface SharerHomePageProps {}

export const SharerHomePage = (props: SharerHomePageProps) => {

    const navigate = useNavigate();
    return (
        <>
            <h1>Welcome, Sharer!</h1>

            <Button onClick={() => navigate("/giveaccess/healthprofessional")}>{resolveText("GiveAccessToHealthProfessional")}</Button>
        </>
    );

}