import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { compareDesc } from 'date-fns';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';
import { HidableHealthRecordEntryValue } from './HidableHealthRecordEntryValue';
import { unhideHealthRecordEntry } from '../../helpers/HealthRecordEntryHelpers';
import { MarkHealthRecordEntryAsSeenCallback } from '../../types/frontendTypes';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';

interface PatientNotesViewProps {
    notes: Models.PatientNote[];
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const PatientNotesView = (props: PatientNotesViewProps) => {

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {props.notes.sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))).map(note => (
            <PatientNoteView 
                key={note.id} 
                note={note}
                onMarkAsSeen={props.onMarkAsSeen}
            />
        ))}
    </div>);

}

interface PatientNoteViewProps {
    note: Models.PatientNote;
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}
const PatientNoteView = (props: PatientNoteViewProps) => {

    const note = props.note;
    const user = useContext(UserContext);
    const unhide = () => unhideHealthRecordEntry(note, props.onMarkAsSeen);

    return (<Alert variant="primary">
        <div><small>{formatDate(new Date(props.note.timestamp))} {resolveText('by')} {props.note.createdBy}</small></div>
        <HidableHealthRecordEntryValue
            hideValue={needsHiding(note, user!)}
            onMarkAsSeen={unhide}
        >
            {props.note.message}
        </HidableHealthRecordEntryValue>
    </Alert>);
}