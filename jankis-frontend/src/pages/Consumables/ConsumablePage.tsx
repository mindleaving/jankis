import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { ConsumableOrderModal } from '../../modals/ConsumableOrderModal';
import { getStocks } from '../../stores/selectors/stockSelectors';
import { Models } from '../../types/models';

interface ConsumableParams {
    consumableId: string;
}
interface ConsumablePageProps extends RouteComponentProps<ConsumableParams> {}

export const ConsumablePage = (props: ConsumablePageProps) => {

    const id = props.match.params.consumableId;
    const stocks = useSelector(getStocks);
    
    const [ consumable, setConsumable ] = useState<Models.Consumable>();
    const [ showOrderModal, setShowOrderModal ] = useState<boolean>(false);
    const [ orderInfo, setOrderInfo ] = useState<Models.StockState>();

    useEffect(() => {
        const loadConsumable = buildLoadObjectFunc<Models.Consumable>(
            `api/consumables/${id}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            setConsumable
        );
        loadConsumable();
    }, [ id ]);

    const openOrderModal = (stockState: Models.StockState) => {
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
                    {consumable.stockStates.map(stockState => (
                        <tr>
                            <td>{stocks?.find(stock => stock.id === stockState.stockId)?.name ?? resolveText('Loading...')}</td>
                            <td>{stockState.quantity}</td>
                            <td>
                                {stockState.isOrderable 
                                ? <Button
                                    onClick={() => openOrderModal(stockState)}
                                    disabled={!stockState.isUnlimitedOrderable && stockState.quantity === 0}
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
                consumableId={id}
                consumableName={consumable.name}
                orderInfo={orderInfo!} 
            />
        </>
    );

}