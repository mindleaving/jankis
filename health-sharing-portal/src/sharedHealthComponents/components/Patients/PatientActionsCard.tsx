import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { HealthRecordAction } from '../../types/frontendTypes';

interface PatientActionsCardProps {
    actions: HealthRecordAction[];
}

export const PatientActionsCard = (props: PatientActionsCardProps) => {

    const navigate = useNavigate();
    return (
        <Card>
            <Card.Header>{resolveText('Patient_Actions')}</Card.Header>
            <Card.Body>
                {props.actions.map((action,index) => (
                    <Button 
                        key={index}
                        className="m-1" 
                        onClick={() => navigate(action.path)}
                    >
                        {resolveText(action.textResourceId)}
                    </Button>
                ))}
            </Card.Body>
        </Card>
    );

}