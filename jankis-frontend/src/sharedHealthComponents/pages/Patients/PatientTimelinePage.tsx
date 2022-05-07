import { useEffect } from 'react';
import { useParams } from 'react-router';
import { fetchHealthRecordForPerson } from '../../../localComponents/redux/actions/healthRecordActions';
import { useAppSelector, useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientTimelineItem } from '../../../sharedHealthComponents/components/Patients/PatientTimelineItem';

interface PatientTimelinePageProps {}

export const PatientTimelinePage = (props: PatientTimelinePageProps) => {

    // TODO: Group events by admission

    const { personId } = useParams();

    const events = useAppSelector(state => 
        (state.notes.items as Models.IHealthRecordEntry[])
        .concat(state.documents.items)
        .concat(state.observations.items)
        .concat(state.diagnoses.items)
        .concat(state.medicalProcedures.items)
        .concat(state.testResults.items)
        .concat(state.medicationDispensions.items)
        .filter(x => x.personId === personId)
    );
    const isLoading = useAppSelector(state => state.healthRecords.isLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(fetchHealthRecordForPerson({
            personId
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <PatientTimelineItem 
                    entry={event}
                />
            ))}
        </>
    );

}