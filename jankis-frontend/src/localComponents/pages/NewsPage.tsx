import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { NewsTicker } from '../components/News/NewsTicker';
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