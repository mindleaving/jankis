import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { AutoCompleteContext } from '../../types/enums.d';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface CreateEditDrugPageProps {}

export const CreateEditDrugPage = (props: CreateEditDrugPageProps) => {

    const { drugId } = useParams();
    const navigate = useNavigate();
    
    return (
        <>
            <h1>{resolveText('Drug')}</h1>
            <DrugForm
                drugId={drugId}
                onDrugCreated={() => navigate(-1)}
            />
        </>
    );

}