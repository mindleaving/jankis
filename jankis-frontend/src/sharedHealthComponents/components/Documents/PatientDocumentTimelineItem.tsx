import { useContext } from "react";
import { Alert, Row, Col } from "react-bootstrap";
import UserContext from "../../../localComponents/contexts/UserContext";
import { needsHiding } from "../../../localComponents/helpers/HealthRecordEntryHelpers";
import { Models } from "../../../localComponents/types/models";
import { downloadFile } from "../../../sharedCommonComponents/communication/FileDownloader";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { formatDate } from "../../helpers/Formatters";
import { deleteDocument, markDocumentAsSeen } from "../../redux/slices/documentsSlice";
import { useAppDispatch } from "../../../localComponents/redux/store/healthRecordStore";
import { HidableHealthRecordEntryValue } from "../HidableHealthRecordEntryValue";
import { DocumentButtons } from "../TestResults/DocumentButtons";
import { openConfirmDeleteAlert } from "../../../sharedCommonComponents/helpers/AlertHelpers";
import { useNavigate } from "react-router-dom";

interface PatientDocumentTimelineItemProps {
    document: Models.PatientDocument;
}
export const PatientDocumentTimelineItem = (props: PatientDocumentTimelineItemProps) => {
    const document = props.document;
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch =  useAppDispatch();
    const hideValue = needsHiding(document, user!);
    const unhide = () => dispatch(markDocumentAsSeen({ args: document.id }));
    const dispatchDeleteDocument = () => {
        openConfirmDeleteAlert(
            document.fileName, 
            resolveText("Document_Delete_Title"),
            resolveText("Document_Delete_Message"),
            () => dispatch(deleteDocument({ args: document.id }))
        );
    };
    return (
    <Alert variant="secondary">
        <Row>
            <Col xs="auto" className="align-self-center">
                <HidableHealthRecordEntryValue
                    hideValue={hideValue}
                    onMarkAsSeen={unhide}
                >
                    <i 
                        className="fa fa-file clickable timelineItemSymbol"
                        onClick={() => downloadFile(`api/documents/${props.document.id}/download`)}
                    />
                </HidableHealthRecordEntryValue>
            </Col>
            <Col>
                <Row>
                    <Col>
                        <div><small>{formatDate(new Date(props.document.timestamp))} {resolveText('by')} {props.document.createdBy}</small></div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HidableHealthRecordEntryValue
                            hideValue={hideValue}
                            onMarkAsSeen={unhide}
                        >
                            <small>{resolveText("Document_Filename")}: {props.document.fileName}</small>
                        </HidableHealthRecordEntryValue>
                    </Col>
                </Row>
                {props.document.note
                ? <Row>
                    <Col>
                        <small>{resolveText('Note')}: </small>
                        <HidableHealthRecordEntryValue
                            hideValue={hideValue}
                            onMarkAsSeen={unhide}
                        >
                            {props.document.note}
                        </HidableHealthRecordEntryValue>
                    </Col>
                </Row> : null}
            </Col>
            {!hideValue 
            ? <Col xs="auto">
                <DocumentButtons documentId={document.id} />
            </Col>
            : null}
            <Col xs="auto">
                <i 
                    className="fa fa-edit clickable mx-2"
                    onClick={() => navigate(`/healthrecord/${props.document.personId}/edit/document/${props.document.id}`)}
                />
                <i 
                    className="fa fa-trash red clickable"
                    onClick={dispatchDeleteDocument}
                />
            </Col>
        </Row>
    </Alert>);
}