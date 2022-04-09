import React, { PropsWithChildren } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';

interface NoUserLayoutProps {}

export const NoUserLayout = (props: PropsWithChildren<NoUserLayoutProps>) => {

    return (
        <>
        <Container>
            <Row>
                <Col>
                    {props.children}
                </Col>
            </Row>
        </Container>
        <NotificationContainer />
        </>
    );

}