import { compareDesc } from 'date-fns';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { PatientNoteView } from './PatientNoteView';

interface PatientNotesViewProps {
    personId: string;
}

export const PatientNotesView = (props: PatientNotesViewProps) => {

    const notes = useAppSelector(state => state.notes.items.filter(x => x.personId === props.personId));

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {[...notes]
            .sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp)))
            .map(note => (
                <PatientNoteView 
                    key={note.id} 
                    note={note}
                />
            )
        )}
    </div>);

}