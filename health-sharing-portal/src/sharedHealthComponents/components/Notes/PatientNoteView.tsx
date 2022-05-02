import { useContext } from "react";
import { Alert } from "react-bootstrap";
import UserContext from "../../../localComponents/contexts/UserContext";
import { needsHiding } from "../../../localComponents/helpers/HealthRecordEntryHelpers";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { formatDate } from "../../helpers/Formatters";
import { markNoteAsSeen } from "../../redux/slices/notesSlice";
import { useAppDispatch } from "../../redux/store/healthRecordStore";
import { HidableHealthRecordEntryValue } from "../HidableHealthRecordEntryValue";

interface PatientNoteViewProps {
    note: Models.PatientNote;
}
export const PatientNoteView = (props: PatientNoteViewProps) => {

    const note = props.note;
    const user = useContext(UserContext);
    const dispatch = useAppDispatch();
    const unhide = () => dispatch(markNoteAsSeen(note.id));

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