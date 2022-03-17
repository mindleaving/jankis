import React from 'react';
import { PatientTimelineItem } from '../../../sharedHealthComponents/components/Patients/PatientTimelineItem';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface TimelineAdmissionViewProps {
    admission: ViewModels.PatientOverviewViewModel;
}

export const TimelineAdmissionView = (props: TimelineAdmissionViewProps) => {

    const events: Models.IPatientEvent[] = (props.admission.notes as Models.IPatientEvent[])
        .concat(props.admission.observations as Models.IPatientEvent[])
        .concat(props.admission.testResults as Models.IPatientEvent[])
        .concat(props.admission.documents as Models.IPatientEvent[]);
    return (
        <>
            {events.map(x => (
                <PatientTimelineItem event={x} />
            ))}
        </>
    );

}