import { UniformGrid } from '../../../sharedCommonComponents/components/UniformGrid';
import { useAppSelector } from '../../redux/store/healthRecordStore';
import { Models } from '../../types/models';
import { RoomCard } from './RoomCard';

interface RoomGridDepartmentSectionProps {
    department: Models.Department;
}

export const RoomGridDepartmentSection = (props: RoomGridDepartmentSectionProps) => {

    const department = props.department;
    const rooms = useAppSelector(state => state.rooms.items.filter(x => props.department.roomIds.includes(x.id)));
    return (
        <>
            <h2>{department.name}</h2>
            <UniformGrid
                columnCount={3}
                size="lg"
                items={rooms.map(room => {
                    if(room.bedPositions.length === 0) {
                        return null;
                    }
                    return (<RoomCard
                        room={room}
                        department={department}
                    />);
                }).filter(x => x !== null)}
            />
        </>
    );

}