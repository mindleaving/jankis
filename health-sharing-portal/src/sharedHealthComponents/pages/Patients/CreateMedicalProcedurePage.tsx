import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { FlatpickrTimeWidget } from '../../components/Widgets/FlatpickrTimeWidget';
import { PersonAutocompleteWidget } from '../../components/Widgets/PersonAutocompleteWidget';
import { SnomedCtAutocompleteWidget } from '../../components/Widgets/SnomedCtAutocompleteWidget';

interface CreateMedicalProcedurePageProps {}

export const CreateMedicalProcedurePage = (props: CreateMedicalProcedurePageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);
    const navigate = useNavigate();

    if(!personId) {
        return (<h3>{resolveText("NoPersonIdSpecified")}</h3>);
    }

    const loadMedicalProcedure = async (id: string) => {
        const response = await apiClient.instance!.get(`api/medicalprocedures/${id}`, {});
        return await response.json();
    }

    const submit = async (medicalProcedure: Models.Procedures.MedicalProcedure) => {
        await apiClient.instance!.put(`api/medicalprocedures/${medicalProcedure.id}`, {}, medicalProcedure);
        navigate(-1);
    }

    const medicalProcedure: Models.Procedures.MedicalProcedure = {
        id: uuid(),
        createdBy: user!.accountId,
        type: HealthRecordEntryType.Procedure,
        isVerified: false,
        hasBeenSeenBySharer: user!.profileData.id === personId,
        personId: personId!,
        snomedCtCode: '',
        snomedCtName: '',
        note: '',
        timestamp: new Date().toISOString() as any
    }

    return (
        <>
            <h1>{resolveText("MedicalProcedure")}</h1>
            <GenericTypeCreateEditPage<Models.Procedures.MedicalProcedure>
                typeName='medicalprocedure'
                paramName='entryId'
                item={medicalProcedure}
                itemLoader={loadMedicalProcedure}
                onSubmit={submit}
                uiSchema={{
                    id: {
                        "ui:widget": "hidden"
                    },
                    personId: {
                        "ui:widget": PersonAutocompleteWidget
                    },
                    timestamp: {
                        "ui:widget": FlatpickrTimeWidget
                    },
                    type: {
                        "ui:widget": "hidden"
                    },
                    createdBy: {
                        "ui:readonly": true,
                        "ui:widget": "hidden",
                    },
                    snomedCtCode: {
                        "ui:widget": SnomedCtAutocompleteWidget
                    },
                    snomedCtName: {
                        "ui:widget": "hidden"
                    },
                    note: {
                        "ui:widget": "textarea"
                    }
                }}
            />
        </>
    );

}