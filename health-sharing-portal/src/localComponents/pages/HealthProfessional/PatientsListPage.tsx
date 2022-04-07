import { Alert } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccessRequestList } from '../../components/AccessRequestList';
import { SharedAccessList } from '../../components/Sharer/SharedAccessList';

interface PatientsListPageProps {}

export const PatientsListPage = (props: PatientsListPageProps) => {

    return (
        <>
            <h1>{resolveText("Patients")}</h1>

            <h2>{resolveText("AccessInvites")}</h2>
            <AccessRequestList />
            <hr />
            <h2>{resolveText("ActiveAccess")}</h2>
            <Alert variant='warning'>
                <small>{resolveText("PatientsList_OnlyActiveShown")}</small>
            </Alert>
            <SharedAccessList />
        </>
    );

}