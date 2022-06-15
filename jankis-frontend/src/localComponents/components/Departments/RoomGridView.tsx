import { useAppSelector } from '../../redux/store/healthRecordStore';
import { RoomGridDepartmentSection } from './RoomGridDepartmentSection';

interface RoomGridViewProps {
    institutionId: string;
}

export const RoomGridView = (props: RoomGridViewProps) => {

    const departments = useAppSelector(state => state.departments.items.filter(x => x.institutionId === props.institutionId));
    return (
        <>
            {departments.map(department => (
                <RoomGridDepartmentSection
                    key={department.id}
                    department={department}
                />
            ))}
        </>
    );

}