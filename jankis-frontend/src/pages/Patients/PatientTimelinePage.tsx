import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { PatientTimelineItem } from '../../components/Patients/PatientTimelineItem';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface PatientTimelinePageProps extends RouteComponentProps<PatientParams> {}

export const PatientTimelinePage = (props: PatientTimelinePageProps) => {

    // TODO: Group events by admission


    const id = props.match.params.patientId;

    const [ events, setEvents ] = useState<Models.IPatientEvent[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        const loadPatientEvents = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${id}/overviewviewmodel`,
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
    }, [ id ]);

    if(!id) {
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