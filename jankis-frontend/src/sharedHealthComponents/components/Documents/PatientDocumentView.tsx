import { useContext } from "react";
import { Alert, Row, Col } from "react-bootstrap";
import UserContext from "../../../localComponents/contexts/UserContext";
import { needsHiding } from "../../../localComponents/helpers/HealthRecordEntryHelpers";
import { Models } from "../../../localComponents/types/models";
import { downloadFile } from "../../../sharedCommonComponents/communication/FileDownloader";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { formatDate } from "../../helpers/Formatters";
import { markDocumentAsSeen } from "../../redux/slices/documentsSlice";
import { useAppDispatch } from "../../../localComponents/redux/store/healthRecordStore";
import { HidableHealthRecordEntryValue } from "../HidableHealthRecordEntryValue";

interface PatientDocumentViewProps {
    document: Models.PatientDocument;
}
export const PatientDocumentView = (props: PatientDocumentViewProps) => {
    const document = props.document;
    const user = useContext(UserContext);
    const dispatch =  useAppDispatch();
    const hideValue = needsHiding(document, user!);
    const unhide = () => dispatch(markDocumentAsSeen({ args: document.id }));
    return (<Alert variant="secondary">
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
                    <Col lg="4" className="me-3">
                        <div><small>{formatDate(new Date(props.document.timestamp))} {resolveText('by')} {props.document.createdBy}</small></div>
                        {props.document.fileName}
                    </Col>
                    <Col lg="7">
                        {props.document.note
                        ? <>
                            <div><small>{resolveText('Note')}</small></div>
                            <HidableHealthRecordEntryValue
                                hideValue={hideValue}
                                onMarkAsSeen={unhide}
                            >
                                {props.document.note}
                            </HidableHealthRecordEntryValue>
                        </> : null}
                    </Col>
                </Row>
            </Col>
        </Row>
    </Alert>);
}