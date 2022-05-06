import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface QuestionnairesState extends RemoteState {
    items: ViewModels.QuestionnaireAnswersViewModel[];
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
        addQuestionnaireAnswer : (state, action: PayloadAction<ViewModels.QuestionnaireAnswersViewModel>) => {
            state.items.push(action.payload);
        }
    }
});

export const loadQuestionnaireAnswers: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(questionnaireAnswersSlice.actions.setIsLoading(true));
        await loadObject<ViewModels.QuestionnaireAnswersViewModel[]>(
            `api/persons/${personId}/questionnaireAnswers`, {},
            resolveText("QuestionnaireAnswers_CouldNotLoad"),
            questionnaireAnswers => dispatch(questionnaireAnswersSlice.actions.setQuestionnaireAnswers(questionnaireAnswers)),
            () => dispatch(questionnaireAnswersSlice.actions.setIsLoading(false))
        );
    }
}
export const addQuestionnaireAnswer: AsyncActionCreator = (questionnaireAnswer: Models.Interview.QuestionnaireAnswers) => {
    return async (dispatch) => {
        dispatch(questionnaireAnswersSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/questionnaireAnswers`, 
            resolveText("QuestionnaireAnswer_CouldNotStore"),
            questionnaireAnswer,
            async response => {
                const questionnaireAnswerVM = await response.json() as ViewModels.QuestionnaireAnswersViewModel;
                dispatch(questionnaireAnswersSlice.actions.addQuestionnaireAnswer(questionnaireAnswerVM));
            },
            () => dispatch(questionnaireAnswersSlice.actions.setIsSubmitting(false))
        );
    }
}
