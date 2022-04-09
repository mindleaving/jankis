import React from 'react';
import { PatientTimelineItem } from './PatientTimelineItem';
import { compareDesc } from 'date-fns';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../../localComponents/types/models';
import { MarkHealthRecordEntryAsSeenCallback } from '../../types/frontendTypes';

interface HealthRecordOverviewProps {
    events: Models.IHealthRecordEntry[];
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const HealthRecordOverview = (props: HealthRecordOverviewProps) => {

    return (
        <div className="mt-3">
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            {props.events
                .sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp)))
                .map(event => (
                <PatientTimelineItem 
                    key={(event as any).id} 
                    entry={event}
                    onMarkAsSeen={props.onMarkAsSeen}
                />
            ))}
        </div>
    );

}