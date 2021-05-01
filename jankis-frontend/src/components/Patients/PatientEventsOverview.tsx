import React from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { PatientTimelineItem } from './PatientTimelineItem';
import { compareDesc } from 'date-fns';

interface PatientEventsOverviewProps {
    events: Models.IPatientEvent[];
}

export const PatientEventsOverview = (props: PatientEventsOverviewProps) => {

    return (
        <div className="mt-3">
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            {props.events.sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))).map(event => (
                <PatientTimelineItem key={(event as any).id} event={event} />
            ))}
        </div>
    );

}