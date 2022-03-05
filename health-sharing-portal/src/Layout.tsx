import React, { PropsWithChildren } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface LayoutProps {}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {props.children}
                    </Col>
                </Row>
            </Container>
        </>
    );

}