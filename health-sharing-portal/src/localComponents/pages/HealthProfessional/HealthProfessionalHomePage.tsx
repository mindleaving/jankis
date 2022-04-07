import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface HealthProfessionalHomePageProps {}

export const HealthProfessionalHomePage = (props: HealthProfessionalHomePageProps) => {

    const navigate = useNavigate();
    return (
        <>
            <h1>Welcome, Health Professional</h1>
            <Button 
                variant="danger"
                onClick={() => navigate('/create/emergency')}
            >
                {resolveText('RequestEmergencyAccess')}
            </Button>
        </>
    );

}