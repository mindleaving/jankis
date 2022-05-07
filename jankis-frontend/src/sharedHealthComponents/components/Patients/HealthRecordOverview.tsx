import { PatientTimelineItem } from './PatientTimelineItem';
import { compareDesc } from 'date-fns';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../../localComponents/types/models';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';

interface HealthRecordOverviewProps {
    personId: string;
}

export const HealthRecordOverview = (props: HealthRecordOverviewProps) => {

    const events = useAppSelector(state => 
        (state.notes.items as Models.IHealthRecordEntry[])
        .concat(state.documents.items)
        .concat(state.observations.items)
        .concat(state.diagnoses.items)
        .concat(state.medicalProcedures.items)
        .concat(state.testResults.items)
        .concat(state.medicationDispensions.items)
        .filter(x => x.personId === props.personId)
    );

    return (
        <div className="mt-3">
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            {[...events]
                .sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp)))
                .map(event => (
                <PatientTimelineItem 
                    key={(event as any).id} 
                    entry={event}
                />
            ))}
        </div>
    );

}