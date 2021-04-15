import React, { FormEvent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { AsyncButton } from '../../components/AsyncButton';
import { v4 as uuid } from 'uuid';
import Form from 'react-bootstrap/esm/Form';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { NotificationManager } from 'react-notifications';

interface ConsumableParams {
    consumableId?: string;
}

interface ConsumableEditPageProps extends RouteComponentProps<ConsumableParams> {}

export const ConsumableEditPage = (props: ConsumableEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.consumableId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.consumableId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadConsumable = buildLoadObjectFunc<Models.Consumable>(
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
            const consumable = buildConsumable();
            await apiClient.put(`api/consumables/${consumable.id}`, {}, consumable);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Consumable_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const buildConsumable = (): Models.Consumable => {
        return {
            id: id,
            name: name,
            stockStates: []
        }
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Consumable')} '{name}'</h1>
            <Form className="needs-validation was-validated" onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Consumable_Name')}
                    value={name}
                    onChange={setName}
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
