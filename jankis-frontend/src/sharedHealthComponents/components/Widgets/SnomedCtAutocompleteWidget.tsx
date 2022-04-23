import { WidgetProps } from '@rjsf/core';
import { useEffect, useState } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { MedicalProcedureAutocomplete } from '../Autocompletes/MedicalProcedureAutocomplete';

export const SnomedCtAutocompleteWidget = (props: WidgetProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ procedureDefinition, setProcedureDefinition ] = useState<Models.Procedures.MedicalProcedureDefinition>();

    useEffect(() => {
        if(!props.value || props.value === procedureDefinition?.snomedCtCode) {
            return;
        }
        setIsLoading(true);
        const loadIcdCategory = buildLoadObjectFunc(
            `api/medicalproceduredefinitions/${props.value}`, {},
            resolveText("MedicalProcedureDefinition_CouldNotLoad"),
            setProcedureDefinition,
            () => setIsLoading(false)
        );
        loadIcdCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.value]);

    useEffect(() => {
        props.onChange(procedureDefinition?.snomedCtCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ procedureDefinition ]);

    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <MedicalProcedureAutocomplete
                isLoading={isLoading}
                value={procedureDefinition}
                onChange={setProcedureDefinition}
            />
        </FormGroup>
    );

}