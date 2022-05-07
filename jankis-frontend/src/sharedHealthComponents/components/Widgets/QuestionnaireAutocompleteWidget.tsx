import { WidgetProps } from "@rjsf/core";
import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { buildLoadObjectFunc } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { Models } from "../../../localComponents/types/models";
import { QuestionnaireAutocomplete } from "../Autocompletes/QuestionnaireAutocomplete";

export const QuestionnaireAutocompleteWidget = (props: WidgetProps) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(!!props.value);
    const [ item, setItem ] = useState<Models.Interview.Questionnaire>();

    useEffect(() => {
        if(props.value === item?.id) {
            return;
        }
        if(!props.value) {
            setItem(undefined);
            return;
        }
        setIsLoading(true);
        const loadItem = buildLoadObjectFunc<Models.Interview.Questionnaire>(
            `api/questionnaires/${props.value}`, {},
            resolveText("Questionnaire_CouldNotLoad"),
            setItem,
            () => {},
            () => setIsLoading(false)
        );
        loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.value ]);

    useEffect(() => {
        props.onChange(item?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ item ]);

    if(isLoading) {
        return (<Alert
            variant='info'
        >
            {resolveText("Loading...")}
        </Alert>);
    }

    return (
        <QuestionnaireAutocomplete
            value={item}
            onChange={setItem}
        />
    )
}