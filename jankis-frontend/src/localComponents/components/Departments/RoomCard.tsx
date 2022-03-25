import React from 'react';
import { Card, Accordion, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { BedState } from '../../types/enums.d';
import { Models } from '../../types/models';

interface RoomCardProps {    
    room: Models.Room;
    department: Models.Department;
    bedOccupancies: Models.BedOccupancy[];
    now?: Date;
}

export const RoomCard = (props: RoomCardProps) => {

    const room = props.room;
    const department= props.department;
    const bedOccupancies = props.bedOccupancies;
    const now = (props.now ?? new Date()).getTime();

    const navigate = useNavigate();

    return (
        <Card className="m-2">
            <Card.Header>{resolveText('Room')} {room.name}</Card.Header>
            <Card.Body>
                <Accordion>
                {room.bedPositions.map(bedPosition => {
                    const occupancies = bedOccupancies
                        .filter(x => 
                            x.department.id === department.id
                            && x.room.id === room.id
                            && x.bedPosition === bedPosition
                            && (!x.endTime || x.endTime.getTime() > now))
                        .sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
                    const currentOccupancy = occupancies.find(x => x.startTime.getTime() <= now);
                    const stateColor = !currentOccupancy ? "light"
                        : currentOccupancy.state === BedState.Occupied ? "success"
                        : currentOccupancy.state === BedState.Reserved ? "warning"
                        : currentOccupancy.state === BedState.Unavailable ? "danger"
                        : "light";
                    const textColor = !currentOccupancy ? 'text-dark'
                        : [BedState.Unavailable, BedState.Occupied].includes(currentOccupancy.state) ? 'text-white'
                        : 'text-dark';
                    return (
                        <AccordionCard 
                            key={bedPosition}
                            title={<Row className="align-items-center">
                                <Col>
                                    {resolveText('Bed')} {bedPosition} ({resolveText(`BedState_${currentOccupancy?.state ?? BedState.Empty}`)})
                                </Col>
                                <Col xs="auto">
                                    <Button 
                                        size="sm" 
                                        className="mr-auto" 
                                        onClick={() => navigate(`/create/bedoccupancy/department/${department.id}/room/${room.id}/bed/${bedPosition}`)}
                                    >
                                        {resolveText('Bed_AddOccupancy')}
                                    </Button>
                                </Col>
                            </Row>}
                            eventKey={bedPosition}
                            className={`m-1 ${textColor}`} 
                            bg={stateColor}
                        >
                            {occupancies.map(occupancy => (
                                <Alert key={occupancy.id}>
                                    <Row>
                                        <Col>
                                            <small>{`${occupancy.startTime.toLocaleDateString()} - ${occupancy.endTime?.toLocaleDateString() ?? ''}`}</small>
                                        </Col>
                                        <Col xs="auto">
                                            <i className="fa fa-edit clickable" onClick={() => navigate(`/bedoccupancies/${occupancy.id}/edit`)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>{resolveText('BedState')}</Col>
                                        <Col>{resolveText(`BedState_${occupancy.state}`)}</Col>
                                    </Row>
                                    {occupancy.state === BedState.Unavailable ? 
                                    <Row>
                                        <Col>{resolveText('BedOccupancy_UnavailabilityReason')}</Col>
                                        <Col>{occupancy.unavailabilityReason}</Col>
                                    </Row> : 
                                    occupancy.patient ? 
                                    <Row>
                                        <Col>{resolveText('Patient')}</Col>
                                        <Col>
                                            <Button 
                                                variant="link"
                                                className={`p-0 m-0 text-left ${textColor}`}
                                                onClick={() => navigate(`/patients/${occupancy.patient!.id}`)}
                                            >
                                                {formatPerson(occupancy.patient)}
                                            </Button>
                                        </Col>
                                    </Row> : null}
                                </Alert>
                            ))}
                        </AccordionCard>);
                })}
                </Accordion>
            </Card.Body>
        </Card>
    );

}