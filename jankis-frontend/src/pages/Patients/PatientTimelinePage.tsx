import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { PatientTimelineItem } from '../../components/Patients/PatientTimelineItem';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';

interface PatientParams {
    patientId?: string;
}
interface PatientTimelinePageProps extends RouteComponentProps<PatientParams> {}

export const PatientTimelinePage = (props: PatientTimelinePageProps) => {

    const id = props.match.params.patientId;

    const [ events, setEvents ] = useState<Models.IPatientEvent[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        const loadPatientEvents = buildLoadObjectFunc<Models.IPatientEvent[]>(
            `api/patients/${id}/events`,
            {},
            resolveText('Patient_CouldNotLoad'),
            data => {
                setEvents(data);
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
            {events.map(event => (
                <PatientTimelineItem event={event} />
            ))}
        </>
    );

}