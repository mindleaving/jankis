import React, { FormEvent, useEffect, useState } from 'react';
import { Form, FormGroup, Row, FormLabel, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { AutoCompleteContext } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { sendPutRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { NotificationManager } from 'react-notifications';

interface DrugFormProps {
    drugId?: string;
    onDrugCreated?: (drug: Models.Medication.Drug) => void;
}

export const DrugForm = (props: DrugFormProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ id, setId ] = useState<string>(props.drugId ?? uuid());
    const [ productName, setProductName ] = useState<string>('');
    const [ brand, setBrand ] = useState<string>('');
    const [ newActiveIngredient, setNewActiveIngredient ] = useState<string>('');
    const [ activeIngredients, setActiveIngredients ] = useState<string[]>([]);
    const [ applicationSite, setApplicationSite ] = useState<string>('');
    const [ dispensionForm, setDispensionForm ] = useState<string>('');
    const [ amountValue, setAmountValue ] = useState<number>(0);
    const [ amountUnit, setAmountUnit ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    useEffect(() => {
        if(!props.drugId) {
            return;
        }
        setId(props.drugId);
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
    }, [ props.drugId ]);

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
        const drug = buildDrug();
        await sendPutRequest(
            `api/drugs/${drug.id}`,
            resolveText('Drug_CouldNotStore'),
            drug,
            () => {
                NotificationManager.success(resolveText('Drug_SuccessfullyStored'));
                if(props.onDrugCreated) {
                    props.onDrugCreated(drug);
                }
            },
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
    );

}