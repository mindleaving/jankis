import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { v4 as uuid } from 'uuid';
import { Models } from '../../types/models';
import { StockState } from '../../components/Consumables/StockState';
import { CreateStockStateModal } from '../../modals/CreateStockStateModal';
import { ViewModels } from '../../types/viewModels';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface ConsumableEditPageProps {}

export const ConsumableEditPage = (props: ConsumableEditPageProps) => {
    const location = useLocation();
    const { consumableId } = useParams();
    const isNew = location.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !consumableId) {
        throw new Error(resolveText('MissingID'));
    }
    const id = consumableId ?? uuid();

    const [ isLoading, setIsLoading ] =  useState<boolean>(!isNew);
    const [ name, setName ] = useState<string>('');
    const [ stockStates, setStockStates ] = useState<ViewModels.StockStateViewModel[]>([]);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ showStockStateCreationModal, setShowStockStateCreationModal] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadConsumable = buildLoadObjectFunc<ViewModels.ConsumableViewModel>(
            `api/consumables/${consumableId}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            item => {
                setName(item.name);
                setStockStates(item.stockStateViewModels);
            },
            () => setIsLoading(false)
        );
        loadConsumable();
    }, [ isNew, consumableId ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoring(true);
        await buildAndStoreObject(
            `api/consumables/${id}`,
            resolveText('Consumable_SuccessfullyStored'),
            resolveText('Consumable_CouldNotStore'),
            buildConsumable,
            () => navigate(-1),
            () => setIsStoring(false)
        );
    }
    const buildConsumable = (): Models.Consumable => {
        return {
            id: id,
            name: name,
            stockStates: stockStates
        };
    }
    const addStockState = (stockState: ViewModels.StockStateViewModel) => {
        setStockStates(stockStates.concat(stockState));
    }
    const updateStockState = (updatedStockState: ViewModels.StockStateViewModel) => {
        setStockStates(stockStates.map(x => {
            return x.stockId === updatedStockState.stockId ? updatedStockState : x;
        }));
    }
    const deleteStockState = (stockId: string) => {
        setStockStates(stockStates.filter(x => x.stockId !== stockId));
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>)
    }

    return (
        <>
            <h1>{resolveText('Consumable')}</h1>
            <Form onSubmit={store}>
                <FormGroup as={Row}>
                    <FormLabel column md="3">{resolveText('Consumable_Name')}</FormLabel>
                    <Col md="8">
                        <FormControl
                            value={name}
                            onChange={(e:any) => setName(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <Row>
                    <FormLabel column md="3">{resolveText('Consumable_StockStates')}</FormLabel>
                    <Col md="8">
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{resolveText('StockState_Stock')}</th>
                                    <th>{resolveText('StockState_Quantity')}</th>
                                    <th>{resolveText('StockState_IsOrderable')}</th>
                                    <th>{resolveText('StockState_IsUnlimitedOrderable')}</th>
                                    <th>{resolveText('StockState_OrderableBy')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockStates.map(stockState => (
                                    <StockState key={stockState.stockId}
                                        stockState={stockState}
                                        onChange={updateStockState}
                                        onDelete={() => deleteStockState(stockState.stockId)}
                                    />
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={() => setShowStockStateCreationModal(true)}>{resolveText('Add')}</Button>
                    </Col>
                </Row>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
            <CreateStockStateModal
                show={showStockStateCreationModal}
                onClose={() => setShowStockStateCreationModal(false)}
                onStockStateCreated={addStockState}
            />
        </>
    );

}