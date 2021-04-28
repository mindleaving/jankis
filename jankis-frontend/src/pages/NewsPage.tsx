import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { NewsTicker } from '../components/News/NewsTicker';
import { resolveText } from '../helpers/Globalizer';
import { NotificationsTicker } from '../components/NotificationsTicker';

interface NewsPageProps {}

export const NewsPage = (props: NewsPageProps) => {

    return (
        <>
            <h1>{resolveText('Notifications')}</h1>
            <Row>
                <Col>
                    <h3>{resolveText('Notifications_General')}</h3>
                    <NewsTicker scope="institution" />
                </Col>
                <Col>
                    <h3>{resolveText('Notifications_MyPatients')}</h3>
                    <NotificationsTicker />
                </Col>
            </Row>
        </>
    );

}