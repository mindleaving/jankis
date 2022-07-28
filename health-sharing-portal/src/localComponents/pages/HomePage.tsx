import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="text-center">
                <Button size="lg" onClick={() => navigate("/login")}>Login / register</Button>
            </div>
            <h3 className="mt-3">Take your health data anywhere in the world</h3>
            <p className="lead">
                The health sharing portal allows you to store your medical data, make it available to anyone you like, e.g. your doctors, researchers and your family.
            </p>
            <h3>Features</h3>
            <Row>
                <Col lg={7}>
                    <strong>Sharer</strong>
                    <ul>
                        <li>Have your health data available everywhere you go</li>
                        <li>Share access with your health provider, family and researchers</li>
                        <li>Create your health record
                            <ul>
                                <li>Diagnoses</li>
                                <li>Observations</li>
                                <li>Lab results</li>
                                <li>Medication</li>
                                <li>Notes and documents</li>
                            </ul>
                        </li>
                        <li>Order an emergency card</li>
                    </ul>

                    <strong>Health professional</strong>
                    <ul>
                        <li>Edit your patients medical information</li>
                        <li>Collaborate with other health professionals like lab, radiology or the patients primary health provider</li>
                    </ul>

                    <strong>Researcher</strong>
                    <ul>
                        <li>Recruite participants for your study</li>
                        <li>Planned: Advertise study to persons fulfilling specific filter criteria, e.g. persons with LDL above a specified threshold</li>
                        <li>Store measurements in the participants' health record</li>
                    </ul>
                </Col>
                <Col lg={5}>
                    <img
                        src="/img/demo-profile.png"
                        alt="Screenshot of demo profile"
                        width="100%"
                    />
                </Col>
            </Row>

            <h3 className="mt-3">Explore demo profile</h3>
            <div className="lead">
                Explore a demo profile using an emergency token. 
                An emergency token gives access to a profile and can be printed on a card that you can carry in your purse.
            </div>
            <div className="text-center">
                <Button
                    variant="danger"
                    className="m-3 px-4"
                    onClick={() => navigate("/emergency/VCZ93QFRZ45VZKNQJXHPT4JKFQ")}
                >
                    <h4>Explore demo profile</h4>
                    <img
                        src="/img/emergency-card-jane-doe.png"
                        alt="Emergency card for demo profile"
                    />
                </Button>
            </div>
            <h3 className="mt-3">Support this project</h3>
            <div className="lead">
                Make the most of your health record and support this project at the same time by buying an emergency card.
            </div>
            <p>
                An emergency card contains a few information about you and a QR code that gives access to your profile. 
                By keeping that card in your purse rescue workers can get quick access to your medical information when you are unable to provide that information.
            </p>
            <div className="text-center">
                <a href="https://shop.doctorstodo.com/" className="btn btn-primary btn-lg">Buy an emergency card</a>
            </div>
            <div style={{ marginBottom: '30px' }}></div>
        </>
    );
}

