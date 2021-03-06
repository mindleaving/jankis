import React, { useMemo, useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { formatStock } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { ConsumableOrderModal } from '../../modals/ConsumableOrderModal';
import { ConsumablesFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';
import { PagedTable } from '../PagedTable';

interface ConsumablesListProps {
    filter: ConsumablesFilter;
}
interface ConsumableOrderInfo {
    consumableId: string;
    consumableName: string;
    stockState: ViewModels.StockStateViewModel;
}
export const ConsumablesList = (props: ConsumablesListProps) => {

    const [ consumables, setConsumables ] = useState<ViewModels.ConsumableViewModel[]>([]);
    const [ showOrderModal, setShowOrderModal ] = useState<boolean>(false);
    const [ orderInfo, setOrderInfo ] = useState<ConsumableOrderInfo>();
    const consumablesLoader = useMemo(() => new PagedTableLoader<ViewModels.ConsumableViewModel>(
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
        <>
        <PagedTable
            onPageChanged={consumablesLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/consumable')}
            enableHighlighting
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Consumable_Name')}</th>
                    <th>{resolveText('Consumable_StockState')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {consumables.length > 0
                ? consumables.map(consumable => (
                    <tr key={consumable.id}>
                        <td>
                            <i className="fa fa-trash red clickable" onClick={() => deleteConsumable(consumable.id, consumable.name)} />
                        </td>
                        <td
                            className="clickable"
                            onClick={() => history.push(`/consumables/${consumable.id}`)}
                        >
                            {consumable.name}
                        </td>
                        <td>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>{resolveText('StockState_Stock')}</th>
                                        <th>{resolveText('StockState_Quantity')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {consumable.stockStateViewModels.map(stockState => (
                                    <tr key={stockState.stockId}>
                                        <td>{formatStock(stockState.stock)}</td>
                                        <td>{stockState.quantity}</td>
                                        <td>
                                            {stockState.isOrderable
                                            ? <Button
                                                size="sm"
                                                onClick={() => {
                                                    setOrderInfo({
                                                        consumableId: consumable.id,
                                                        consumableName: consumable.name,
                                                        stockState: stockState
                                                    });
                                                    setShowOrderModal(true);
                                                }}
                                                disabled={stockState.quantity <= 0 && !stockState.isUnlimitedOrderable}
                                            >
                                                {resolveText('Order')}
                                            </Button>
                                            : null}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
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
        {showOrderModal && orderInfo
        ? <ConsumableOrderModal
            show={showOrderModal}
            consumableId={orderInfo.consumableId}
            consumableName={orderInfo.consumableName}
            onHide={() => setShowOrderModal(false)}
            stockState={orderInfo?.stockState}
        /> : null}
        </>
    );

}