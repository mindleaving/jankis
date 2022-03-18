import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface PatientActionsCardProps {
    personId: string;
}

export const PatientActionsCard = (props: PatientActionsCardProps) => {

    const navigate = useNavigate();
    return (
        <Card>
            <Card.Header>{resolveText('Patient_Actions')}</Card.Header>
            <Card.Body>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/create/note`)}>{resolveText('Action_AddNote')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/create/observation`)}>{resolveText('Action_AddObservation')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/add/medication`)}>{resolveText('Action_AddMedication')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/nursing`)}>{resolveText('Action_AddEquipment')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/create/testresult`)}>{resolveText('Action_AddTestResult')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/create/document`)}>{resolveText('Action_AddDocument')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/order/service`)}>{resolveText('Action_OrderService')}</Button>
                <Button className="m-1" onClick={() => navigate(`/healthrecord/${props.personId}/nursing`)}>{resolveText('Action_Nursing')}</Button>
            </Card.Body>
        </Card>
    );

}