import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();
    return (
        <>
            <h1>Home</h1>
            <Row>
                <Col>
                    <Button onClick={() => navigate("/login/sharer")}>Sharer</Button>
                </Col>
                <Col>
                    <Button onClick={() => navigate("/login/healthprofessional")}>Health Professional</Button>
                </Col>
                <Col>
                    <Button onClick={() => navigate("/login/researcher")}>Researcher</Button>
                </Col>
            </Row>
        </>
    );
}