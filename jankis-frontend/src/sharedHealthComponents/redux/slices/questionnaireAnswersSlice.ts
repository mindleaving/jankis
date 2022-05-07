import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface QuestionnairesState extends RemoteState<ViewModels.QuestionnaireAnswersViewModel> {
}

const initialState: QuestionnairesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const questionnaireAnswersSlice = createSlice({
    name: 'questionnaireAnswers',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setQuestionnaireAnswers: (state, action: PayloadAction<ViewModels.QuestionnaireAnswersViewModel[]>) => {
            state.items = action.payload;
        },
        addOrUpdateQuestionnaireAnswer: (state, action: PayloadAction<ViewModels.QuestionnaireAnswersViewModel>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadQuestionnaireAnswers = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/questionnaireAnswers`,
    () => resolveText("QuestionnaireAnswers_CouldNotLoad"),
    questionnaireAnswersSlice.actions.setIsLoading,
    questionnaireAnswersSlice.actions.setQuestionnaireAnswers
);
export const addQuestionnaireAnswer = postActionBuilder(
    () => `api/questionnaireAnswers`, 
    () => resolveText("QuestionnaireAnswer_CouldNotStore"),
    questionnaireAnswersSlice.actions.setIsSubmitting,
    questionnaireAnswersSlice.actions.addOrUpdateQuestionnaireAnswer
);
