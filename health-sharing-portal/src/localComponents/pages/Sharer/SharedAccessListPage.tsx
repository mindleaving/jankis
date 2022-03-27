import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { AccessRequestList } from "../../components/AccessRequestList";
import { SharedAccessList } from "../../components/Sharer/SharedAccessList";

interface SharedAccessListPageProps {}

export const SharedAccessListPage = (props: SharedAccessListPageProps) => {

    const navigate = useNavigate();
    return (
        <>
            <h1>{resolveText("SharedAccess")}</h1>
            <Row>
                <Col>
                    <h2>{resolveText("SharedAccess_SentInvites")}</h2>
                </Col>
                <Col xs="auto">
                    <Button onClick={() => navigate("/giveaccess/healthprofessional")}>+ {resolveText("CreateNew")}</Button>
                </Col>
            </Row>
            <AccessRequestList />
            <h2>{resolveText("SharedAccess_GrantedAccess")}</h2>
            <SharedAccessList />
        </>
    );

}