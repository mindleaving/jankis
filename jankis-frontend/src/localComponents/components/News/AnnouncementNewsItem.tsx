import React from 'react';
import { Card } from 'react-bootstrap';

interface AnnouncementNewsItemProps {}

export const AnnouncementNewsItem = (props: AnnouncementNewsItemProps) => {

    return (
        <Card>
            <Card.Header>Big news!</Card.Header>
            <Card.Body>
                Lorem ipsum...
            </Card.Body>
        </Card>
    );

}