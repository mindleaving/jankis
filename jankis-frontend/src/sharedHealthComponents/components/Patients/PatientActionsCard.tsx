import React, { useEffect, useState } from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicalCommandlineModal } from '../../modals/MedicalCommandlineModal';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { HealthRecordAction } from '../../types/frontendTypes';
import { fetchHealthRecordForPerson } from '../../../localComponents/redux/actions/healthRecordActions';

interface PatientActionsCardProps {
    personId: string;
    actions: HealthRecordAction[];
}

export const PatientActionsCard = (props: PatientActionsCardProps) => {

    const [ showCommandline, setShowCommandline] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onKeyDown = (keyEvent: KeyboardEvent) => {
        if(keyEvent.key === "Enter" && keyEvent.altKey) {
            setShowCommandline(true);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, []);

    const onCommandSuccessful = () => {
        dispatch(fetchHealthRecordForPerson({
            personId: props.personId
        }));
    }
    
    return (
        <>
            <Card>
                <Card.Header>
                    <Row>
                        <Col className='align-self-center'>
                            {resolveText('Patient_Actions')}
                        </Col>
                        <Col xs="auto">
                            <Button
                                size="sm" 
                                onClick={() => setShowCommandline(true)}
                            >
                                &gt; {resolveText("CommandLine")}
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
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
            <MedicalCommandlineModal
                personId={props.personId}
                show={showCommandline}
                onCloseRequested={() => setShowCommandline(false)}
                onCommandSuccessful={onCommandSuccessful}
            />
        </>
    );

}