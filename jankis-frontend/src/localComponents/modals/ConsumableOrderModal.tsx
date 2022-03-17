import React, { FormEvent, useContext, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Modal, Row } from 'react-bootstrap';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { OrderState } from '../types/enums.d';
import UserContext from '../contexts/UserContext';
import { v4 as uuid } from 'uuid';
import { ViewModels } from '../types/viewModels';
import { formatStock } from '../helpers/Formatters';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { RowFormGroup } from '../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface ConsumableOrderModalProps {
    show: boolean;
    onHide: () => void;
    consumableId?: string;
    consumableName?: string;
    stockState?: ViewModels.StockStateViewModel;
}

export const ConsumableOrderModal = (props: ConsumableOrderModalProps) => {

    const user = useContext(UserContext);
    const [ quantity, setQuantity ] = useState<number>(1);
    const [ note, setNote ] = useState<string>('');
    const [ isOrdering, setIsOrdering ] = useState<boolean>(false);

    const resetAndClose = () => {
        props.onHide();
    }
    const order = async (e?: FormEvent) => {
        e?.preventDefault();
        if(!props.consumableId || !props.consumableName || !props.stockState) {
            return;
        }
        try {
            setIsOrdering(true);
            const consumableOrder = buildOrder();
            await apiClient.instance!.post(`api/consumables/${props.consumableId}/orders/${consumableOrder.id}`, {}, consumableOrder);
            resetAndClose();
            NotificationManager.success(resolveText('Consumable_Order_SuccessfullyOrdered'));
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Consumable_Order_CouldNotOrder'));
        } finally {
            setIsOrdering(false);
        }
    }
    const buildOrder = (): Models.ConsumableOrder => {
        return {
            id: uuid(),
            consumableId: props.consumableId!,
            consumableName: props.consumableName!,
            note: note,
            preferredSources: [ props.stockState!.stockId ],
            quantity: quantity,
            requester: user!.username,
            state: OrderState.Ordered,
            timestamps: []
        };
    }

    return (
        <Modal show={props.show} onHide={resetAndClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{resolveText('Consumable_Order')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={order} id="ConsumableOrderModalForm">
                    <FormGroup as={Row}>
                        <FormLabel column>{resolveText('Consumable')}</FormLabel>
                        <Col>
                            <b>{props.consumableName}</b>
                        </Col>
                    </FormGroup>
                    <FormGroup as={Row}>
                        <FormLabel column>{resolveText('Stock')}</FormLabel>
                        <Col>
                            <b>{props.stockState ? formatStock(props.stockState.stock) : resolveText('Loading...')}</b>
                        </Col>
                    </FormGroup>
                    <RowFormGroup required
                        type="number"
                        min={1}
                        max={props.stockState && !props.stockState.isUnlimitedOrderable ? props.stockState.quantity : undefined}
                        label={resolveText('Consumable_Order_Quantity')}
                        value={quantity}
                        onChange={setQuantity}
                    />
                    <RowFormGroup
                        label={resolveText('Consumable_Order_Note')}
                        as="textarea"
                        value={note}
                        onChange={setNote}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <AsyncButton
                    type="submit" 
                    form="ConsumableOrderModalForm" 
                    activeText={resolveText('Order')}
                    executingText={resolveText('Ordering...')}
                    isExecuting={isOrdering}
                />
                <Button variant="secondary" onClick={resetAndClose} disabled={isOrdering}>{resolveText('Cancel')}</Button>
            </Modal.Footer>
        </Modal>
    );

}