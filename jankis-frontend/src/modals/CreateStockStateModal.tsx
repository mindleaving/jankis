import React, { FormEvent, useState } from 'react';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, Modal, Row } from 'react-bootstrap';
import { StockAutocomplete } from '../components/Autocompletes/StockAutocomplete';
import { ListFormControl } from '../components/ListFormControl';
import { ServiceAudienceEditForm } from '../components/Services/ServiceAudienceEditForm';
import { formatServiceAudience } from '../helpers/Formatters';
import { resolveText } from '../helpers/Globalizer';
import { buildServiceAudienceModel } from '../helpers/ModelBuilders';
import { ViewModels } from '../types/viewModels';

interface CreateStockStateModalProps {
    show: boolean;
    onClose: () => void;
    onStockStateCreated: (stockState: ViewModels.StockStateViewModel) => void;
}

export const CreateStockStateModal = (props: CreateStockStateModalProps) => {

    const [ stock, setStock ] = useState<ViewModels.StockViewModel>();
    const [ isOrderable, setIsOrderable ] = useState<boolean>(false);
    const [ isUnlimitedOrderable, setIsUnlimitedOrderable ] = useState<boolean>(false);
    const [ audience, setAudience ] = useState<ViewModels.ServiceAudienceViewModel[]>([]);
    const [ quantity, setQuantity ] = useState<number>(0);

    const createStoreState = (e: FormEvent) => {
        e.preventDefault();
        if(!stock) return;
        const stockState: ViewModels.StockStateViewModel = {
            stockId: stock.id,
            stock: stock,
            isOrderable: isOrderable,
            isUnlimitedOrderable: isUnlimitedOrderable,
            orderableBy: audience.map(buildServiceAudienceModel),
            audience: audience,
            quantity: quantity
        };
        props.onStockStateCreated(stockState);
        props.onClose();
    }
    const addAudienceItem = (audienceItem: ViewModels.ServiceAudienceViewModel) => {
        setAudience(audience.concat(audienceItem));
    }
    const removeAudienceItem = (audienceItem: ViewModels.ServiceAudienceViewModel) => {
        setAudience(audience.filter(x => x !== audienceItem));
    }

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header>
                <Modal.Title>{resolveText('StockState_Create')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="CreateStockStateModal" onSubmit={createStoreState}>
                    <FormGroup>
                        <FormLabel>{resolveText('StockState_Stock')}</FormLabel>
                        <StockAutocomplete
                            value={stock}
                            onChange={setStock}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>{resolveText('StockState_Quantity')}</FormLabel>
                        <FormControl
                            type="number"
                            value={quantity}
                            onChange={(e:any) => setQuantity(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup as={Row}>
                        <FormLabel column>{resolveText('StockState_IsOrderable')}</FormLabel>
                        <Col>
                            <FormCheck
                                checked={isOrderable}
                                onChange={(e:any) => setIsOrderable(e.target.cheked)}
                            />
                        </Col>
                    </FormGroup>
                    {isOrderable
                    ? <>
                        <FormGroup as={Row}>
                            <FormLabel column>{resolveText('StockState_IsUnlimitedOrderable')}</FormLabel>
                            <Col>
                                <FormCheck
                                    checked={isUnlimitedOrderable}
                                    onChange={(e:any) => setIsUnlimitedOrderable(e.target.cheked)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>{resolveText('StockState_OrderableBy')}</FormLabel>
                            <ServiceAudienceEditForm
                                addAudience={addAudienceItem}
                            />
                        </FormGroup>
                        <ListFormControl
                            items={audience}
                            idFunc={formatServiceAudience}
                            displayFunc={formatServiceAudience}
                            removeItem={removeAudienceItem}
                        />
                    </> : null}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.onClose()}>{resolveText('Cancel')}</Button>
                <Button type="submit" form="CreateStockStateModal" disabled={!stock}>{resolveText('Add')}</Button>
            </Modal.Footer>
        </Modal>
    );

}