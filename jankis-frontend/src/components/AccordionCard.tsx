import React, { PropsWithChildren } from 'react';
import { Accordion, Card } from 'react-bootstrap';

interface AccordionCardProps extends PropsWithChildren<{}> {
    eventKey: string;
    title: string;
}

export const AccordionCard = (props: AccordionCardProps) => {

    return (
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={props.eventKey}>
                {props.title}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.eventKey}>
                <Card.Body>
                    {props.children}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );

}