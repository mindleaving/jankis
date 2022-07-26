import React, { FormEvent, useEffect, useState } from 'react';
import { Form, FormGroup, Row, FormLabel, Col, InputGroup, Button, FormControl, FormCheck } from 'react-bootstrap';
import { AutoCompleteContext, DrugType } from '../../../localComponents/types/enums.d';
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
    const [ isImmunization, setIsImmunization ] = useState<boolean>(false);
    const [ productName, setProductName ] = useState<string>('');
    const [ brand, setBrand ] = useState<string>('');
    const [ newActiveIngredient, setNewActiveIngredient ] = useState<string>('');
    const [ activeIngredients, setActiveIngredients ] = useState<string[]>([]);
    const [ applicationSite, setApplicationSite ] = useState<string>('');
    const [ dispensionForm, setDispensionForm ] = useState<string>('');
    const [ amountValue, setAmountValue ] = useState<number>(0);
    const [ amountUnit, setAmountUnit ] = useState<string>('');
    const [ newPathogen, setNewPathogen ] = useState<string>('');
    const [ protectsAgainst, setProtectsAgainst ] = useState<string[]>([]);
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
                setIsImmunization(item.type === DrugType.Immunization);
                setProductName(item.productName);
                setBrand(item.brand);
                setActiveIngredients(item.activeIngredients);
                setApplicationSite(item.applicationSite);
                setDispensionForm(item.dispensionForm);
                setAmountValue(item.amountValue);
                setAmountUnit(item.amountUnit);
                setProtectsAgainst(item.protectsAgainst);
            },
            () => {},
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
            () => {},
            () => setIsStoring(false)
        );
    }
    const buildDrug = (): Models.Medication.Drug => {
        return {
            id: id,
            type: isImmunization ? DrugType.Immunization : DrugType.Unknown,
            productName: productName,
            brand: brand,
            activeIngredients: activeIngredients,
            applicationSite: applicationSite,
            dispensionForm: dispensionForm,
            amountValue: amountValue,
            amountUnit: amountUnit,
            protectsAgainst: protectsAgainst
        };
    }

    const addPathogen = () => {
        if(protectsAgainst.includes(newPathogen)) {
            return;
        }
        setProtectsAgainst(state => state.concat(newPathogen));
    }
    const removePathogen = (pathogen: string) => {
        setProtectsAgainst(state => state.filter(x => x !== pathogen));
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <Form onSubmit={store}>
            <FormGroup as={Row} className="my-2">
                <Col></Col>
                <Col>
                    <FormCheck
                        checked={isImmunization}
                        onChange={(e:any) => setIsImmunization(e.target.checked)}
                        label={resolveText("Drug_IsImmunization")}
                    />
                </Col>
            </FormGroup>
            <RowFormGroup required
                label={resolveText('Drug_ProductName')}
                value={productName}
                onChange={setProductName}
            />
            <FormGroup as={Row} className="my-2">
                <FormLabel column>{resolveText('Drug_Brand')}</FormLabel>
                <Col>
                    <MemoryFormControl
                        context={AutoCompleteContext.DrugBrand}
                        defaultValue={brand}
                        onChange={setBrand}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row} className="my-2">
                <FormLabel column>{resolveText('Drug_ActiveIngredients')}</FormLabel>
                <Col>
                    <Row>
                        <Col>
                            <MemoryFormControl
                                context={AutoCompleteContext.DrugActiveIngredient}
                                onChange={setNewActiveIngredient}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button className="mx-2" onClick={addActiveIngredient}>{resolveText('Add')}</Button>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>
            <Row className="my-2">
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
            <FormGroup as={Row} className="my-2">
                <FormLabel column>{resolveText('Drug_ApplicationSite')}</FormLabel>
                <Col>
                    <MemoryFormControl required
                        context={AutoCompleteContext.DrugApplicationSite}
                        defaultValue={applicationSite}
                        onChange={setApplicationSite}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row} className="my-2">
                <FormLabel column>{resolveText('Drug_DispensionForm')}</FormLabel>
                <Col>
                    <MemoryFormControl required
                        context={AutoCompleteContext.DrugDispensionForm}
                        defaultValue={dispensionForm}
                        onChange={setDispensionForm}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row} className="my-2">
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
            {isImmunization
            ? <>
                <FormGroup as={Row} className="my-2">
                    <FormLabel column>{resolveText("Immunization_ProtectsAgainst")}</FormLabel>
                    <Col>
                        <Row>
                            <Col>
                                <MemoryFormControl
                                    context={AutoCompleteContext.ImmunizationPathogen}
                                    onChange={setNewPathogen}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    className='mx-2'
                                    onClick={addPathogen}
                                >
                                    {resolveText("Add")}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <Row>
                    <Col></Col>
                    <Col>
                        <ListFormControl
                            items={protectsAgainst}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removePathogen}
                        />
                    </Col>
                </Row>
            </>
            : null}
            <StoreButton
                type="submit"
                isStoring={isStoring}
            />
        </Form>
    );

}