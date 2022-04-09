import React from 'react';
import { PatientTimelineItem } from '../../../sharedHealthComponents/components/Patients/PatientTimelineItem';
import { MarkHealthRecordEntryAsSeenCallback } from '../../../sharedHealthComponents/types/frontendTypes';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface TimelineAdmissionViewProps {
    admission: ViewModels.PatientOverviewViewModel;
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const TimelineAdmissionView = (props: TimelineAdmissionViewProps) => {

    const events: Models.IHealthRecordEntry[] = (props.admission.notes as Models.IHealthRecordEntry[])
        .concat(props.admission.observations as Models.IHealthRecordEntry[])
        .concat(props.admission.testResults as Models.IHealthRecordEntry[])
        .concat(props.admission.documents as Models.IHealthRecordEntry[]);
    return (
        <>
            {events.map(x => (
                <PatientTimelineItem 
                    entry={x}
                    onMarkAsSeen={props.onMarkAsSeen}
                />
            ))}
        </>
    );

}