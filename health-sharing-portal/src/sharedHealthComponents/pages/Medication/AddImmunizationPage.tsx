import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { FlatpickrTimeWidget } from '../../components/Widgets/FlatpickrTimeWidget';
import { PersonAutocompleteWidget } from '../../components/Widgets/PersonAutocompleteWidget';
import { addOrUpdateImmunization } from '../../redux/slices/immunizationsSlice';

interface AddImmunizationPageProps {}

export const AddImmunizationPage = (props: AddImmunizationPageProps) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loadImmunization = async (id: string) => {
        const response = await apiClient.instance!.get(`api/immunizations/${id}`, {});
        return await response.json();
    }

    const store = async (immunization: Models.Medication.Immunization) => {
        dispatch(addOrUpdateImmunization({
            args: immunization,
            body: immunization,
            onSuccess: () => navigate(-1)
        }));
    }
    return (
        <>
            <h1>{resolveText("Immunization")}</h1>
            <GenericTypeCreateEditPage<Models.Medication.Immunization>
                typeName='immunization'
                paramName='id'
                onSubmit={store}
                itemLoader={loadImmunization}
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
                    }
                }}
            />
        </>
    );

}