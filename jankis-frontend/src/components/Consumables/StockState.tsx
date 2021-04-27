import React, { useEffect, useState } from 'react';
import { Button, FormCheck, FormControl } from 'react-bootstrap';
import { formatServiceAudience } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { CreateServiceAudienceModal } from '../../modals/CreateServiceAudienceModal';
import { Models } from '../../types/models';
import { ListFormControl } from '../ListFormControl';

interface StockStateProps {
    stockState: Models.StockState;
    onChange: (stockState: Models.StockState) => void;
}

export const StockState = (props: StockStateProps) => {

    const [ isOrderable, setIsOrderable ] = useState<boolean>(props.stockState.isOrderable);
    const [ isUnlimitedOrderable, setIsUnlimitedOrderable ] = useState<boolean>(props.stockState.isUnlimitedOrderable);
    const [ audience, setAudience ] = useState<Models.ServiceAudience[]>([]);
    const [ quantity, setQuantity ] = useState<number>(0);
    const [ showServiceAudienceModal, setShowServiceAudienceModal ] = useState<boolean>(false);

    useEffect(() => {
        const stockState: Models.StockState = {
            stockId: props.stockState.stockId,
            isOrderable: isOrderable,
            isUnlimitedOrderable: isUnlimitedOrderable,
            orderableBy: audience,
            quantity: quantity
        }
        props.onChange(stockState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isOrderable, isUnlimitedOrderable, audience, quantity ]);

    const removeAudienceItem = (audienceItem: Models.ServiceAudience) => {
        setAudience(audience.filter(x => x !== audienceItem));
    }
    return (
        <tr>
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
                    <Button size="sm" onClick={() => setShowServiceAudienceModal(true)}>+ {resolveText('Add')}</Button>
                    <CreateServiceAudienceModal
                        show={showServiceAudienceModal}
                        onClose={() => setShowServiceAudienceModal(false)}
                        onServiceAudienceCreated={audienceItem => setAudience(audience.concat(audienceItem))}
                    />
                </> : null}
            </td>
            <td>
                <FormControl
                    type="number"
                    value={quantity}
                    onChange={(e:any) => setQuantity(e.target.value)}
                />
            </td>
        </tr>
    );

}