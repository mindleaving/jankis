import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface QuestionnaireAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Interview.Questionnaire;
    onChange: (questionnaire: Models.Interview.Questionnaire | undefined) => void;
}

export const QuestionnaireAutocomplete = (props: QuestionnaireAutocompleteProps) => {

    const questionnaireAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Interview.Questionnaire>('api/questionnaires/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.value!.title}
        </Alert>);
    }
    return (<Autocomplete
        search={questionnaireAutocompleteRunner.search}
        displayNameSelector={x => !x ? resolveText("UnnamedQuestionnaire") : `${x.title} (${x.language})`}
        onItemSelected={props.onChange}
    />);

}