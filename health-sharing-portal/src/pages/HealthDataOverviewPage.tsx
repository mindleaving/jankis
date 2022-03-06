import { Tab, Tabs } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface HealthDataOverviewPageProps {}

export const HealthDataOverviewPage = (props: HealthDataOverviewPageProps) => {

    return (
        <>
            <h1>Overview</h1>
            <Tabs>
                <Tab eventKey="allergies" title={resolveText("Allergies")}>
                    
                </Tab>
                <Tab eventKey="labValues" title={resolveText("LabValues")}>
                    
                </Tab>
            </Tabs>
        </>
    );

}