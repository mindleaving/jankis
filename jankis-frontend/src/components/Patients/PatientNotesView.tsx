import React from 'react';
import { Alert } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { compareDesc } from 'date-fns';

interface PatientNotesViewProps {
    notes: Models.PatientNote[];
}

export const PatientNotesView = (props: PatientNotesViewProps) => {

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {props.notes.sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))).map(note => (
            <PatientNoteView key={note.id} note={note} />
        ))}
    </div>);

}

interface PatientNoteViewProps {
    note: Models.PatientNote;
}
const PatientNoteView = (props: PatientNoteViewProps) => {
    return (<Alert variant="primary">
        <div><small>{new Date(props.note.timestamp).toLocaleString()} {resolveText('by')} {props.note.createdBy}</small></div>
        {props.note.message}
    </Alert>);
}