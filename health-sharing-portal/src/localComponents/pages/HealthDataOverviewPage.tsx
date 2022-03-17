import { Tab, Tabs } from 'react-bootstrap';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { BasicInformationBox } from '../components/HealthData/BasicInformationBox';

interface HealthDataOverviewPageProps {}

export const HealthDataOverviewPage = (props: HealthDataOverviewPageProps) => {

    return (
        <>
            <h1>Overview</h1>
            <BasicInformationBox />
            <Tabs>
                <Tab eventKey="allergies" title={resolveText("Allergies")}>
                    
                </Tab>
                <Tab eventKey="labValues" title={resolveText("LabValues")}>
                    
                </Tab>
            </Tabs>
        </>
    );

}