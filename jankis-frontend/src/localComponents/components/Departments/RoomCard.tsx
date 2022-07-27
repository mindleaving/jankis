import { Card, Accordion } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../redux/store/healthRecordStore';
import { Models } from '../../types/models';
import { RoomBedCard } from './RoomBedCard';

interface RoomCardProps {    
    room: Models.Room;
    department: Models.Department;
}

export const RoomCard = (props: RoomCardProps) => {

    const room = props.room;
    return (
        <Card className="m-2">
            <Card.Header>{resolveText('Room')} {room.name}</Card.Header>
            <Card.Body>
                <Accordion>
                {room.bedPositions.map(bedPosition => {
                    <RoomBedCard
                        key={bedPosition}
                        departmentId={props.department.id}
                        roomId={room.id}
                        bedPosition={bedPosition}
                    />
                })}
                </Accordion>
            </Card.Body>
        </Card>
    );

}