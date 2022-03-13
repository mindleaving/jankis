import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { StoreButton } from '../../components/StoreButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { MemoryFormControl } from '../../components/MemoryFormControl';
import { ListFormControl } from '../../components/ListFormControl';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { AutoCompleteContext } from '../../types/enums.d';

interface DrugParams {
    drugId?: string;
}
interface CreateEditDrugPageProps extends RouteComponentProps<DrugParams> {}

export const CreateEditDrugPage = (props: CreateEditDrugPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.drugId) {
        throw new Error("Missing ID");
    }
    const id = props.match.params.drugId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ productName, setProductName ] = useState<string>('');
    const [ brand, setBrand ] = useState<string>('');
    const [ newActiveIngredient, setNewActiveIngredient ] = useState<string>('');
    const [ activeIngredients, setActiveIngredients ] = useState<string[]>([]);
    const [ applicationSite, setApplicationSite ] = useState<string>('');
    const [ dispensionForm, setDispensionForm ] = useState<string>('');
    const [ amountValue, setAmountValue ] = useState<number>(0);
    const [ amountUnit, setAmountUnit ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadDrug = buildLoadObjectFunc<Models.Medication.Drug>(
            `api/drugs/${id}`,
            {},
            resolveText('Drug_CouldNotLoad'),
            item => {
                setProductName(item.productName);
                setBrand(item.brand);
                setActiveIngredients(item.activeIngredients);
                setApplicationSite(item.applicationSite);
                setDispensionForm(item.dispensionForm);
                setAmountValue(item.amountValue);
                setAmountUnit(item.amountUnit);
            },
            () => setIsLoading(false)
        );
        loadDrug();
    }, [ isNew, id]);

    const addActiveIngredient = () => {
        if(!newActiveIngredient) {
            return;
        }
        if(activeIngredients.includes(newActiveIngredient)) {
            return;
        }
        setActiveIngredients(activeIngredients.concat(newActiveIngredient));
    }
    const removeActiveIngredient = (activeIngredient: string) => {
        setActiveIngredients(activeIngredients.filter(x => x !== activeIngredient));
    }

    const store = async (e: FormEvent) => {
        e.preventDefault();
        await buidlAndStoreObject(
            `api/drugs/${id}`,
            resolveText('Drug_SuccessfullyStored'),
            resolveText('Drug_CouldNotStore'),
            buildDrug,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }
    const buildDrug = (): Models.Medication.Drug => {
        return {
            id: id,
            productName: productName,
            brand: brand,
            activeIngredients: activeIngredients,
            applicationSite: applicationSite,
            dispensionForm: dispensionForm,
            amountValue: amountValue,
            amountUnit: amountUnit
        };
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('Drug')} - '{productName}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Drug_ProductName')}
                    value={productName}
                    onChange={setProductName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Drug_Brand')}</FormLabel>
                    <Col>
                        <MemoryFormControl
                            context={AutoCompleteContext.DrugBrand}
                            defaultValue={brand}
                            onChange={setBrand}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Drug_ActiveIngredients')}</FormLabel>
                    <Col>
                        <InputGroup>
                            <MemoryFormControl
                                context={AutoCompleteContext.DrugActiveIngredient}
                                onChange={setNewActiveIngredient}
                            />
                            <Button className="mx-2" onClick={addActiveIngredient}>{resolveText('Add')}</Button>
                        </InputGroup>
                    </Col>
                </FormGroup>
                <Row>
                    <Col></Col>
                    <Col>
                        <ListFormControl
                            items={activeIngredients}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removeActiveIngredient}
                        />
                    </Col>
                </Row>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Drug_ApplicationSite')}</FormLabel>
                    <Col>
                        <MemoryFormControl required
                            context={AutoCompleteContext.DrugApplicationSite}
                            defaultValue={applicationSite}
                            onChange={setApplicationSite}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Drug_DispensionForm')}</FormLabel>
                    <Col>
                        <MemoryFormControl required
                            context={AutoCompleteContext.DrugDispensionForm}
                            defaultValue={dispensionForm}
                            onChange={setDispensionForm}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Drug_Amount')}</FormLabel>
                    <Col>
                        <InputGroup>
                            <FormControl required
                                type="number"
                                value={amountValue}
                                onChange={(e:any) => setAmountValue(e.target.value)}
                            />
                            <MemoryFormControl required
                                className="mx-2"
                                context={AutoCompleteContext.Unit}
                                defaultValue={amountUnit}
                                onChange={setAmountUnit}
                                placeholder={resolveText('Unit')}
                                minSearchTextLength={1}
                            />
                        </InputGroup>
                    </Col>
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}