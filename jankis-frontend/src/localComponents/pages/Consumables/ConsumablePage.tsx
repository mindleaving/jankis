import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { formatStock } from '../../helpers/Formatters';
import { ConsumableOrderModal } from '../../modals/ConsumableOrderModal';
import { ViewModels } from '../../types/viewModels';

interface ConsumablePageProps {}

export const ConsumablePage = (props: ConsumablePageProps) => {

    const { consumableId } = useParams();
    
    const [ consumable, setConsumable ] = useState<ViewModels.ConsumableViewModel>();
    const [ showOrderModal, setShowOrderModal ] = useState<boolean>(false);
    const [ orderInfo, setOrderInfo ] = useState<ViewModels.StockStateViewModel>();

    useEffect(() => {
        const loadConsumable = buildLoadObjectFunc<ViewModels.ConsumableViewModel>(
            `api/consumables/${consumableId}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            setConsumable
        );
        loadConsumable();
    }, [ consumableId ]);

    const openOrderModal = (stockState: ViewModels.StockStateViewModel) => {
        setOrderInfo(stockState);
        setShowOrderModal(true);
    }

    if(!consumable) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('Consumable')} '{consumable.name}'</h1>
            {resolveText('StockStatus')}:
            <Table>
                <thead>
                    <tr>
                        <th>{resolveText('Stock_Name')}</th>
                        <th>{resolveText('Stock_Quantity')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {consumable.stockStateViewModels.map(stockState => (
                        <tr>
                            <td>{formatStock(stockState.stock)}</td>
                            <td>{stockState.quantity}</td>
                            <td>
                                {stockState.isOrderable 
                                ? <Button
                                    size="sm"
                                    onClick={() => openOrderModal(stockState)}
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
            <ConsumableOrderModal 
                show={showOrderModal} 
                onHide={() => setShowOrderModal(false)} 
                consumableId={consumableId}
                consumableName={consumable.name}
                stockState={orderInfo} 
            />
        </>
    );

}