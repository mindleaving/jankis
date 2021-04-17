import React from 'react';
import { Card, Accordion, Row, Col, Button, Alert } from 'react-bootstrap';
import { formatPerson } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { BedState } from '../../types/enums.d';
import { Models } from '../../types/models';
import { AccordionCard } from '../AccordionCard';

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
    return (
        <Card className="m-2">
            <Card.Header>{resolveText('Room')} {room.name}</Card.Header>
            <Card.Body>
                <Accordion defaultActiveKey="0">
                {room.bedPositions.map(bedPosition => {
                    const occupancies = bedOccupancies.filter(x => 
                        x.departmentId === department.id
                        && x.roomId === room.id
                        && x.bedPosition === bedPosition
                        && (!x.endTime || x.endTime.getTime() > now));
                    const currentOccupancy = occupancies.find(x => x.startTime.getTime() <= now);
                    const stateColor = !currentOccupancy ? "light"
                        : currentOccupancy.state === BedState.Occupied ? "primary"
                        : currentOccupancy.state === BedState.Reserved ? "warning"
                        : currentOccupancy.state === BedState.Unavailable ? "danger"
                        : "light";
                    return (
                        <AccordionCard 
                            title={<Row className="align-items-center">
                                <Col>
                                    {resolveText('Bed')} {bedPosition} ({resolveText(`BedState_${currentOccupancy?.state ?? BedState.Empty}`)})
                                </Col>
                                <Col xs="auto">
                                    <Button size="sm" className="mr-auto">{resolveText('Bed_AddOccupancy')}</Button>
                                </Col>
                            </Row>}
                            eventKey={bedPosition}
                            className="m-1" 
                            bg={stateColor}
                        >
                            {occupancies.map(occupancy => (
                                <Alert key={occupancy.id}>
                                    <Row>
                                        <Col>
                                            <small>{`${occupancy.startTime.toLocaleDateString()} - ${occupancy.endTime?.toLocaleDateString()}`}</small>
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
                                        <Col>{formatPerson(occupancy.patient)}</Col>
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