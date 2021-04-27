import React, { useMemo, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { ConsumablesFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';

interface ConsumablesListProps {
    filter: ConsumablesFilter;
}

export const ConsumablesList = (props: ConsumablesListProps) => {

    const [ consumables, setConsumables ] = useState<Models.Consumable[]>([]);
    const consumablesLoader = useMemo(() => new PagedTableLoader<Models.Consumable>(
        'api/consumables',
        resolveText('Consumables_CouldNotLoad'),
        setConsumables,
        props.filter
    ), [ props.filter ]);
    const history = useHistory();

    const deleteConsumable = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmAlert(
                id,
                name,
                resolveText('Consumable_ConfirmDelete_Title'),
                resolveText('Consumable_ConfirmDelete_Message').replace('{0}', name),
                () => deleteConsumable(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/consumables/${id}`,
            {},
            resolveText('Consumable_SuccessfullyDeleted'),
            resolveText('Consumable_CouldNotDelete'),
            () => setConsumables(consumables.filter(x => x.id !== id))
        );
    }
    return (
        <PagedTable
            onPageChanged={consumablesLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/consumable')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Consumable_Name')}</th>
                    <th>{resolveText('Consumable_StockState')}</th>
                </tr>
            </thead>
            <tbody>
                {consumables.length > 0
                ? consumables.map(consumable => (
                    <tr>
                        <td>
                            <i className="fa fa-trash red clickable" onClick={() => deleteConsumable(consumable.id, consumable.name)} />
                        </td>
                        <td>{consumable.name}</td>
                        <td>
                            {consumable.stockStates.map(stockState => (
                                <Badge>{stockState.stockId}: {stockState.quantity}</Badge>
                            ))}
                        </td>
                        <td>
                            <Button variant="link" onClick={() => history.push(`/consumables/${consumable.id}/edit`)}>{resolveText('Edit...')}</Button>
                        </td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={3}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}