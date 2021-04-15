import React from 'react';
import { Models } from '../../types/models';
import { PatientTimelineItem } from './PatientTimelineItem';

interface TimelineAdmissionViewProps {
    admission: Models.Admission;
}

export const TimelineAdmissionView = (props: TimelineAdmissionViewProps) => {

    const events: Models.IPatientEvent[] = (props.admission.notes as Models.IPatientEvent[])
        .concat(props.admission.observations as Models.IPatientEvent[])
        .concat(props.admission.diagnosticTestResults as Models.IPatientEvent[]);
    return (
        <>
            {events.map(x => (
                <PatientTimelineItem event={x} />
            ))}
        </>
    );

}