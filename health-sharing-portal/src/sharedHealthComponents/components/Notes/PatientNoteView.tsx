import { useContext } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import UserContext from "../../../localComponents/contexts/UserContext";
import { needsHiding } from "../../../localComponents/helpers/HealthRecordEntryHelpers";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { formatDate } from "../../helpers/Formatters";
import { deleteNote, markNoteAsSeen } from "../../redux/slices/notesSlice";
import { useAppDispatch } from "../../../localComponents/redux/store/healthRecordStore";
import { HidableHealthRecordEntryValue } from "../HidableHealthRecordEntryValue";
import { openConfirmDeleteAlert } from "../../../sharedCommonComponents/helpers/AlertHelpers";
import { useNavigate } from "react-router-dom";

interface PatientNoteViewProps {
    note: Models.PatientNote;
}
export const PatientNoteView = (props: PatientNoteViewProps) => {

    const note = props.note;
    const user = useContext(UserContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const unhide = () => dispatch(markNoteAsSeen({ args: note.id}));
    const dispatchDeleteNote = () => {
        openConfirmDeleteAlert(
            note.message.substring(0, 20),
            resolveText("Note_Delete_Title"),
            resolveText("Note_Delete_Message"),
            () => dispatch(deleteNote({ args: note.id }))
        );
    }

    return (<Alert variant="primary">
        <Row>
            <Col>
                <small>{formatDate(new Date(props.note.timestamp))} {resolveText('by')} {props.note.createdBy}</small>
            </Col>
            <Col xs="auto">
                <i
                    className="fa fa-edit clickable mx-2"
                    onClick={() => navigate(`/healthrecord/${props.note.personId}/edit/note/${props.note.id}`)}
                />
                <i
                    className="fa fa-trash red clickable"
                    onClick={dispatchDeleteNote}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <HidableHealthRecordEntryValue
                    hideValue={needsHiding(note, user!)}
                    onMarkAsSeen={unhide}
                >
                    {props.note.message}
                </HidableHealthRecordEntryValue>
            </Col>
        </Row>
    </Alert>);
}