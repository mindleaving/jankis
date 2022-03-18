import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientTimelineItem } from '../../../sharedHealthComponents/components/Patients/PatientTimelineItem';

interface PatientTimelinePageProps {}

export const PatientTimelinePage = (props: PatientTimelinePageProps) => {

    // TODO: Group events by admission

    const { personId } = useParams();

    const [ events, setEvents ] = useState<Models.IHealthRecordEntry[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        if(!personId) return;
        setIsLoading(true);
        const loadHealthRecordEntrys = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${personId}/overviewviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            data => {
                setEvents(
                    (data.notes as Models.IHealthRecordEntry[])
                    .concat(data.observations)
                    .concat(data.testResults)
                    .concat(data.documents)
                    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            },
            () => setIsLoading(false)
        );
        loadHealthRecordEntrys();
    }, [ personId ]);

    if(!personId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Patient_Timeline')}</h1>
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            {events.map(event => (
                <PatientTimelineItem event={event} />
            ))}
        </>
    );

}