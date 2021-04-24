import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { LocationType } from '../../types/enums.d';
import { RowFormGroup } from '../../components/RowFormGroup';
import Form from 'react-bootstrap/esm/Form';
import { AsyncButton } from '../../components/AsyncButton';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { Autocomplete } from '../../components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';

interface ResourceParams {
    resourceId?: string;
}
interface ResourceEditPageProps extends RouteComponentProps<ResourceParams> {}

export const ResourceEditPage = (props: ResourceEditPageProps) => {

    const resourceGroupAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.ResourceGroup>('api/resourcegroups/search', 'searchText', 10), []);
    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.resourceId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.resourceId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');
    const [ resourceGroup, setResourceGroup ] = useState<Models.ResourceGroup>();
    const [ roomId, setRoomId ] = useState<string>('');

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadConsumable = buildLoadObjectFunc<Models.Resource>(
            `api/consumables/${id}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            consumable => {
                setName(consumable.name);
            },
            () => setIsLoading(false)
        );
        loadConsumable();
    }, [ isNew, id ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsStoring(true);
            const resource = buildResource();
            await apiClient.put(`api/consumables/${resource.id}`, {}, resource);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Consumable_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const buildResource = (): Models.Resource => {
        return {
            id: id,
            name: name,
            groupId: resourceGroup?.id,
            location: {
                type: LocationType.Room,
                id: roomId
            },
            note: ''
        };
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
        <h1>{resolveText('Resource')} '{name}'</h1>
            <Form className="needs-validation was-validated" onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Resource_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={resourceGroupAutocompleteRunner.search}
                            displayNameSelector={x => x.name}
                            onItemSelected={setResourceGroup}
                        />
                    </Col>
                </FormGroup>
                <RowFormGroup
                    label={resolveText('RoomNumber')}
                    value={roomId}
                    onChange={setRoomId}
                />
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}