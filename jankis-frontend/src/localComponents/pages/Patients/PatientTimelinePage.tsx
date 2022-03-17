import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientTimelineItem } from '../../../sharedHealthComponents/components/Patients/PatientTimelineItem';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface PatientTimelinePageProps {}

export const PatientTimelinePage = (props: PatientTimelinePageProps) => {

    // TODO: Group events by admission

    const { patientId } = useParams();

    const [ events, setEvents ] = useState<Models.IPatientEvent[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        if(!patientId) return;
        setIsLoading(true);
        const loadPatientEvents = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${patientId}/overviewviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            data => {
                setEvents(
                    (data.notes as Models.IPatientEvent[])
                    .concat(data.observations)
                    .concat(data.testResults)
                    .concat(data.documents)
                    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            },
            () => setIsLoading(false)
        );
        loadPatientEvents();
    }, [ patientId ]);

    if(!patientId) {
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