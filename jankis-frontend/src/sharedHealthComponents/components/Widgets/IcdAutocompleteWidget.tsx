import { WidgetProps } from '@rjsf/core';
import React, { useEffect, useState } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { IcdAutocomplete } from '../Autocompletes/IcdAutocomplete';

export const IcdAutocompleteWidget = (props: WidgetProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ icdCategory, setIcdCategory ] = useState<Models.Icd.IcdCategory>();

    useEffect(() => {
        if(!props.value || props.value === icdCategory?.code) {
            return;
        }
        setIsLoading(true);
        const loadIcdCategory = buildLoadObjectFunc(
            `api/classifications/icd11/${props.value}`, {},
            resolveText("IcdCategory_CouldNotLoad"),
            setIcdCategory,
            () => {},
            () => setIsLoading(false)
        );
        loadIcdCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.value]);

    useEffect(() => {
        props.onChange(icdCategory?.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ icdCategory ]);

    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <IcdAutocomplete
                isLoading={isLoading}
                value={icdCategory}
                onChange={setIcdCategory}
            />
        </FormGroup>
    );
}