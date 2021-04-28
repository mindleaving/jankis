import React, { useEffect, useState } from 'react';
import { Button, FormCheck, FormControl } from 'react-bootstrap';
import { formatServiceAudience, formatStock } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildServiceAudienceModel } from '../../helpers/ModelBuilders';
import { CreateServiceAudienceModal } from '../../modals/CreateServiceAudienceModal';
import { ViewModels } from '../../types/viewModels';
import { ListFormControl } from '../ListFormControl';

interface StockStateProps {
    stockState: ViewModels.StockStateViewModel;
    onChange: (stockState: ViewModels.StockStateViewModel) => void;
    onDelete: () => void;
}

export const StockState = (props: StockStateProps) => {

    const [ isOrderable, setIsOrderable ] = useState<boolean>(props.stockState.isOrderable);
    const [ isUnlimitedOrderable, setIsUnlimitedOrderable ] = useState<boolean>(props.stockState.isUnlimitedOrderable);
    const [ audience, setAudience ] = useState<ViewModels.ServiceAudienceViewModel[]>(props.stockState.audience);
    const [ quantity, setQuantity ] = useState<number>(props.stockState.quantity);
    const [ showServiceAudienceModal, setShowServiceAudienceModal ] = useState<boolean>(false);

    useEffect(() => {
        const stockState: ViewModels.StockStateViewModel = {
            stockId: props.stockState.stockId,
            stock: props.stockState.stock,
            isOrderable: isOrderable,
            isUnlimitedOrderable: isUnlimitedOrderable,
            orderableBy: audience.map(buildServiceAudienceModel),
            audience: audience,
            quantity: quantity
        }
        props.onChange(stockState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isOrderable, isUnlimitedOrderable, audience, quantity ]);

    const removeAudienceItem = (audienceItem: ViewModels.ServiceAudienceViewModel) => {
        setAudience(audience.filter(x => x !== audienceItem));
    }
    return (
        <tr>
            <td>
                <i className="fa fa-trash red clickable" onClick={props.onDelete} />
            </td>
            <td>{formatStock(props.stockState.stock)}</td>
            <td>
                <FormControl
                    type="number"
                    value={quantity}
                    onChange={(e:any) => setQuantity(e.target.value)}
                />
            </td>
            <td>
                <FormCheck
                    checked={isOrderable}
                    onChange={(e:any) => setIsOrderable(e.target.checked)}
                />
            </td>
            <td>
                <FormCheck
                    checked={isUnlimitedOrderable}
                    onChange={(e:any) => setIsUnlimitedOrderable(e.target.checked)}
                    disabled={!isOrderable}
                />
            </td>
            <td>
                {isOrderable
                ? <>
                    <ListFormControl
                        items={audience}
                        idFunc={formatServiceAudience}
                        displayFunc={formatServiceAudience}
                        removeItem={removeAudienceItem}
                    />
                    <Button size="sm" className="m-2" onClick={() => setShowServiceAudienceModal(true)}>+ {resolveText('Add')}</Button>
                    <CreateServiceAudienceModal
                        show={showServiceAudienceModal}
                        onClose={() => setShowServiceAudienceModal(false)}
                        onServiceAudienceCreated={audienceItem => setAudience(audience.concat(audienceItem))}
                    />
                </> : null}
            </td>
        </tr>
    );

}