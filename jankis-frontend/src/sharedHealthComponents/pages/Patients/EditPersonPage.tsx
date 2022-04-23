import { useNavigate } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { FlatpickrDateWidget } from '../../components/Widgets/FlatpickrDateWidget';

interface EditPersonPageProps {}

export const EditPersonPage = (props: EditPersonPageProps) => {

    const navigate = useNavigate();
    const loadPerson = async (id: string) => {
        const response = await apiClient.instance!.get(`api/persons/${id}`, {});
        return await response.json();
    }

    const store = async (person: Models.Person) => {
        await apiClient.instance!.put(`api/persons/${person.id}`, {}, person);
        navigate(-1);
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