import React, { FormEvent, useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { v4 as uuid } from 'uuid';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Models } from '../../types/models';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { RowFormGroup } from '../../components/RowFormGroup';
import { StockState } from '../../components/Consumables/StockState';
import { StoreButton } from '../../components/StoreButton';

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
    const [ stockStates, setStockStates ] = useState<Models.StockState[]>([]);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadConsumable = buildLoadObjectFunc<Models.Consumable>(
            `api/consumables/${matchedId}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            item => {
                setName(item.name);
                setStockStates(item.stockStates);
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
    const updateStockState = (updatedStockState: Models.StockState) => {
        setStockStates(stockStates.map(x => {
            return x.stockId === updatedStockState.stockId ? updatedStockState : x;
        }));
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>)
    }

    return (
        <>
            <h1>{resolveText('Consumable')}</h1>
            <Form onSubmit={store}>
                <RowFormGroup
                    label={resolveText('Consumable_Name')}
                    value={name}
                    onChange={setName}
                />
                <h3>{resolveText('Consumable_StockStates')}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>{resolveText('StockState_Stock')}</th>
                            <th>{resolveText('StockState_IsOrderable')}</th>
                            <th>{resolveText('StockState_IsUnlimitedOrderable')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockStates.map(stockState => (
                            <StockState key={stockState.stockId}
                                stockState={stockState}
                                onChange={updateStockState}
                            />
                        ))}
                    </tbody>
                </Table>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}