import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { FlatpickrDateWidget } from '../../components/Widgets/FlatpickrDateWidget';
import { addPerson } from '../../redux/slices/personsSlice';

interface EditPersonPageProps {}

export const EditPersonPage = (props: EditPersonPageProps) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loadPerson = async (id: string) => {
        const response = await apiClient.instance!.get(`api/persons/${id}`, {});
        return await response.json();
    }

    const store = async (person: Models.Person) => {
        dispatch(addPerson({
            args: person,
            body: person,
            onSuccess: () => navigate(-1)
        }));
    }

    return (
        <GenericTypeCreateEditPage
            typeName='person'
            itemLoader={loadPerson}
            onSubmit={store}
            paramName='personId'
            uiSchema={{
                id: {
                    "ui:widget": "hidden"
                },
                personId: {
                    "ui:widget": "hidden"
                },
                birthDate: {
                    "ui:widget": FlatpickrDateWidget
                }
            }}
        />
    );

}