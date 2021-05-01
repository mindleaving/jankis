import React from 'react';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { UniformGrid } from '../UniformGrid';
import { RoomCard } from './RoomCard';

interface RoomGridViewProps {
    institution: ViewModels.InstitutionViewModel;
    bedOccupancies: Models.BedOccupancy[];
}

export const RoomGridView = (props: RoomGridViewProps) => {

    const now = new Date();
    return (
        <>
            {props.institution.departments.map(department => (
                <>
                    <h2>{department.name}</h2>
                    <UniformGrid
                        columnCount={3}
                        size="lg"
                        items={department.roomIds.map(roomId => {
                            const room = props.institution.rooms.find(x => x.id === roomId)!;
                            if(room.bedPositions.length === 0) {
                                return null;
                            }
                            return (<RoomCard
                                room={room}
                                department={department}
                                bedOccupancies={props.bedOccupancies}
                                now={now}
                            />);
                        }).filter(x => x !== null)}
                    />
                    
                </>
            ))}
        </>
    );

}