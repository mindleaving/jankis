import { compareDesc } from 'date-fns';
import React from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { PatientTimelineItem } from './PatientTimelineItem';

interface PatientEventsOverviewProps {
    events: Models.IPatientEvent[];
}

export const PatientEventsOverview = (props: PatientEventsOverviewProps) => {

    return (
        <div className="mt-3">
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            {props.events.sort((a,b) => compareDesc(a.timestamp, b.timestamp)).map(event => (
                <PatientTimelineItem event={event} />
            ))}
        </div>
    );

}