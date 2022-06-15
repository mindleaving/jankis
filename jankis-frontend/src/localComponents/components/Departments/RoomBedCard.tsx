import React from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { useAppSelector } from '../../redux/store/healthRecordStore';
import { BedState } from '../../types/enums.d';

interface RoomBedCardProps {
    departmentId: string;
    roomId: string;
    bedPosition: string;
}

export const RoomBedCard = (props: RoomBedCardProps) => {

    const bedPosition = props.bedPosition;
    const navigate = useNavigate();
    const now = new Date().getTime();
    const occupancies = useAppSelector(state => state.bedOccupancies.items
        .filter(x => 
            x.room.id === props.roomId
            && x.bedPosition === bedPosition
            && (!x.endTime || x.endTime.getTime() > now))
    );
    const timeSortedOccupancies = [...occupancies].sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
    const currentOccupancy = timeSortedOccupancies.find(x => x.startTime.getTime() <= now);
    const stateColor = !currentOccupancy ? "light"
        : currentOccupancy.state === BedState.Occupied ? "success"
        : currentOccupancy.state === BedState.Reserved ? "warning"
        : currentOccupancy.state === BedState.Unavailable ? "danger"
        : "light";
    const textColor = !currentOccupancy ? 'text-dark'
        : [BedState.Unavailable, BedState.Occupied].includes(currentOccupancy.state) ? 'text-dark'
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
                        onClick={() => navigate(`/create/bedoccupancy/department/${props.departmentId}/room/${props.roomId}/bed/${bedPosition}`)}
                    >
                        {resolveText('Bed_AddOccupancy')}
                    </Button>
                </Col>
            </Row>}
            eventKey={bedPosition}
            className={`m-1 ${textColor}`} 
            bg={stateColor}
        >
            {timeSortedOccupancies.map(occupancy => (
                <Alert key={occupancy.id}>
                    <Row>
                        <Col xs={4}>
                            <small>{`${occupancy.startTime.toLocaleDateString()} - ${occupancy.endTime?.toLocaleDateString() ?? ''}`}</small>
                        </Col>
                        <Col />
                        <Col xs="auto">
                            <i className="fa fa-edit clickable" onClick={() => navigate(`/bedoccupancies/${occupancy.id}/edit`)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>{resolveText('BedState')}</Col>
                        <Col>{resolveText(`BedState_${occupancy.state}`)}</Col>
                    </Row>
                    {occupancy.state === BedState.Unavailable ? 
                    <Row>
                        <Col xs={4}>{resolveText('BedOccupancy_UnavailabilityReason')}</Col>
                        <Col>{occupancy.unavailabilityReason}</Col>
                    </Row> : 
                    occupancy.patient ? 
                    <Row>
                        <Col xs={4}>{resolveText('Patient')}</Col>
                        <Col>
                            <Button 
                                variant="link"
                                className={`p-0 m-0 text-left ${textColor}`}
                                onClick={() => navigate(`/healthrecord/${occupancy.patient!.id}`)}
                            >
                                {formatPerson(occupancy.patient)}
                            </Button>
                        </Col>
                    </Row> : null}
                </Alert>
            ))}
        </AccordionCard>);

}