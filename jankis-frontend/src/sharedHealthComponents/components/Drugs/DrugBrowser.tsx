import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { DrugsFilter } from '../../types/frontendTypes';
import { DrugsFilterView } from '../Drugs/DrugsFilterView';
import { DrugsList } from '../Drugs/DrugsList';
import { DrugForm } from './DrugForm';

interface DrugBrowserProps {}

export const DrugBrowser = (props: DrugBrowserProps) => {

    const [ filter, setFilter ] = useState<DrugsFilter>({});
    const [ selectedDrugId, setSelectedDrugId ] = useState<string>();
    const [ showDrugForm, setShowDrugForm ] = useState<boolean>(false);

    return (
        <>
            {showDrugForm
            ? <Card className='m-3'>
                <Card.Header>{resolveText("AddNew")}</Card.Header>
                <Card.Body>
                    <DrugForm
                        key={selectedDrugId ?? uuid()}
                        drugId={selectedDrugId}
                        onDrugCreated={drug => {
                            setFilter({ searchText: drug.productName });
                            setShowDrugForm(false);
                        }}
                    />
                </Card.Body>
            </Card> : null}
            <DrugsFilterView
                setFilter={setFilter}
            />
            <DrugsList
                filter={filter}
                onDrugSelected={drugId => {
                    setSelectedDrugId(drugId);
                    setShowDrugForm(true);
                }}
                onCreateDrug={() => {
                    setSelectedDrugId(undefined);
                    setShowDrugForm(true);
                }}
            />
        </>
    );

}