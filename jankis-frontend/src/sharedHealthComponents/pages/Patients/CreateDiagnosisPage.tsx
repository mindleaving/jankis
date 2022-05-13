import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { IcdAutocompleteWidget } from '../../components/Widgets/IcdAutocompleteWidget';
import { PersonAutocompleteWidget } from '../../components/Widgets/PersonAutocompleteWidget';
import { v4 as uuid } from 'uuid';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { FlatpickrTimeWidget } from '../../components/Widgets/FlatpickrTimeWidget';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { addDiagnosis } from '../../redux/slices/diagnosesSlice';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { loadObject } from '../../../sharedCommonComponents/helpers/LoadingHelpers';

interface CreateDiagnosisPageProps {}

export const CreateDiagnosisPage = (props: CreateDiagnosisPageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    if(!personId) {
        return (<h3>{resolveText("NoPersonIdSpecified")}</h3>);
    }

    const loadDiagnoses = async (id: string) => {
        const response = await apiClient.instance!.get(`api/diagnoses/${id}`, {});
        return await response.json();
    }

    const submit = async (diagnosis: Models.Diagnoses.Diagnosis) => {
        let icdCategoryItem: Models.Icd.IcdCategory | undefined;
        await loadObject<Models.Icd.IcdCategory>(
            `api/classifications/icd11/${diagnosis.icd11Code}`, {},
            resolveText("ICD11_CouldNotLoad"),
            item => icdCategoryItem = item
        );
        const diagnosisVM: ViewModels.DiagnosisViewModel = {
            ...diagnosis,
            name: icdCategoryItem?.name ?? diagnosis.icd11Code
        };
        dispatch(addDiagnosis({
            args: diagnosisVM,
            body: diagnosis,
            onSuccess: () => navigate(-1)
        }));
    }

    const diagnosis: Models.Diagnoses.Diagnosis = {
        id: uuid(),
        createdBy: user!.accountId,
        type: HealthRecordEntryType.Diagnosis,
        isVerified: false,
        hasBeenSeenBySharer: user!.profileData.id === personId,
        personId: personId!,
        hasResolved: false,
        icd11Code: '',
        timestamp: new Date().toISOString() as any
    }

    return (
        <>
            <h1>{resolveText("Diagnosis")}</h1>
            <GenericTypeCreateEditPage<Models.Diagnoses.Diagnosis>
                typeName='diagnosis'
                paramName='id'
                item={diagnosis}
                itemLoader={loadDiagnoses}
                onSubmit={submit}
                uiSchema={{
                    id: {
                        "ui:widget": "hidden"
                    },
                    personId: {
                        "ui:widget": PersonAutocompleteWidget
                    },
                    type: {
                        "ui:widget": "hidden"
                    },
                    timestamp: {
                        "ui:widget": FlatpickrTimeWidget
                    },
                    createdBy: {
                        "ui:readonly": true,
                        "ui:widget": "hidden",
                    },
                    icd11Code: {
                        "ui:widget": IcdAutocompleteWidget
                    },
                    resolvedTimestamp: {
                        "ui:widget": FlatpickrTimeWidget
                    }
                }}
            />
        </>
    );

}

