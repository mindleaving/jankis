import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { NewsTicker } from '../components/News/NewsTicker';

interface NewsPageProps {}

export const NewsPage = (props: NewsPageProps) => {
    const userRole = "nurse";
    return (
        <>
            <h1>Neuigkeiten</h1>
            <Row>
                <Col>
                    <h3>Generell</h3>
                    <NewsTicker scope="general" />
                </Col>
                <Col>
                    {userRole === "nurse" 
                    ? <>
                        <h3>Meine Patienten</h3>
                        <NewsTicker scope="myPatients" />
                    </>
                    : null}
                </Col>
            </Row>
        </>
    );

}