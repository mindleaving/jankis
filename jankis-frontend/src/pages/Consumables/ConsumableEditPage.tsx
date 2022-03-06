import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { v4 as uuid } from 'uuid';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Models } from '../../types/models';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { StockState } from '../../components/Consumables/StockState';
import { StoreButton } from '../../components/StoreButton';
import { CreateStockStateModal } from '../../modals/CreateStockStateModal';
import { ViewModels } from '../../types/viewModels';

interface ConsumableParams {
    consumableId?: string;
}
interface ConsumableEditPageProps extends RouteComponentProps<ConsumableParams> {}

export const ConsumableEditPage = (props: ConsumableEditPageProps) => {
    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.consumableId) {
        throw new Error(resolveText('MissingID'));
    }
    const matchedId = props.match.params.consumableId;
    const id = matchedId ?? uuid();

    const [ isLoading, setIsLoading ] =  useState<boolean>(!isNew);
    const [ name, setName ] = useState<string>('');
    const [ stockStates, setStockStates ] = useState<ViewModels.StockStateViewModel[]>([]);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ showStockStateCreationModal, setShowStockStateCreationModal] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadConsumable = buildLoadObjectFunc<ViewModels.ConsumableViewModel>(
            `api/consumables/${matchedId}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            item => {
                setName(item.name);
                setStockStates(item.stockStateViewModels);
            },
            () => setIsLoading(false)
        );
        loadConsumable();
    }, [ isNew, matchedId ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject(
            `api/consumables/${id}`,
            resolveText('Consumable_SuccessfullyStored'),
            resolveText('Consumable_CouldNotStore'),
            buildConsumable,
            () => history.goBack(),
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